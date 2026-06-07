/** Soft, varied avatar tints keyed off the name — for livelier list rows. */
const AVATAR_TONES = [
  "bg-primary/12 text-primary",
  "bg-success/15 text-success",
  "bg-info/15 text-info",
  "bg-warning/20 text-warning-foreground",
  "bg-destructive/12 text-destructive",
];

export function UserAvatar({ name, className = "" }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const idx = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_TONES.length;
  return (
    <div
      className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold ${AVATAR_TONES[idx]} ${className}`}
    >
      {initials}
    </div>
  );
}
