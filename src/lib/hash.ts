/**
 * The deep-link grammar: `#<tabId>&q=<term>&bench=<name>`.
 *
 * A fragment rather than a query string, and that is a static-export
 * constraint rather than taste. Reading `?q=` needs `useSearchParams`, which
 * Next refuses to prerender outside a Suspense boundary, so every page that
 * wanted a filter would grow a loading shell around its own content to serve a
 * value the browser already had in hand. The fragment costs nothing, never
 * reaches a host, and survives the `router.push` the command palette does.
 *
 * The leading segment names a tab and the rest are ordinary `key=value` pairs,
 * which is why values are percent-encoded on the way in: `encodeURIComponent`
 * escapes `&` and `#`, so an ingredient called "Bone Meal & Ash" cannot split
 * the pair it lives in.
 *
 * Both halves of the round trip live here on purpose. The palette builds these
 * hrefs on the server at build time and the codex browsers parse them in the
 * client, and a grammar written down in two places is a grammar that drifts.
 */

export interface HashTarget {
  /** The leading segment. Empty when there is no hash at all. */
  tab: string;
  params: ReadonlyMap<string, string>;
}

const EMPTY: HashTarget = { tab: "", params: new Map() };

/**
 * Percent decoding that cannot take the page down with it.
 *
 * `decodeURIComponent` throws `URIError` on a malformed escape, a lone `%` is
 * the easiest thing in the world to end up with after a hand-edited or
 * truncated link, and an exception thrown out of a mount effect blanks the
 * whole route. The raw text is a worse filter and a far better outcome.
 */
function decode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function parseHash(hash: string): HashTarget {
  const body = hash.startsWith("#") ? hash.slice(1) : hash;
  if (body === "") return EMPTY;

  const [head, ...pairs] = body.split("&");
  const params = new Map<string, string>();
  for (const pair of pairs) {
    const split = pair.indexOf("=");
    // A bare `&q` names nothing and a leading `&=x` has no name to be found
    // under, so both are dropped rather than stored under an empty key.
    if (split <= 0) continue;
    params.set(decode(pair.slice(0, split)), decode(pair.slice(split + 1)));
  }

  return { tab: decode(head ?? ""), params };
}

/** Builds an href in the same grammar `parseHash` reads. */
export function hashHref(path: string, tab: string, params?: Record<string, string>): string {
  let href = `${path}#${encodeURIComponent(tab)}`;
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === "") continue;
    href += `&${key}=${encodeURIComponent(value)}`;
  }
  return href;
}

const listeners = new Set<() => void>();
let watching = false;

function announce(): void {
  for (const listener of listeners) listener();
}

/**
 * Every way the fragment can change, in one subscription.
 *
 * `hashchange` covers a link and the back button and misses the case that
 * matters most here. The command palette navigates with the Next router, and a
 * hash-only navigation is written with `history.pushState`, which fires no
 * event whatsoever by design. So a reader already on the magic page who looked
 * up a second spell got a new address bar and an unchanged page, which is the
 * original bug wearing a different hat.
 *
 * Hence the wrapper, installed once at the first subscriber and left in place:
 * there is no other way to hear a pushState. It notifies this module's
 * listeners only rather than dispatching a real `hashchange`, because the skill
 * planner and the chapter rail listen for that event and neither of them asked
 * to be woken by a tab switch.
 *
 * Browser only. Call it from an effect.
 */
export function subscribeToHash(listener: () => void): () => void {
  if (!watching) {
    watching = true;
    window.addEventListener("hashchange", announce);
    const push = window.history.pushState.bind(window.history);
    window.history.pushState = (...args: Parameters<History["pushState"]>): void => {
      push(...args);
      /* A microtask, not a direct call. The Next router reaches `pushState`
         from inside an insertion effect, and React refuses to accept a state
         update scheduled from that phase: doing it inline navigated correctly
         and logged "useInsertionEffect must not schedule updates" every time.
         Waiting for the stack to unwind puts the update back in ordinary
         territory, and the address bar is already correct by then. */
      queueMicrotask(announce);
    };
  }

  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
