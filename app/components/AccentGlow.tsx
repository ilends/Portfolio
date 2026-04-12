/**
 * Sky → blue → teal gradient emphasis (aquatic clinical, not flat neon).
 * Dark mode uses lighter stops; light mode uses deeper stops for contrast on white.
 */
export function AccentGlow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline px-[0.04em] font-medium bg-gradient-to-r from-sky-600 via-blue-600 to-teal-600 bg-clip-text text-transparent dark:from-sky-300 dark:via-[#7eb0ff] dark:to-teal-300">
      {children}
    </span>
  );
}
