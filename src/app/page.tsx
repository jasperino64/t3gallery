import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import { ArrowRight, CloudUpload, Images as ImagesIcon, LockKeyhole } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getMyImages } from "~/server/queries";

export const dynamic = "force-dynamic";

function LandingPage() {
  return (
    <section className="relative isolate flex min-h-full flex-col overflow-hidden bg-[#101014] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[34rem] rounded-full bg-violet-600/20 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -left-40 -z-10 size-[30rem] rounded-full bg-fuchsia-500/10 blur-[120px]"
      />

      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-14 px-6 py-16 sm:px-10 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:px-16 lg:py-20">
        <div className="max-w-2xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-white/70">
            <span className="size-2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]" />
            A little more room for what matters
          </div>

          <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Your photos,
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-rose-200 bg-clip-text text-transparent">
              all in one place.
            </span>
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-white/60 sm:text-xl">
            A calm, private home for your favorite images. Sign in to pick up
            where your memories are.
          </p>

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <SignInButton mode="modal">
              <button
                type="button"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-white px-6 text-base font-semibold text-[#17151d] shadow-[0_12px_40px_rgba(167,139,250,0.18)] transition hover:-translate-y-0.5 hover:bg-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300"
              >
                Sign in to your gallery
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:translate-x-1"
                />
              </button>
            </SignInButton>
            <span className="inline-flex items-center gap-2 text-sm text-white/45">
              <LockKeyhole aria-hidden="true" className="size-4" />
              Your collection stays yours
            </span>
          </div>
        </div>

        <div
          aria-label="A preview of a personal photo collection"
          className="relative mx-auto w-full max-w-xl"
        >
          <div className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 blur-2xl" />
          <div className="relative grid aspect-[1.08] grid-cols-12 grid-rows-6 gap-3 rounded-[2rem] border border-white/10 bg-[#1a191f]/90 p-3 shadow-2xl sm:gap-4 sm:p-4">
            <div className="col-span-7 row-span-4 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-200 via-orange-300 to-rose-400">
              <div className="h-full w-full bg-[radial-gradient(ellipse_at_55%_25%,rgba(255,255,255,0.75),transparent_18%),radial-gradient(ellipse_at_75%_75%,rgba(104,55,80,0.75),transparent_35%),linear-gradient(145deg,transparent_45%,rgba(49,37,57,0.7))]" />
            </div>
            <div className="col-span-5 row-span-3 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-200 via-cyan-300 to-indigo-400">
              <div className="h-full w-full bg-[radial-gradient(ellipse_at_25%_30%,rgba(255,255,255,0.8),transparent_22%),linear-gradient(150deg,transparent_42%,rgba(28,48,90,0.7))]" />
            </div>
            <div className="col-span-5 row-span-3 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-200 via-teal-300 to-cyan-500">
              <div className="h-full w-full bg-[radial-gradient(ellipse_at_70%_35%,rgba(255,255,255,0.8),transparent_20%),linear-gradient(30deg,transparent_48%,rgba(18,73,71,0.65))]" />
            </div>
            <div className="col-span-4 row-span-2 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-300 via-purple-400 to-fuchsia-500">
              <div className="h-full w-full bg-[radial-gradient(ellipse_at_50%_25%,rgba(255,255,255,0.8),transparent_20%),linear-gradient(140deg,transparent_50%,rgba(67,35,92,0.65))]" />
            </div>
            <div className="col-span-3 row-span-2 overflow-hidden rounded-2xl bg-gradient-to-br from-rose-200 via-pink-300 to-orange-300">
              <div className="h-full w-full bg-[radial-gradient(ellipse_at_40%_30%,rgba(255,255,255,0.8),transparent_25%),linear-gradient(145deg,transparent_50%,rgba(102,45,65,0.55))]" />
            </div>
            <div className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#24222b] px-4 py-3 shadow-xl sm:-left-8">
              <div className="flex size-10 items-center justify-center rounded-xl bg-violet-400/15 text-violet-200">
                <ImagesIcon aria-hidden="true" className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Your own space</p>
                <p className="text-xs text-white/45">Ready when you are</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl items-center justify-between border-t border-white/[0.07] px-6 py-5 text-xs text-white/35 sm:px-10 lg:px-16">
        <span>T3 Gallery</span>
        <span className="inline-flex items-center gap-2">
          <CloudUpload aria-hidden="true" className="size-4" />
          Sign in to upload and organize
        </span>
      </div>
    </section>
  );
}

async function Gallery() {
  const images = await getMyImages();

  if (images.length === 0) {
    return (
      <section className="mx-auto flex min-h-full max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
          <ImagesIcon aria-hidden="true" className="size-7" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          Your gallery starts here
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Your space is ready. Upload a few photos and they’ll find a home here.
        </p>
        <p className="mt-6 text-sm text-muted-foreground">
          Use the upload button above to add your first image.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-violet-300">YOUR COLLECTION</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            A place for every moment
          </h1>
        </div>
        <p className="pb-1 text-sm text-muted-foreground">
          {images.length} {images.length === 1 ? "photo" : "photos"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
        {images.map((image) => (
          <Link
            key={image.id}
            href={`/img/${image.id}`}
            className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-card transition hover:-translate-y-1 hover:border-violet-300/30 hover:shadow-xl hover:shadow-violet-950/20"
          >
            <div className="relative aspect-square overflow-hidden bg-muted">
              <Image
                className="object-contain transition duration-300"
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, (max-width: 1536px) 17vw, 13vw"
                src={image.url}
                alt={image.name}
              />
            </div>
            <p className="truncate px-4 py-3 text-sm font-medium text-card-foreground">
              {image.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const { userId } = await auth();

  return userId ? await Gallery() : <LandingPage />;
}
