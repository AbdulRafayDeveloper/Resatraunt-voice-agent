# TableTalk voice agent

An always-on Node.js service that answers the restaurant's phone number and books tables by talking to the caller. Telnyx carries the call; this service does everything else: speech-to-text and text-to-speech with OpenAI, reasoning with a LangChain agent, and bookings saved to MongoDB.

It lives next to the Next.js website in this repository but is a separate package (`voice-agent/`) with its own dependencies, so it can be deployed on an always-on host (Render, Railway, Fly) while the website stays on Vercel.

What it does:

- Collects exactly four things: name, number of people, day and time.
- Books one-hour slots starting on the hour, 11:00 to 22:00 (the restaurant closes at 23:00), 10 tables per slot.
- Checks availability before confirming; if a slot is full it offers the nearest free times on the same day.
- Handles invalid requests gracefully (closed hours, past times, vague days) by asking again.
- Reads the booking back for confirmation, saves it, repeats the confirmed details and ends the call politely.
- New bookings only. No cancellations or changes, no SMS/email, no admin, no payments, no in-browser calling.

## Call flow

1. The caller dials the Telnyx number. Telnyx POSTs `call.initiated` to `POST /telnyx/webhook` (`src/routes/telnyxWebhook.ts`). The Ed25519 signature is verified over the raw body (`src/telnyx/signature.ts`), the event is validated with zod (`src/telnyx/types.ts`) and handled (`src/telnyx/webhook.ts`).
2. The service answers the call with the Call Control `answer` command and asks Telnyx to open a bidirectional PCMU media stream to `wss://<PUBLIC_BASE_URL>/telnyx/media` (`src/telnyx/client.ts`).
3. Telnyx connects to the WebSocket (`src/routes/telnyxMedia.ts`, `src/telnyx/mediaStream.ts`). The `start` message carries the `call_control_id`, which creates a `CallSession` in the `CallRegistry` (`src/call/registry.ts`, `src/call/session.ts`).
4. The session plays the greeting ("Thanks for calling TableTalk. I can book a table for you. What name should I put it under?"). Audio is synthesised by OpenAI TTS as 24 kHz PCM, resampled to 8 kHz, mu-law encoded (`src/speech/tts.ts`, `src/audio/`) and paced onto the call in 20 ms chunks (`src/call/player.ts`).
5. Inbound mu-law audio is decoded, resampled to 16 kHz and fed to an energy-based voice activity detector (`src/audio/vad.ts`). When the caller stops speaking, the utterance is sent to OpenAI speech-to-text as WAV (`src/speech/stt.ts`).
6. The transcript goes to the booking agent (`src/agent/bookingAgent.ts`): a controlled tool-calling loop over a LangChain chat model with the tools `check_availability`, `create_booking` and `get_current_datetime` (`src/agent/tools.ts`) and the system prompt in `src/agent/prompt.ts`. Every reply is delivered through an `end_turn` tool call that says what to speak and whether to hang up.
7. Availability and reservations go through the `BookingStore` (`src/bookings/`). The Mongo implementation increments a per-slot counter with a filtered upsert, so the eleventh booking for a slot can never succeed, then inserts the booking document. Slot rules (opening hours, past slots, alternatives) are pure functions in `src/bookings/availability.ts`.
8. The reply is spoken. If the caller talks over it, the session stops playback and sends `clear` to Telnyx (barge-in). After 8 s of silence it asks "Are you still there?"; after a second silent prompt, or 6 minutes in total, it says goodbye and hangs up.
9. When the agent sets `endCall`, the goodbye is played to the end and the service sends the `hangup` command. `call.hangup` or the stream's `stop` message ends the session.

Any OpenAI failure (STT, model or TTS) makes the agent apologise and ask the caller to repeat; the process never crashes because of a bad turn.

## Running locally

Requirements: Node 20.19+, a MongoDB instance (local or Atlas), an OpenAI API key, a Telnyx account.

```bash
cd voice-agent
npm install
cp .env.example .env      # fill in the values
npm run dev               # http://localhost:8080, restarts on change
npm run seed              # dummy bookings for the next 7 days (add --reset to clear first)
```

