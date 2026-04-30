import { FadeIn } from "@/components/motion";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <FadeIn className="max-w-3xl">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-5 font-[family-name:var(--font-display)] text-4xl leading-tight text-fg sm:text-5xl">
        {title}
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
        {description}
      </p>
    </FadeIn>
  );
}
