/**
 * Lays a near-solid ground over the background plate.
 *
 * Rendered by the handbook reader and every codex masthead, which is every page
 * that is meant to be read rather than landed on. The plate stays behind the
 * hero on the marketing surfaces, where it is doing a job; behind six thousand
 * words it is only making them harder to read.
 *
 * Fixed and at the background layer, so it never enters the flow and nothing
 * needs to opt out of it.
 */
export function ReadingScrim() {
  return <div className="reading-scrim" aria-hidden="true" />;
}