Other scripts: `npm test` (vitest, no network or database needed), `npm run lint`, `npm run typecheck`, `npm run build` then `npm start`.

`GET /health` returns `{ status, mongo, activeCalls, uptimeSeconds }`.

### Seed data

`npm run seed` inserts, relative to today in `RESTAURANT_TIMEZONE`:

- tomorrow 19:00: fully booked (10 bookings), so asking for "7 pm tomorrow" exercises the full-slot path;
- tomorrow 20:00: 7 bookings;
- the day after tomorrow 13:00: 3 bookings;
- a deterministic scatter of 1-4 bookings in a few slots on each of the next 7 days.

It prints a table of booked counts per slot. Run it again with `-- --reset` to start from an empty database.

## Exposing the service and configuring Telnyx

Telnyx must reach the service over public HTTPS/WSS.

1. Start the service, then a tunnel: `ngrok http 8080`. Put the `https://...ngrok-free.app` URL in `PUBLIC_BASE_URL` and restart `npm run dev` (the media stream URL is derived from it).
2. In Telnyx Mission Control:
   - Buy a voice-capable number (Numbers > Buy Numbers).
   - Create a **Call Control application** (Voice > Programmable Voice / Call Control). Set the webhook URL to `${PUBLIC_BASE_URL}/telnyx/webhook`, API version v2, and leave the failover URL empty or point it at the same URL.
   - Assign the number to that application.
   - Copy your API key (Auth > API Keys) into `TELNYX_API_KEY` and the public key (Auth > Public Key) into `TELNYX_PUBLIC_KEY`.
3. Media streaming is requested per call by the `answer` command (`stream_url`, `stream_track: inbound_track`, `stream_bidirectional_mode: rtp`, `stream_bidirectional_codec: PCMU`), so nothing else needs enabling on the application. If your account requires enabling media streaming as a feature, do so on the Call Control application.
4. Call the number. Watch the logs: `call.initiated`, `answer`, `media stream connected`, `call session started`, then one `caller said` / `agent replied` pair per turn.

## Deploying

The service must run as a long-lived process (WebSockets and timers), not on serverless.

**Render**: `render.yaml` describes a Docker web service with `rootDir: voice-agent` and a `/health` check. Create a Blueprint from the repository, then enter the `sync: false` variables (`PUBLIC_BASE_URL` is the Render URL, e.g. `https://tabletalk-voice-agent.onrender.com`). Use a paid instance type: free instances sleep and would miss calls.

**Railway**: new service from the repository, set the root directory to `voice-agent`; Railway builds the `Dockerfile`. Add the variables from the table below and set `PUBLIC_BASE_URL` to the generated domain.

**Fly**: `fly launch --path voice-agent` picks up the `Dockerfile`; set `internal_port = 8080`, add the secrets with `fly secrets set`, and set `PUBLIC_BASE_URL` to `https://<app>.fly.dev`.

After deploying, update the Call Control application's webhook URL to `${PUBLIC_BASE_URL}/telnyx/webhook`.

## Environment variables

