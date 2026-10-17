"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm, type Path } from "react-hook-form";
import { submitRequest } from "@/actions/requests";
import { Button } from "@/components/ui/Button";
import { Field, Honeypot, Input, Select, Textarea } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";
import { coversOptions, listingSchema, roleOptions, type ListingInput } from "@/lib/validation";

const coversLabels: Record<(typeof coversOptions)[number], string> = {
  "under-30": "Under 30 covers",
  "30-60": "30 to 60 covers",
  "60-120": "60 to 120 covers",
  "120+": "More than 120 covers",
};

const defaultValues: ListingInput = {
  restaurantName: "",
  city: "",
  website: "",
  contactName: "",
  role: "owner",
  email: "",
  phone: "",
  covers: "30-60",
  message: "",
  consent: false,
  fax: "",
};

function isListingField(key: string): key is Path<ListingInput> {
  return key in defaultValues;
}

/** Restaurant listing enquiry. Validated with Zod on the client and again in the server action. */
export function ListingForm() {
  const [reference, setReference] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ListingInput>({ resolver: zodResolver(listingSchema), defaultValues });

  const onSubmit = async (values: ListingInput) => {
    setServerError(null);
    const result = await submitRequest("listing", values);
    if (result.ok) {
      setReference(result.reference);
      return;
    }
    setServerError(result.error);
    for (const [key, message] of Object.entries(result.fieldErrors ?? {})) {
      if (isListingField(key)) setError(key, { type: "server", message });
    }
  };

  if (reference) {
    return (
      <div className="rounded-2xl border border-basil/40 bg-basil-soft p-6 text-ink" role="status">
        <p className="flex items-center gap-2 font-display text-2xl font-medium text-basil">
          <Icon name="check_circle" filled className="text-[26px]" /> Enquiry received · {reference}
        </p>
        <p className="mt-3 leading-relaxed">
          Thank you. Keep this reference. We will read your website and any awards sources you named, then reply by email with what we found and what we need from you before anything is published.
        </p>
        <p className="mt-2 text-sm text-smoke">{siteConfig.replyPromise} Listing enquiries receive the same reply promise.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative grid gap-5" aria-label="List your restaurant form">
      <Honeypot id="lf-fax" {...register("fax")} />

      <fieldset className="grid gap-5">
        <legend className="eyebrow mb-4 text-brass-deep">The restaurant</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Restaurant name" htmlFor="lf-restaurant-name" error={errors.restaurantName?.message} required>
            <Input id="lf-restaurant-name" autoComplete="organization" invalid={!!errors.restaurantName} {...register("restaurantName")} />
          </Field>
          <Field label="City" htmlFor="lf-city" error={errors.city?.message} required>
            <Input id="lf-city" autoComplete="address-level2" invalid={!!errors.city} {...register("city")} />
          </Field>
        </div>
        <Field label="Website (optional)" htmlFor="lf-website" error={errors.website?.message} hint="The official site we should read for hours, menus and prices.">
          <Input id="lf-website" type="url" inputMode="url" autoComplete="url" placeholder="https://" invalid={!!errors.website} {...register("website")} />
        </Field>
        <Field label="Covers per service" htmlFor="lf-covers" error={errors.covers?.message} required>
          <Select id="lf-covers" invalid={!!errors.covers} {...register("covers")}>
            {coversOptions.map((value) => (
              <option key={value} value={value}>{coversLabels[value]}</option>
            ))}
          </Select>
        </Field>
      </fieldset>

      <fieldset className="grid gap-5 border-t border-line pt-5">
        <legend className="eyebrow mb-4 text-brass-deep">Your details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name" htmlFor="lf-contact-name" error={errors.contactName?.message} required>
            <Input id="lf-contact-name" autoComplete="name" invalid={!!errors.contactName} {...register("contactName")} />
          </Field>
          <Field label="Your role" htmlFor="lf-role" error={errors.role?.message} required>
            <Select id="lf-role" invalid={!!errors.role} {...register("role")}>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email" htmlFor="lf-email" error={errors.email?.message} required>
            <Input id="lf-email" type="email" inputMode="email" autoComplete="email" invalid={!!errors.email} {...register("email")} />
          </Field>
          <Field label="Phone (optional)" htmlFor="lf-phone" error={errors.phone?.message} hint="With country code, e.g. +44 or +1.">
            <Input id="lf-phone" type="tel" inputMode="tel" autoComplete="tel" invalid={!!errors.phone} {...register("phone")} />
          </Field>
        </div>
      </fieldset>

      <Field label="Tell us about the restaurant" htmlFor="lf-message" error={errors.message?.message} hint="Cuisine, menu formats, booking system, and any awards with the year." required>
        <Textarea id="lf-message" rows={5} invalid={!!errors.message} {...register("message")} />
      </Field>

      <div>
        <label htmlFor="lf-consent" className="flex items-start gap-3 text-sm text-ink/90">
          <input id="lf-consent" type="checkbox" className="mt-1 h-4 w-4 accent-claret" aria-invalid={errors.consent ? true : undefined} {...register("consent")} />
          <span>
            I agree to be contacted by email about this enquiry and understand that commercial terms are not finalised and that no restaurant is charged until they are published. See the <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-claret">privacy policy</Link>.
          </span>
        </label>
        {errors.consent && <p role="alert" className="mt-1.5 text-xs font-semibold text-danger">{errors.consent.message}</p>}
      </div>

      {serverError && <p role="alert" className="rounded-lg border border-danger/40 bg-white px-4 py-3 text-sm font-semibold text-danger">{serverError}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={isSubmitting} icon="send" size="lg">{isSubmitting ? "Sending…" : "Send listing enquiry"}</Button>
        <p className="text-xs text-smoke">Nothing is published until we have checked it with you.</p>
      </div>
    </form>
  );
}
