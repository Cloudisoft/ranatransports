import { LinkButton } from "@/components/ui/Button";
import { HighwayScene } from "@/components/graphics/HighwayScene";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[90svh] flex-col justify-center overflow-hidden pt-24">
      <div className="container-x relative z-10 text-center">
        <p className="font-display text-8xl font-bold text-gradient">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold uppercase text-white">This road doesn&apos;t lead anywhere.</h1>
        <p className="mt-3 text-slate-400">The page you were looking for has moved or does not exist.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton href="/">Back to Home</LinkButton>
          <LinkButton href="/contact#quote" variant="ghost">Get a Quote</LinkButton>
        </div>
      </div>
      <HighwayScene className="absolute inset-x-0 bottom-0 h-[30vh]" dense={false} />
    </section>
  );
}
