"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const MOTION = {
  scrollWrapperVh: 280,
  autoplayWrapperVh: 130,
  autoplayDurationSec: 5.2,
  wipeRange: [0.0, 0.25],
  labelRange: [0.2, 0.32],
  headlineRange: [0.24, 0.45],
  subheadlineRange: [0.4, 0.52],
  collageRange: [0.55, 1.0],
};

interface ClientEssentialsTransitionProps {
  autoplay?: boolean;
  label?: string;
  headline?: string;
  subheadline?: string;
  className?: string;
}

function StageGridOverlay({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`absolute inset-0 ${dark ? "opacity-20" : "opacity-25"}`}
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(24,48,95,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(24,48,95,0.25) 1px, transparent 1px)",
        backgroundSize: "84px 84px",
      }}
    />
  );
}

function LightStatsLayout() {
  return (
    <div className="absolute inset-0 p-5 sm:p-8">
      <div className="grid h-full grid-cols-12 grid-rows-6 gap-3">
        <div className="col-span-8 row-span-4 rounded-2xl bg-white/95 p-5 shadow-[0_16px_40px_rgba(29,51,97,0.16)]">
          <div className="mb-4 h-4 w-32 rounded-full bg-[#dce4fb]" />
          <div className="grid h-[82%] grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#eff3ff]" />
            <div className="rounded-xl bg-[#eff3ff]" />
            <div className="rounded-xl bg-[#e6eeff]" />
            <div className="rounded-xl bg-[#e6eeff]" />
          </div>
        </div>
        <div className="col-span-4 row-span-2 rounded-2xl bg-[#f9fbff] p-4 shadow-[0_10px_26px_rgba(29,51,97,0.12)]">
          <div className="h-3 w-20 rounded-full bg-[#dbe5ff]" />
          <div className="mt-3 h-10 w-full rounded-lg bg-[#eaf0ff]" />
        </div>
        <div className="col-span-4 row-span-2 rounded-2xl bg-[#f9fbff] p-4 shadow-[0_10px_26px_rgba(29,51,97,0.12)]">
          <div className="h-3 w-24 rounded-full bg-[#dbe5ff]" />
          <div className="mt-3 h-10 w-full rounded-lg bg-[#eaf0ff]" />
        </div>
        <div className="col-span-3 row-span-2 rounded-2xl bg-[#f7faff]" />
        <div className="col-span-3 row-span-2 rounded-2xl bg-[#f7faff]" />
        <div className="col-span-3 row-span-2 rounded-2xl bg-[#f7faff]" />
        <div className="col-span-3 row-span-2 rounded-2xl bg-[#f7faff]" />
      </div>
    </div>
  );
}

