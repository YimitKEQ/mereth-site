import { redirect } from "next/navigation";

/**
 * The chronicle became the changelog.
 *
 * They were the same page with different names, and the changelog does it
 * better: searchable, filterable by kind, and carrying the whole history rather
 * than the last few. This redirect stays because the old path is linked from
 * outside the site.
 */
export default function ChroniclePage() {
  redirect("/changelog");
}
