import Image from "next/image";

export default function LoadingProject() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6 text-fg">
      <div className="flex flex-col items-center text-center">
        <div className="animate-pulse rounded-2xl border border-line/70 bg-card/80 px-8 py-6 shadow-soft">
          <Image
            src="/logo/digital-sign-nym.png"
            alt="Mehedi Hasan Nayem"
            width={240}
            height={100}
            priority
            className="h-auto w-48 dark:invert"
          />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Loading case study
        </p>
        <div className="mt-4 flex gap-1.5" aria-hidden="true">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:-0.25s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:-0.12s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent" />
        </div>
      </div>
    </main>
  );
}
