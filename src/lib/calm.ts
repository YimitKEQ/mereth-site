/**
 * Quiet mode's boot script and storage key.
 *
 * Kept apart from the toggle component on purpose. The layout is a server
 * component and needs the script string; importing it from a file that also
 * exports a client component makes Fast Refresh give up and full-reload the
 * page on every edit, which it reports in the console as a warning nobody
 * connects back to this.
 */

export const CALM_KEY = "mereth:quiet";

/**
 * Runs before first paint, from the document head.
 *
 * If this ran in React instead, every reader in quiet mode would get one frame
 * of the full decorated page before it switched, which is precisely the jolt
 * the mode exists to avoid. It starts on for anybody whose system already asks
 * for reduced motion, because that request means the same thing.
 */
export const CALM_BOOT = `(function(){try{
var stored=localStorage.getItem(${JSON.stringify(CALM_KEY)});
var quiet=stored===null?window.matchMedia("(prefers-reduced-motion: reduce)").matches:stored==="on";
if(quiet)document.documentElement.setAttribute("data-calm","on");
}catch(e){}})();`;
