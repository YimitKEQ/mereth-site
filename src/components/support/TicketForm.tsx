"use client";

import { useState, type FormEvent } from "react";

import { OrnateBox } from "@/components/ornament/OrnateBox";
import { OrnateFrame } from "@/components/ornament/OrnateFrame";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Ticket } from "@/components/ui/icons";

const TOPICS = [
  "Cannot log in",
  "Stuck character",
  "Lost or missing item",
  "Billing or refund",
  "Report a player",
  "Bug report",
  "Something else",
];

interface Errors {
  username?: string;
  topic?: string;
  detail?: string;
}

/**
 * Ticket submission.
 *
 * The character counter and the minimum length are deliberate: the single
 * biggest cost in support is a ticket that says "doesn't work", so the form
 * asks for enough to act on before it will submit.
 */
export function TicketForm() {
  const [username, setUsername] = useState("");
  const [topic, setTopic] = useState("");
  const [detail, setDetail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const MIN = 30;

  function validate(): Errors {
    const found: Errors = {};
    if (username.trim().length < 3) found.username = "Enter your account username.";
    if (topic === "") found.topic = "Pick the closest topic.";
    if (detail.trim().length < MIN) found.detail = `Give us at least ${MIN} characters to work with.`;
    return found;
  }

  async function onSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setBusy(false);
    // Deterministic from the input rather than random, so the prototype does
    // not need a clock or a random source to produce a stable reference.
    const stamp = Math.abs(
      [...`${username}${topic}${detail}`].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7),
    )
      .toString(36)
      .toUpperCase()
      .slice(0, 6);
    setReference(`MS-${stamp}`);
  }

  if (reference) {
    return (
      <OrnateFrame weight="heavy" contentClassName="px-6 py-14 text-center md:px-16">
        <Ticket className="mx-auto text-3xl text-brand-accent" />
        <h2 className="font-display mt-4 text-2xl tracking-heading text-brand-accent">
          Ticket {reference}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-text-muted">
          Nothing was actually sent: this prototype has no backend. On the live site you would get
          this reference by email and a reply inside 24 hours.
        </p>
        <Button
          size="md"
          className="mt-8"
          onClick={() => {
            setReference(null);
            setUsername("");
            setTopic("");
            setDetail("");
          }}
        >
          Open another
        </Button>
      </OrnateFrame>
    );
  }

  return (
    <OrnateFrame weight="heavy" contentClassName="px-6 py-12 md:px-12">
      <form noValidate onSubmit={onSubmit} className="mx-auto flex max-w-2xl flex-col gap-6">
        <Input
          label="Account username"
          placeholder="Account username"
          value={username}
          error={errors.username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <div>
          <Select
            label="Choose a topic"
            options={TOPICS}
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            className="w-full"
          />
          {errors.topic ? (
            <p role="alert" className="mt-2 px-1 text-[var(--text-error)] text-error">
              {errors.topic}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="detail" className="sr-only">
            What happened
          </label>
          <OrnateBox size="sm" className={errors.detail ? "text-error" : "text-brand-accent"}>
            <textarea
              id="detail"
              rows={7}
              value={detail}
              placeholder="What did you expect, what happened, and when? Include your character name and realm."
              onChange={(event) => setDetail(event.target.value)}
              aria-invalid={Boolean(errors.detail)}
              className="w-full resize-y bg-transparent p-5 text-sm leading-relaxed text-text-primary outline-none placeholder:text-text-placeholder"
            />
          </OrnateBox>
          <div className="mt-2 flex items-center justify-between px-1">
            {errors.detail ? (
              <p role="alert" className="text-[var(--text-error)] text-error">
                {errors.detail}
              </p>
            ) : (
              <span className="text-xs text-text-muted">
                Never include your password. Staff will not ask for it.
              </span>
            )}
            <span
              className={`text-xs tabular-nums ${
                detail.trim().length >= MIN ? "text-text-muted" : "text-error"
              }`}
            >
              {detail.trim().length}/{MIN}
            </span>
          </div>
        </div>

        <Button type="submit" variant="solid" size="lg" disabled={busy} className="w-full !min-w-0">
          {busy ? "Sending…" : "Submit ticket"}
        </Button>
      </form>
    </OrnateFrame>
  );
}
