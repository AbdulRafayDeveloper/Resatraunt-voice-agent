"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm, useWatch, type FieldPath } from "react-hook-form";
import { submitRequest } from "@/actions/requests";
import { walkInLabels } from "@/lib/utils";
import { Button, LinkButton } from "@/components/ui/Button";
import { Field, Honeypot, Input, Select, Stepper, Textarea } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";
import type { ReservationInfo, ReservationProvider } from "@/types";
import { addDaysIso, formatLongDate, formatTime, pluralise, todayIso } from "@/lib/utils";
import { MAX_ONLINE_PARTY, MAX_REQUEST_DAYS_AHEAD, occasionOptions, tableRequestSchema, timeSlots, type TableRequestInput } from "@/lib/validation";

/** Everything the form needs to know about a restaurant, prepared by the page from src/data. */
export interface TableRequestOption {
  slug: string;
  name: string;
  cityName: string;
  provider: ReservationProvider;
  bookingUrl?: string;
  walkIns: ReservationInfo["walkIns"];
  policy: string[];
  /** First service block, e.g. "Dinner Tue to Sat 6:30 pm–9:45 pm". */
  hoursSummary: string;
  maxPartyOnline?: number;
}

interface TableRequestFormProps {
  initialRestaurant: string;
  options: TableRequestOption[];
}

const nextSteps = [
  "We email you within one working day with a reference and the quickest route to the table.",
  "We pass your request to the restaurant, or point you to its own booking page if that is faster.",
  "The restaurant confirms the table under its own deposit and cancellation terms. Nothing is booked until it does.",
];

const fieldNames: ReadonlySet<string> = new Set<FieldPath<TableRequestInput>>(["restaurantSlug", "date", "time", "flexible", "partySize", "occasion", "dietary", "name", "email", "phone", "notes", "consent", "fax"]);

function isFieldName(key: string): key is FieldPath<TableRequestInput> {
  return fieldNames.has(key);
}

function BeforeYouSend({ option }: { option?: TableRequestOption }) {
  return (
    <aside role="complementary" aria-label="Before you send" className="rounded-2xl border border-line bg-white p-6 shadow-card lg:sticky lg:top-32">
      <p className="eyebrow flex items-center gap-2 text-brass-deep">
        <span className="h-px w-8 bg-brass" aria-hidden="true" />
        Before you send
      </p>
      {option ? (
        <>
          <h2 className="mt-3 font-display text-2xl font-medium text-claret-deep">{option.name}</h2>
          <p className="text-sm text-smoke">{option.cityName}</p>
          <dl className="mt-5 space-y-2 text-sm">
            <div className="leader">
              <dt className="font-semibold text-ink">Books through</dt>
              <dd className="text-smoke">{option.provider}</dd>
            </div>
            <div className="leader">
              <dt className="font-semibold text-ink">Walk-ins</dt>
              <dd className="text-end text-smoke">{walkInLabels[option.walkIns]}</dd>
            </div>
            {option.maxPartyOnline && (
              <div className="leader">
                <dt className="font-semibold text-ink">Online party size</dt>
                <dd className="text-smoke">Up to {option.maxPartyOnline}</dd>
              </div>
            )}
          </dl>
          <p className="mt-4 flex items-start gap-2 text-sm text-ink">
            <Icon name="schedule" className="mt-0.5 text-[18px] text-brass-deep" />
            {option.hoursSummary}
          </p>
          {option.policy.length > 0 && (
            <ul className="mt-4 space-y-2 border-t border-line pt-4 text-sm text-ink/85">
              {option.policy.map((rule) => (
                <li key={rule} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brass" aria-hidden="true" />
                  {rule}
                </li>
              ))}
            </ul>
          )}
          {option.bookingUrl && (
            <LinkButton href={option.bookingUrl} variant="outline" size="sm" icon="open_in_new" className="mt-5" fullWidth>
              Book direct on {option.provider}
            </LinkButton>
          )}
          <p className="mt-3 text-xs text-smoke">Need certainty today? Booking direct is the faster route. We are happy to help either way.</p>
        </>
      ) : (
        <>
          <h2 className="mt-3 font-display text-2xl font-medium text-claret-deep">Choose a restaurant</h2>
          <p className="mt-2 text-sm leading-relaxed text-smoke">Pick a restaurant in the form and its booking rules, provider and hours will appear here so you know what to expect before you send.</p>
        </>
      )}
      <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-smoke">A request is not a confirmed booking. {siteConfig.replyPromise}</p>
    </aside>
  );
}