All variables are validated on start-up (`src/config.ts`); the process exits with a list of problems if any are missing or invalid. Nothing is hard-coded.

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `PORT` | no | `8080` | Listening port. |
| `PUBLIC_BASE_URL` | yes | | Public `https://` URL of this service; the media stream URL `wss://.../telnyx/media` is derived from it. |
| `TELNYX_API_KEY` | yes | | Call Control API key (answer, hangup). |
| `TELNYX_PUBLIC_KEY` | yes | | Base64 Ed25519 public key for webhook signature verification. |
| `OPENAI_API_KEY` | yes | | Used for chat, speech-to-text and text-to-speech. |
| `OPENAI_CHAT_MODEL` | no | `gpt-4o-mini` | Chat model when `LLM_PROVIDER=openai`. |
| `OPENAI_STT_MODEL` | no | `gpt-4o-mini-transcribe` | Transcription model (`whisper-1` also works). |
| `OPENAI_TTS_MODEL` | no | `gpt-4o-mini-tts` | Speech model (`tts-1` also works). |
| `OPENAI_TTS_VOICE` | no | `alloy` | Voice name. |
| `LLM_PROVIDER` | no | `openai` | `openai`, `google` or `xai` (see below). |
| `MONGODB_URI` | yes | | `mongodb://` or `mongodb+srv://` connection string. |
| `MONGODB_DB` | no | `tabletalk` | Database name; collections `bookings` and `slots`. |
| `RESTAURANT_NAME` | no | `TableTalk` | Spoken in the greeting and used in the prompt. |
| `RESTAURANT_TIMEZONE` | no | `Europe/London` | IANA zone for "today", "tomorrow" and past-slot checks. |
| `OPEN_HOUR` | no | `11` | First slot starts at this hour. |
| `CLOSE_HOUR` | no | `23` | Closing hour; the last slot starts one hour earlier. |
| `TOTAL_TABLES` | no | `10` | Tables per one-hour slot. |
| `LOG_LEVEL` | no | `info` | pino level. |

## Swapping the LLM provider

The agent only sees a LangChain `BaseChatModel`. `src/agent/llm.ts` is the one file that knows which provider is in use:

1. `npm install @langchain/google-genai` (Gemini) or `npm install @langchain/xai` (Grok).
2. In `createChatModel()`, replace the `throw` for that provider with `new ChatGoogleGenerativeAI({ model, apiKey })` or `new ChatXAI({ model, apiKey })`, reading the key from a new environment variable that you also add to `src/config.ts` and `.env.example`.
3. Set `LLM_PROVIDER=google` or `xai`.

Until that is done, selecting an uninstalled provider fails at start-up with a message naming the package to install. Speech-to-text and text-to-speech stay on OpenAI regardless of the chat provider.

## Data model

- `bookings`: `{ name, partySize, date: "YYYY-MM-DD", hour: 11..22, createdAt, source: "voice" | "seed", callControlId? }`, indexed on `{ date, hour }` and `createdAt`.
- `slots`: `{ _id: "YYYY-MM-DD-HH", date, hour, booked }`, the capacity counter. `reserve()` runs `updateOne({ _id, booked: { $lt: TOTAL_TABLES } }, { $inc: { booked: 1 } }, { upsert: true })`; when the slot is full the filter matches nothing, the upsert collides on `_id` and the duplicate-key error is reported as "full".

## Limits and known behaviour

- English only; the transcription request is pinned to `language: "en"`.
- The voice activity detector is energy-based (RMS against an adaptive noise floor). Loud background noise or speakerphone echo can trigger false barge-ins; tune `DEFAULT_VAD_OPTIONS` in `src/audio/vad.ts` if needed.
- Turn-taking is utterance-based, not streaming: each turn costs one STT request, one or more model requests and one TTS request, so expect two to four seconds between the caller finishing and the reply starting.
- One table per booking regardless of party size; no table joining.
- No cancellations or changes; callers asking for them are told to call the restaurant.
- Calls are capped at 6 minutes and end after two unanswered "Are you still there?" prompts.
- Only the PCMU codec is handled on the media stream; the service closes streams that announce any other encoding.

## What could not be verified without credentials

Everything below is implemented from the Telnyx and OpenAI documentation and covered by unit tests with stubs, but has not been exercised against the live services from this repository:

- Telnyx Call Control `answer` parameters for bidirectional streaming (`stream_url`, `stream_track`, `stream_bidirectional_mode: "rtp"`, `stream_bidirectional_codec: "PCMU"`), the shape of the `start`/`media`/`stop` stream messages, and whether outbound `media` and `clear` messages need the `stream_id` field (it is included when known).
- Telnyx webhook signature format (`${timestamp}|${rawBody}` signed with Ed25519, raw 32-byte base64 public key).
- OpenAI `audio.transcriptions.create` with `gpt-4o-mini-transcribe` and `prompt`/`language`, and `audio.speech.create` with `response_format: "pcm"` returning 24 kHz 16-bit mono PCM.
- Real-world VAD thresholds and the end-to-end latency on a live call.
