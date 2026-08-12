"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { OrnateFrame } from "@/components/ornament/OrnateFrame";
import { OrnateLabelDivider } from "@/components/ornament/Divider";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Controls";
import { Input } from "@/components/ui/Input";
import { Discord } from "@/components/ui/icons";

export type AuthMode = "login" | "register";

interface Fields {
  username: string;
  email: string;
  password: string;
  confirm: string;
}

type Errors = Partial<Record<keyof Fields | "form", string>>;

/**
 * Login and registration share a frame, a Discord path and a validator, so they
 * are one component with a mode rather than two files that drift apart.
 *
 * Validation runs on submit and then live per field once a field has been
 * touched, which is the pattern that does not shout at someone halfway through
 * typing their email.
 */
export function AuthCard({ mode }: { mode: AuthMode }) {
  const isRegister = mode === "register";
  const [fields, setFields] = useState<Fields>({ username: "", email: "", password: "", confirm: "" });
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [errors, setErrors] = useState<Errors>({});
  const [remember, setRemember] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  function validate(next: Fields): Errors {
    const found: Errors = {};
    if (next.username.trim().length < 3) found.username = "Username must be at least 3 characters.";
    if (isRegister) {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(next.email)) found.email = "Enter a valid email address.";
      if (next.password.length < 8) found.password = "Password must be at least 8 characters.";
      if (next.confirm !== next.password) found.confirm = "Passwords do not match.";
    } else if (next.password.length === 0) {
      found.password = "Enter your password.";
    }
    return found;
  }

  function update(key: keyof Fields, value: string): void {
    const next = { ...fields, [key]: value };
    setFields(next);
    if (touched[key]) setErrors(validate(next));
  }

  function blur(key: keyof Fields): void {
    setTouched((previous) => ({ ...previous, [key]: true }));
    setErrors(validate(fields));
  }

  async function onSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    const found = validate(fields);
    if (isRegister && !accepted) found.form = "You need to accept the terms to continue.";
    setErrors(found);
    setTouched({ username: true, email: true, password: true, confirm: true });
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    // No backend yet. The delay stands in for the request so the pending state
    // is real and can be seen, rather than a button that never changes.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setBusy(false);
    setDone(true);
  }

  if (done) {
    return (
      <OrnateFrame weight="heavy" contentClassName="px-6 py-14 text-center md:px-16">
        <h2 className="font-display text-2xl tracking-heading text-brand-accent">
          {isRegister ? "Account created" : "Signed in"}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-text-muted">
          {isRegister
            ? "This prototype has no backend yet, so nothing was stored. The form, its validation and its pending state are all real."
            : "This prototype has no backend yet, so no session was created."}
        </p>
        <Button variant="outline" size="md" className="mt-8" onClick={() => setDone(false)}>
          Back
        </Button>
      </OrnateFrame>
    );
  }

  return (
    <OrnateFrame weight="heavy" contentClassName="px-6 py-12 md:px-16 md:py-16">
      <form noValidate onSubmit={onSubmit} className="mx-auto flex max-w-xl flex-col gap-6">
        <Button
          type="button"
          variant="solid"
          size="lg"
          className="w-full gap-3 !min-w-0"
          onClick={() => setDone(true)}
        >
          <Discord className="text-xl" />
          Continue with Discord
        </Button>

        <OrnateLabelDivider>Or use an account</OrnateLabelDivider>

        <Input
          label="Username"
          name="username"
          autoComplete="username"
          placeholder="Username"
          value={fields.username}
          error={touched.username ? errors.username : undefined}
          onChange={(event) => update("username", event.target.value)}
          onBlur={() => blur("username")}
        />

        {isRegister ? (
          <Input
            label="Email"
            name="email"
            type="email"
            preserveCase
            autoComplete="email"
            placeholder="Email address"
            value={fields.email}
            error={touched.email ? errors.email : undefined}
            onChange={(event) => update("email", event.target.value)}
            onBlur={() => blur("email")}
          />
        ) : null}

        <Input
          label="Password"
          name="password"
          type="password"
          preserveCase
          autoComplete={isRegister ? "new-password" : "current-password"}
          placeholder="Password"
          value={fields.password}
          error={touched.password ? errors.password : undefined}
          onChange={(event) => update("password", event.target.value)}
          onBlur={() => blur("password")}
        />

        {isRegister ? (
          <Input
            label="Confirm password"
            name="confirm"
            type="password"
            preserveCase
            autoComplete="new-password"
            placeholder="Confirm password"
            value={fields.confirm}
            error={touched.confirm ? errors.confirm : undefined}
            onChange={(event) => update("confirm", event.target.value)}
            onBlur={() => blur("confirm")}
          />
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-4">
          {isRegister ? (
            <Checkbox label="I accept the terms of service" checked={accepted} onChange={setAccepted} />
          ) : (
            <Checkbox label="Keep me signed in" checked={remember} onChange={setRemember} />
          )}
          {!isRegister ? (
            <Link href="/support" className="text-sm text-text-muted underline-offset-4 hover:text-brand-accent hover:underline">
              Forgot your password?
            </Link>
          ) : null}
        </div>

        {errors.form ? (
          <p role="alert" className="text-[var(--text-error)] text-error">
            {errors.form}
          </p>
        ) : null}

        <Button type="submit" variant="solid" size="lg" disabled={busy} className="w-full !min-w-0">
          {busy ? "Working…" : isRegister ? "Create account" : "Log in"}
        </Button>

        <p className="text-center text-sm text-text-muted">
          {isRegister ? "Already have an account? " : "New here? "}
          <Link
            href={isRegister ? "/login" : "/register"}
            className="text-brand-accent underline-offset-4 hover:underline"
          >
            {isRegister ? "Log in" : "Create one"}
          </Link>
        </p>
      </form>
    </OrnateFrame>
  );
}