/** Table request form with a live "before you send" panel driven by the chosen restaurant. */
export function TableRequestForm({ initialRestaurant, options }: TableRequestFormProps) {
  const [reference, setReference] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<TableRequestInput>({
    resolver: zodResolver(tableRequestSchema),
    defaultValues: {
      restaurantSlug: initialRestaurant,
      date: "",
      time: "19:00",
      flexible: false,
      partySize: 2,
      occasion: "none",
      dietary: "",
      name: "",
      email: "",
      phone: "",
      notes: "",
      consent: false,
      fax: "",
    },
  });

  const selectedSlug = useWatch({ control, name: "restaurantSlug" });
  const selected = options.find((o) => o.slug === selectedSlug);
  const today = todayIso();

  const onSubmit = async (values: TableRequestInput) => {
    setServerError(null);
    const result = await submitRequest("table", values);
    if (result.ok) {
      setReference(result.reference);
      return;
    }
    setServerError(result.error);
    if (result.fieldErrors) {
      for (const [key, message] of Object.entries(result.fieldErrors)) {
        if (isFieldName(key)) setError(key, { type: "server", message });
      }
    }
  };

  if (reference) {
    const values = getValues();
    const occasionLabel = occasionOptions.find((o) => o.value === values.occasion)?.label ?? "No special occasion";
    const summary = [
      { label: "Restaurant", value: selected ? `${selected.name}, ${selected.cityName}` : values.restaurantSlug },
      { label: "Date", value: formatLongDate(values.date) },
      { label: "Time", value: `${formatTime(values.time)}${values.flexible ? " (flexible by an hour)" : ""}` },
      { label: "Guests", value: pluralise(values.partySize, "guest") },
      { label: "Occasion", value: occasionLabel },
    ];
    return (
      <div role="status" className="rounded-2xl border border-basil/40 bg-basil-soft/60 p-6 md:p-8">
        <p className="flex items-center gap-2 font-display text-2xl font-medium text-claret-deep">
          <Icon name="check_circle" filled className="text-[28px] text-basil" />
          Request received · {reference}
        </p>
        <p className="mt-2 text-sm text-smoke">Keep this reference. This is a request, not a confirmed booking: the restaurant has not yet reserved a table.</p>

        <dl className="mt-6 divide-y divide-line border-y border-line text-sm">
          {summary.map((row) => (
            <div key={row.label} className="leader py-2.5">
              <dt className="font-semibold text-ink">{row.label}</dt>
              <dd className="text-end text-smoke">{row.value}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-8 font-display text-xl font-medium text-claret-deep">What happens next</h2>
        <ol className="mt-3 space-y-3">
          {nextSteps.map((step, index) => (
            <li key={step} className="grid grid-cols-[2rem_1fr] gap-2 text-sm leading-relaxed text-ink">
              <span className="font-display text-xl italic text-brass-deep">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          {selected?.bookingUrl && (
            <p className="text-sm text-ink">
              Prefer to book directly?{" "}
              <a href={selected.bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-claret underline underline-offset-2 hover:no-underline">
                Book direct on {selected.provider}
                <Icon name="open_in_new" className="text-[16px]" />
              </a>
            </p>
          )}
          <Link href="/restaurants" className="inline-flex items-center gap-1 text-sm font-bold text-claret underline-offset-2 hover:underline">
            Browse more restaurants <Icon name="arrow_forward" className="text-[18px]" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Table request form" className="relative grid gap-6">
        <Honeypot id="tr-fax" {...register("fax")} />

        <fieldset>
          <legend className="eyebrow text-claret">The table</legend>
          <div className="mt-4 grid gap-5">
            <Field label="Restaurant" htmlFor="tr-restaurant" error={errors.restaurantSlug?.message} required>
              <Select id="tr-restaurant" invalid={!!errors.restaurantSlug} {...register("restaurantSlug")}>
                <option value="">Choose a restaurant</option>
                {options.map((o) => (
                  <option key={o.slug} value={o.slug}>
                    {o.name} · {o.cityName}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Date" htmlFor="tr-date" error={errors.date?.message} required>
                <Input id="tr-date" type="date" min={today} max={addDaysIso(today, MAX_REQUEST_DAYS_AHEAD)} invalid={!!errors.date} {...register("date")} />
              </Field>
              <Field label="Time" htmlFor="tr-time" error={errors.time?.message} hint="Local time at the restaurant." required>
                <Select id="tr-time" invalid={!!errors.time} {...register("time")}>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{formatTime(slot)}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <label className="flex min-h-11 items-center gap-2 text-sm text-ink">
              <input type="checkbox" className="h-4 w-4 accent-claret" {...register("flexible")} />
              I&rsquo;m flexible by an hour either side
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Controller
                  control={control}
                  name="partySize"
                  render={({ field }) => <Stepper id="tr-party" label="Guests" min={1} max={MAX_ONLINE_PARTY} value={field.value} onChange={field.onChange} hint={`Up to ${MAX_ONLINE_PARTY} online`} />}
                />
                {errors.partySize && (
                  <p role="alert" className="text-xs font-semibold text-danger">{errors.partySize.message}</p>
                )}
              </div>
              <Field label="Occasion" htmlFor="tr-occasion" error={errors.occasion?.message}>
                <Select id="tr-occasion" invalid={!!errors.occasion} {...register("occasion")}>
                  {occasionOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Dietary requirements" htmlFor="tr-dietary" error={errors.dietary?.message} hint="Allergies, vegetarian or vegan guests, anything the kitchen should know.">
              <Textarea id="tr-dietary" rows={3} className="min-h-[88px]" invalid={!!errors.dietary} {...register("dietary")} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="border-t border-line pt-6">
          <legend className="eyebrow float-left w-full text-claret">Your details</legend>
          <div className="mt-4 grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your name" htmlFor="tr-name" error={errors.name?.message} required>
                <Input id="tr-name" autoComplete="name" invalid={!!errors.name} {...register("name")} />
              </Field>
              <Field label="Email" htmlFor="tr-email" error={errors.email?.message} required>
                <Input id="tr-email" type="email" autoComplete="email" invalid={!!errors.email} {...register("email")} />
              </Field>
            </div>
            <Field label="Phone (optional)" htmlFor="tr-phone" error={errors.phone?.message} hint="With country code, in case the restaurant needs to call.">
              <Input id="tr-phone" type="tel" autoComplete="tel" invalid={!!errors.phone} {...register("phone")} />
            </Field>
            <Field label="Notes" htmlFor="tr-notes" error={errors.notes?.message} hint="Group above 12, accessibility needs, a specific table.">
              <Textarea id="tr-notes" invalid={!!errors.notes} {...register("notes")} />
            </Field>
            <div>
              <label className="flex items-start gap-2 text-sm text-ink">
                <input type="checkbox" className="mt-1 h-4 w-4 accent-claret" aria-invalid={errors.consent ? true : undefined} {...register("consent")} />
                <span>
                  I understand this is a request, not a confirmed booking, and that the restaurant confirms under its own terms. I agree to the{" "}
                  <Link href="/privacy-policy" className="underline underline-offset-2">privacy policy</Link>.
                </span>
              </label>
              {errors.consent && (
                <p role="alert" className="mt-1.5 text-xs font-semibold text-danger">{errors.consent.message}</p>
              )}
            </div>
          </div>
        </fieldset>

        {serverError && (
          <p role="alert" className="rounded-lg bg-claret-soft px-4 py-3 text-sm font-semibold text-claret-deep">{serverError}</p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg" icon="send" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send table request"}
          </Button>
          <p className="text-xs text-smoke">Free. Nothing is charged by TableTalk.</p>
        </div>
      </form>

      <BeforeYouSend option={selected} />
    </div>
  );
}
