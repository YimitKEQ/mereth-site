/**
 * A stable anchor per question, so a single answer can be linked to.
 *
 * Lives here rather than beside the component that renders it because both
 * sides need it: the client row publishes the id, and the FAQ page (a server
 * component) lists the ids each chapter owns so a deep link can find the
 * chapter holding the question. A function exported from a "use client" module
 * cannot be called from the server at all, which is the error this file exists
 * to avoid.
 */
export function anchorFor(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}
