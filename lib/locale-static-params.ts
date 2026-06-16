import { LOCALE_SEGMENT_TO_CODE } from "@/lib/site-locale-routing";

/** Static params for the `[locale]` segment — one entry per supported locale.
 *  Re-export as `generateStaticParams` from each localized page so Next
 *  pre-renders a static variant per locale. */
export function localeStaticParams(): { locale: string }[] {
  return Object.keys(LOCALE_SEGMENT_TO_CODE).map((locale) => ({ locale }));
}