function CollageCard({
  title,
  className,
}: {
  title: string;
  className: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[#2d3d62] bg-[#121f38]/95 p-3 shadow-[0_14px_28px_rgba(0,0,0,0.25)] ${className}`}
    >
      <div className="h-3 w-20 rounded-full bg-[#36528a]" />
      <div className="mt-3 h-8 rounded-lg bg-[#1f345c]" />
      <div className="mt-2 h-2 w-2/3 rounded-full bg-[#2d4574]" />
      <div className="mt-2 text-xs text-[#8fa6d2]">{title}</div>
    </div>
  );
}

export default function ClientEssentialsTransition({
  autoplay = false,
  label = "Client essentials",
  headline = "Reduced Technical Errors Can Improve Your Bottom Line",
  subheadline = "Your website could be losing customers without you even knowing it.",
  className,
}: ClientEssentialsTransitionProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const autoplayProgress = useMotionValue(0);

  useEffect(() => {
    if (!autoplay) return;

    autoplayProgress.set(0);
    let rafId = 0;
    const durationMs = MOTION.autoplayDurationSec * 1000;
    const startMs = performance.now();

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const elapsed = now - startMs;
      const linear = Math.min(elapsed / durationMs, 1);
      autoplayProgress.set(easeOut(linear));

      if (linear < 1) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(rafId);
  }, [autoplay, autoplayProgress]);

  const baseProgress = autoplay ? autoplayProgress : scrollYProgress;
  const progress = useSpring(baseProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.35,
  });

  const wipeProgress = useTransform(progress, MOTION.wipeRange, [0, 1], {
    clamp: true,
  });
  const wipeTopInset = useTransform(wipeProgress, [0, 1], [100, 0]);
  const wipeClipPath = useMotionTemplate`inset(${wipeTopInset}% 0% 0% 0%)`;

  const labelOpacity = useTransform(progress, MOTION.labelRange, [0, 1], {
    clamp: true,
  });
  const labelY = useTransform(progress, MOTION.labelRange, [12, 0], {
    clamp: true,
  });

  const headlineOpacity = useTransform(progress, MOTION.headlineRange, [0, 1], {
    clamp: true,
  });
  const headlineY = useTransform(progress, MOTION.headlineRange, [18, 0], {
    clamp: true,
  });
  const headlineBlurPx = useTransform(progress, MOTION.headlineRange, [12, 0], {
    clamp: true,
  });
  const headlineFilter = useMotionTemplate`blur(${headlineBlurPx}px)`;

  const subheadlineOpacity = useTransform(
    progress,
    MOTION.subheadlineRange,
    [0, 1],
    { clamp: true },
  );
  const subheadlineY = useTransform(progress, MOTION.subheadlineRange, [12, 0], {
    clamp: true,
  });

  const collageProgress = useTransform(progress, MOTION.collageRange, [0, 1], {
    clamp: true,
  });
  const collageY = useTransform(collageProgress, [0, 1], [240, 0]);
  const collageOpacity = useTransform(collageProgress, [0, 0.2, 1], [0, 0.75, 1]);

  const phoneY = useTransform(collageProgress, [0, 1], [210, 0]);
  const c1Y = useTransform(collageProgress, [0, 1], [175, 0]);
  const c2Y = useTransform(collageProgress, [0, 1], [190, 0]);
  const c3Y = useTransform(collageProgress, [0, 1], [145, 0]);
  const c4Y = useTransform(collageProgress, [0, 1], [210, 0]);
  const c5Y = useTransform(collageProgress, [0, 1], [160, 0]);
  const c6Y = useTransform(collageProgress, [0, 1], [220, 0]);

  return (
    <section className={`relative bg-[#f18a38] ${className ?? ""}`}>
      <div
        ref={wrapperRef}
        className="relative"
        style={{
          height: `${autoplay ? MOTION.autoplayWrapperVh : MOTION.scrollWrapperVh}vh`,
        }}
      >
        <div className="sticky top-0 flex h-screen items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
          <div className="relative aspect-[16/9] w-full max-w-[1180px] overflow-hidden rounded-[34px] bg-[#ecf2ff] shadow-[0_26px_60px_rgba(19,24,40,0.25)]">
            <LightStatsLayout />

            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-[#111e35] to-[#0a1325]"
              style={{ clipPath: wipeClipPath }}
            >
              <StageGridOverlay dark />
            </motion.div>

            <div className="pointer-events-none absolute inset-0">
              <motion.div
                className="absolute left-1/2 top-[11%] z-20 w-[min(860px,88%)] -translate-x-1/2 text-center"
                style={{ opacity: labelOpacity, y: labelY }}
              >
                <span className="inline-flex rounded-full bg-[#2e3f63] px-5 py-2 text-sm text-[#dbe8ff]">
                  {label}
                </span>
              </motion.div>

              <motion.h2
                className="absolute left-1/2 top-[22%] z-20 w-[min(980px,92%)] -translate-x-1/2 text-center text-[32px] leading-[1.02] text-[#eaf2ff] [font-family:var(--font-anton)] md:text-[58px]"
                style={{
                  opacity: headlineOpacity,
                  y: headlineY,
                  filter: headlineFilter,
                }}
              >
                {headline}
              </motion.h2>

              <motion.p
                className="absolute left-1/2 top-[42%] z-20 w-[min(760px,88%)] -translate-x-1/2 text-center text-sm leading-relaxed text-[#b8c8e7] md:text-[18px]"
                style={{ opacity: subheadlineOpacity, y: subheadlineY }}
              >
                {subheadline}
              </motion.p>

              <motion.div
                className="absolute inset-x-0 bottom-0 z-10 mx-auto w-[94%] pb-5 sm:pb-6"
                style={{ y: collageY, opacity: collageOpacity }}
              >
                <div className="grid grid-cols-12 gap-3">
                  <motion.div className="col-span-3" style={{ y: c1Y }}>
                    <CollageCard title="Audit snapshot" className="h-[110px]" />
                  </motion.div>

                  <motion.div className="col-span-3" style={{ y: c2Y }}>
                    <CollageCard title="Fix checklist" className="h-[120px]" />
                  </motion.div>

                  <motion.div className="col-span-3" style={{ y: c3Y }}>
                    <CollageCard title="Error routing" className="h-[102px]" />
                  </motion.div>

                  <motion.div className="col-span-3" style={{ y: c4Y }}>
                    <CollageCard title="Client alerts" className="h-[116px]" />
                  </motion.div>

                  <motion.div className="col-span-4" style={{ y: c5Y }}>
                    <CollageCard title="SEO task queue" className="h-[126px]" />
                  </motion.div>

                  <motion.div
                    className="col-span-4 row-span-2 -mt-10 px-4 sm:px-6"
                    style={{ y: phoneY }}
                  >
                    <div className="mx-auto h-[280px] w-[160px] rounded-[28px] border border-[#324d80] bg-gradient-to-b from-[#16284a] to-[#0e1c35] p-2 shadow-[0_18px_40px_rgba(0,0,0,0.42)]">
                      <div className="h-full rounded-[22px] border border-[#2d4677] bg-[#0d1930] p-3">
                        <div className="mx-auto mb-3 h-1 w-16 rounded-full bg-[#3f5f95]" />
                        <div className="space-y-2">
                          <div className="h-12 rounded-lg bg-[#1a2e52]" />
                          <div className="h-8 rounded-lg bg-[#1a2e52]" />
                          <div className="h-8 rounded-lg bg-[#1a2e52]" />
                          <div className="h-14 rounded-lg bg-[#223a66]" />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div className="col-span-4 mt-6" style={{ y: c6Y }}>
                    <CollageCard title="Weekly trend" className="h-[126px]" />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <StageGridOverlay />
          </div>
        </div>
      </div>
    </section>
  );
}
