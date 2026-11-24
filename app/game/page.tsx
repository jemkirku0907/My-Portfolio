import { GamePageContent } from "@/components/GamePageContent";

export default function GamePage() {
  return (
    <main className="min-h-[calc(100dvh-3.75rem)] w-full max-w-full overflow-x-clip lg:min-h-dvh">
      <section className="mx-auto grid min-h-[calc(100dvh-3.75rem)] w-full max-w-4xl place-items-center px-4 py-8 sm:px-8 sm:py-10 lg:min-h-dvh lg:px-12">
        <GamePageContent />
      </section>
    </main>
  );
}
