"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type Path } from "react-hook-form";
import { submitRequest } from "@/actions/requests";
import { Button } from "@/components/ui/Button";
import { Field, Honeypot, Input, Select, Textarea } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";
import { contactSchema, topicOptions, type ContactInput } from "@/lib/validation";

const defaultValues: ContactInput = {
  name: "",
  email: "",
  topic: "request",
  reference: "",
  message: "",
  fax: "",
};

function isContactField(key: string): key is Path<ContactInput> {
  return key in defaultValues;
}

/** General contact form. Validated with Zod on the client and again in the server action. */
export function ContactForm() {
  const [reference, setReference] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema), defaultValues });

  const onSubmit = async (values: ContactInput) => {
    setServerError(null);
    const result = await submitRequest("contact", values);
    if (result.ok) {
      setReference(result.reference);
      return;
    }
    setServerError(result.error);
    for (const [key, message] of Object.entries(result.fieldErrors ?? {})) {
      if (isContactField(key)) setError(key, { type: "server", message });
    }
  };

  if (reference) {
    return (
      <div className="rounded-2xl border border-basil/40 bg-basil-soft p-6 text-ink" role="status">
        <p className="flex items-center gap-2 font-display text-2xl font-medium text-basil">
          <Icon name="check_circle" filled className="text-[26px]" /> Message received · {reference}
        </p>
        <p className="mt-3 leading-relaxed">Thank you. Quote this reference if you write again about the same matter. A person will reply by email.</p>
        <p className="mt-2 text-sm text-smoke">{siteConfig.replyPromise}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative grid gap-5" aria-label="Contact form">
      <Honeypot id="cf-fax" {...register("fax")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="cf-name" error={errors.name?.message} required>
          <Input id="cf-name" autoComplete="name" invalid={!!errors.name} {...register("name")} />
        </Field>
        <Field label="Email" htmlFor="cf-email" error={errors.email?.message} required>
          <Input id="cf-email" type="email" inputMode="email" autoComplete="email" invalid={!!errors.email} {...register("email")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Topic" htmlFor="cf-topic" error={errors.topic?.message} required>
          <Select id="cf-topic" invalid={!!errors.topic} {...register("topic")}>
            {topicOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
        </Field>
        <Field label="Reference (optional)" htmlFor="cf-reference" error={errors.reference?.message} hint="From a confirmation email, e.g. TT-ABC123.">
          <Input id="cf-reference" autoComplete="off" invalid={!!errors.reference} {...register("reference")} />
        </Field>
      </div>

      <Field label="Your message" htmlFor="cf-message" error={errors.message?.message} hint="For a listing correction, name the restaurant, say what is wrong and include a link if you have one." required>
        <Textarea id="cf-message" rows={6} invalid={!!errors.message} {...register("message")} />
      </Field>

      {serverError && <p role="alert" className="rounded-lg border border-danger/40 bg-white px-4 py-3 text-sm font-semibold text-danger">{serverError}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={isSubmitting} icon="send" size="lg">{isSubmitting ? "Sending…" : "Send message"}</Button>
        <p className="text-xs text-smoke">We only use your details to answer this message.</p>
      </div>
    </form>
  );
}
