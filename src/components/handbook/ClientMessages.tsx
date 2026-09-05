import type { ClientMessage } from "@/lib/handbook/client-messages";
import { inline } from "@/lib/markup";

/**
 * The client's messages with the explanation first and the error underneath.
 *
 * The order is the whole design. What replaced a wall of monospace strings is a
 * plain heading a reader can scan for their situation, the fix in ordinary
 * prose, and only then the client's own wording, small, so somebody holding the
 * error on screen can confirm they are in the right entry.
 *
 * Put the strings first and the page reads as a log file, which is what it used
 * to do. They are evidence for the explanation, not a substitute for it, so they
 * are styled like a footnote rather than like a heading.
 */
export function ClientMessages({ messages }: { messages: readonly ClientMessage[] }) {
  return (
    <div className="my-7 space-y-7">
      {messages.map((message) => (
        <div key={message.title} className="border-l border-brand-accent/25 pl-5">
          <h4 className="text-[0.98rem] font-semibold text-text-primary">{message.title}</h4>
          <p className="mt-1.5 max-w-[68ch] text-[0.92rem] leading-[1.8] text-text-light">
            {inline(message.body)}
          </p>

          <p className="mt-2.5 text-[10px] tracking-[1.6px] text-text-muted/70 uppercase">
            {message.seen.length === 1 ? "On screen" : "On screen, any of"}
          </p>
          <ul className="mt-1 space-y-1">
            {message.seen.map((line) => (
              <li key={line} className="font-mono text-[0.76rem] leading-relaxed text-text-muted">
                {line}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
