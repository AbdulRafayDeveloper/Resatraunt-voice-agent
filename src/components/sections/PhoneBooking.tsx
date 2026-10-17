import { Hatch } from "@/components/graphics/Hatch";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { isPlaceholderPhone, siteConfig, telUrl } from "@/config/site";
import { formatTime } from "@/lib/utils";

interface PhoneBookingProps {
  /** Numbered section label, e.g. "03". Omitted on pages that do not number their sections. */
  number?: string;
}

/** A sample of how a call goes. The opening line matches the voice agent's real greeting. */
const sampleCall = [
  { speaker: "TableTalk", line: `Thanks for calling ${siteConfig.name}. I can book a table for you. What name should I put it under?` },
  { speaker: "You", line: "It's Sara Khan." },
  { speaker: "TableTalk", line: "Thank you, Sara. How many people, and for which day and time?" },
  { speaker: "You", line: "Four of us, Friday at eight." },
  { speaker: "TableTalk", line: "Friday at 8 pm is free. A table for four under Sara Khan, Friday at 8 pm. Shall I book it?" },
] as const;

/**
 * Dark band explaining the voice booking line: the number, what the agent asks, the slot rules
 * and a sample call. Every rule is read from siteConfig.phoneBooking, which mirrors the voice
 * agent's own configuration.
 */
export function PhoneBooking({ number }: PhoneBookingProps) {
  const rules = siteConfig.phoneBooking;
  const steps = [
    { icon: "call", title: "Call the number", detail: "From any phone, at any time. Our voice agent answers straight away." },
    { icon: "record_voice_over", title: "Say what you need", detail: `It asks for four things only: ${rules.collects.join(", ").toLowerCase()}.` },
    { icon: "event_available", title: "It checks the book", detail: `If a table is free in that hour it reserves one. If the hour is full, it offers the nearest free times instead.` },
    { icon: "check_circle", title: "Confirmed on the call", detail: "It repeats your name, guests, day and time back to you before you hang up. No email or text follows." },
  ];
  const facts = [
    { label: "Booking hours", value: `${formatTime(rules.opensAt)} to ${formatTime(rules.closesAt)}, daily` },
    { label: "Each booking", value: `One table for ${rules.slotMinutes} minutes, starting on the hour` },
    { label: "Tables per hour", value: String(rules.tables) },
    { label: "Last booking", value: `${formatTime(lastSlot(rules.closesAt, rules.slotMinutes))}` },
  ];

  return (
    <section className="relative overflow-hidden bg-charcoal py-section-sm text-cream md:py-section" aria-label="Book by phone">
      <Hatch color="#B8893A" opacity={0.08} size={16} />
      <Container className="relative grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <SectionHeading
            number={number}
            eyebrow="Book by phone"
            title={<>One call, <em className="text-brass">one table</em>.</>}
            lede="Prefer to talk? Call the TableTalk booking line and our voice agent books your table in a short conversation, then confirms it before you hang up."
            tone="dark"
          />
          <a href={telUrl()} className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-brass/50 bg-cream/5 px-5 py-4 transition-colors hover:border-brass hover:bg-cream/10">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brass text-charcoal">
              <Icon name="call" filled className="text-[26px]" />
            </span>
            <span>
              <span className="block text-xs font-bold uppercase tracking-wider text-brass">Call to book</span>
              <span className="block font-display text-3xl text-cream md:text-4xl">{siteConfig.phone}</span>
            </span>
          </a>
          {isPlaceholderPhone() && (
            <p className="mt-2 flex items-start gap-1.5 text-xs text-cream/60">
              <Icon name="info" className="mt-0.5 text-[14px]" /> Placeholder number until the booking line is live.
            </p>
          )}

          <dl className="mt-8 divide-y divide-cream/15 border-y border-cream/15 text-sm">
            {facts.map((fact) => (
              <div key={fact.label} className="leader py-2.5">
                <dt className="font-semibold text-cream">{fact.label}</dt>
                <dd className="text-end text-cream/75">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-cream/60">
            Phone bookings go into TableTalk&apos;s own reservation book. For a restaurant in the guide, use the request form or the restaurant&apos;s own booking link. The line takes new bookings only; to change or cancel one, send us a message with your name and booking time.
          </p>
        </div>

        <div className="grid gap-10">
          <ol className="grid gap-6 sm:grid-cols-2">
            {steps.map((step, index) => (
              <li key={step.title} className="border-t border-brass/40 pt-4">
                <p className="flex items-center gap-2 font-bold text-cream">
                  <span className="font-display text-xl italic text-brass">{index + 1}</span>
                  <Icon name={step.icon} className="text-[20px] text-brass" />
                  {step.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-cream/75">{step.detail}</p>
              </li>
            ))}
          </ol>

          <figure className="rounded-2xl border border-cream/15 bg-cream/5 p-5 md:p-6">
            <figcaption className="eyebrow text-brass">How a call sounds</figcaption>
            <ul className="mt-4 space-y-3 text-sm">
              {sampleCall.map((turn) => (
                <li key={turn.line} className="grid grid-cols-[5.5rem_1fr] gap-3">
                  <span className={turn.speaker === "You" ? "font-bold text-cream/60" : "font-bold text-brass"}>{turn.speaker}</span>
                  <span className="leading-relaxed text-cream/85">{turn.line}</span>
                </li>
              ))}
            </ul>
          </figure>

          <div className="flex flex-wrap gap-3">
            <LinkButton href={telUrl()} variant="brass" icon="call" iconPosition="start">
              Call {siteConfig.phone}
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Start time of the last bookable slot, e.g. "22:00" when the room closes at 23:00 with 60-minute slots. */
function lastSlot(closesAt: string, slotMinutes: number): string {
  const [h, m] = closesAt.split(":").map(Number);
  const minutes = h * 60 + m - slotMinutes;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}
