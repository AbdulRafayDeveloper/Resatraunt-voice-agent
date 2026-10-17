"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { submitRequest } from "@/actions/requests";
import { Button } from "@/components/ui/Button";
import { Honeypot, Input, Select } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { cities } from "@/data/cities";
import { newsletterSchema, type NewsletterInput } from "@/lib/validation";

/** Footer newsletter sign-up with explicit consent. Submits through the same validated server action as every form. */
export function NewsletterForm() {
  const id = useId();
  const [reference, setReference] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "", cityInterest: "all", consent: false, fax: "" },
  });

  const onSubmit = async (values: NewsletterInput) => {
    setServerError(null);
    const result = await submitRequest("newsletter", values);
    if (result.ok) setReference(result.reference);
    else setServerError(result.error);
  };

  if (reference) {
    return (
      <div className="rounded-2xl border border-brass/40 bg-cream/5 p-5 text-cream" role="status">
        <p className="flex items-center gap-2 font-bold"><Icon name="check_circle" filled className="text-[22px] text-brass" /> You are on the list · {reference}</p>
        <p className="mt-2 text-sm text-cream/75">The first email arrives with the next monthly round-up. Every email has an unsubscribe link.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative grid gap-3" aria-label="Newsletter sign-up">
      <Honeypot id={`${id}-fax`} {...register("fax")} />
      <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr]">
        <div>
          <label htmlFor={`${id}-email`} className="sr-only">Email address</label>
          <Input id={`${id}-email`} type="email" autoComplete="email" placeholder="you@example.com" invalid={!!errors.email} {...register("email")} />
          {errors.email && <p role="alert" className="mt-1 text-xs font-semibold text-brass-pale">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-city`} className="sr-only">City of interest</label>
          <Select id={`${id}-city`} invalid={!!errors.cityInterest} {...register("cityInterest")}>
            <option value="all">All cities</option>
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </Select>
        </div>
      </div>
      <label className="flex items-start gap-2 text-sm text-cream/80">
        <input type="checkbox" className="mt-1 h-4 w-4 accent-brass" {...register("consent")} />
        <span>I agree to receive the monthly TableTalk email and understand I can unsubscribe at any time. See the <a href="/privacy-policy" className="underline underline-offset-2 hover:text-cream">privacy policy</a>.</span>
      </label>
      {errors.consent && <p role="alert" className="text-xs font-semibold text-brass-pale">{errors.consent.message}</p>}
      {serverError && <p role="alert" className="text-xs font-semibold text-brass-pale">{serverError}</p>}
      <Button type="submit" variant="brass" disabled={isSubmitting} icon="send" className="sm:justify-self-start">{isSubmitting ? "Sending…" : "Subscribe"}</Button>
    </form>
  );
}
