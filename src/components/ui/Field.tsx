import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-lg border border-line bg-white px-3.5 py-3 text-base text-ink placeholder:text-smoke/70 transition-colors focus:border-claret focus:outline-none focus:ring-2 focus:ring-claret/20 disabled:bg-linen aria-[invalid=true]:border-danger";

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}

/** Label + control + hint/error wrapper. Control must carry `id={htmlFor}`. */
export function Field({ label, htmlFor, error, hint, required, children, className, tone = "light" }: FieldProps) {
  const dark = tone === "dark";
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* The required asterisk is drawn with CSS so the label's text (and accessible name) stays exactly the label */}
      <label htmlFor={htmlFor} className={cn("text-sm font-bold", dark ? "text-cream" : "text-ink", required && "after:ms-1 after:text-ember after:content-['*']")}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs font-semibold text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className={cn("text-xs", dark ? "text-cream/65" : "text-smoke")}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean };
export function Input({ className, invalid, ...rest }: InputProps) {
  return <input className={cn(inputClass, className)} aria-invalid={invalid || undefined} {...rest} />;
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean };
export function Select({ className, invalid, children, ...rest }: SelectProps) {
  return (
    <select className={cn(inputClass, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%235E5964%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:20px] bg-[right_0.75rem_center] bg-no-repeat pe-10", className)} aria-invalid={invalid || undefined} {...rest}>
      {children}
    </select>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean };
export function Textarea({ className, invalid, ...rest }: TextareaProps) {
  return <textarea className={cn(inputClass, "min-h-[120px] resize-y", className)} aria-invalid={invalid || undefined} {...rest} />;
}

/** Plus / minus stepper for guest counts. */
interface StepperProps {
  id: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  label: string;
  hint?: string;
}

export function Stepper({ id, value, min, max, onChange, label, hint }: StepperProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-white px-3.5 py-2.5">
      <div>
        <p id={`${id}-label`} className="text-sm font-bold text-ink">{label}</p>
        {hint && <p className="text-xs text-smoke">{hint}</p>}
      </div>
      <div className="flex items-center gap-2" role="group" aria-labelledby={`${id}-label`}>
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Fewer ${label}`} className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-claret disabled:opacity-40 hover:bg-claret-soft cursor-pointer">−</button>
        <output id={id} className="w-6 text-center font-display text-xl font-semibold text-claret-deep" aria-live="polite">{value}</output>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More ${label}`} className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-claret disabled:opacity-40 hover:bg-claret-soft cursor-pointer">+</button>
      </div>
    </div>
  );
}

/** Honeypot input: visually hidden and skipped by assistive tech; bots that fill it fail validation. */
export function Honeypot({ id, ...rest }: InputHTMLAttributes<HTMLInputElement> & { id: string }) {
  return (
    <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
      <label htmlFor={id}>Fax number</label>
      <input id={id} type="text" tabIndex={-1} autoComplete="off" {...rest} />
    </div>
  );
}
