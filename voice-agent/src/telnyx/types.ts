import { z } from "zod";

/** Telnyx Call Control v2 webhook envelope. Unknown fields are ignored. */
export const telnyxWebhookSchema = z.object({
  data: z.object({
    event_type: z.string(),
    id: z.string().optional(),
    occurred_at: z.string().optional(),
    payload: z.object({
      call_control_id: z.string().optional(),
      call_leg_id: z.string().optional(),
      call_session_id: z.string().optional(),
      direction: z.string().optional(),
      from: z.string().optional(),
      to: z.string().optional(),
      hangup_cause: z.string().optional(),
    }),
  }),
});

export type TelnyxWebhookEvent = z.infer<typeof telnyxWebhookSchema>;

const mediaFormatSchema = z.object({
  encoding: z.string(),
  sample_rate: z.number(),
  channels: z.number(),
});

/** Messages Telnyx sends over the media-streaming WebSocket. */
export const mediaMessageSchema = z.union([
  z.object({ event: z.literal("connected") }),
  z.object({
    event: z.literal("start"),
    stream_id: z.string().optional(),
    start: z.object({
      call_control_id: z.string(),
      media_format: mediaFormatSchema.optional(),
    }),
  }),
  z.object({
    event: z.literal("media"),
    media: z.object({
      track: z.string().optional(),
      payload: z.string(),
    }),
  }),
  z.object({ event: z.literal("stop") }),
  z.object({ event: z.string() }).transform((message) => ({ event: "unknown" as const, name: message.event })),
]);

export type MediaMessage = z.infer<typeof mediaMessageSchema>;

/** The only codec this service speaks; set on the answer command and checked on stream start. */
export const MEDIA_CODEC = "PCMU";
