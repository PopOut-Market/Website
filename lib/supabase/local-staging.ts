/** Local test conveniences never apply to a production build or another backend. */
export function isLocalStaging(): boolean {
  const url = (
    process.env.EXPO_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  ).trim();
  return (
    process.env.NODE_ENV === "development" &&
    url === "https://yywerlbmbhckfvfoyfif.supabase.co" &&
    typeof window !== "undefined" &&
    ["127.0.0.1", "localhost"].includes(window.location.hostname)
  );
}
