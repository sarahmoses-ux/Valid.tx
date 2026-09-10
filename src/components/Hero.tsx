import { useEffect, useRef, useState } from "react";
// import VIDEO_URL from "../assets/hero-video.mp4";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4";

const SENSITIVITY = 0.8;

function useTypewriter(text: string, speed = 38, startDelay = 1000) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    const timeout = setTimeout(() => {
      let index = 0;

      interval = setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));

        if (index >= text.length) {
          setDone(true);

          if (interval) {
            clearInterval(interval);
          }
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);

      if (interval) {
        clearInterval(interval);
      }
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export default function Hero({
  onVerifyWallet,
}: {
  onVerifyWallet?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const prevX = useRef<number | null>(null);
  const targetTime = useRef(0);
  const isSeeking = useRef(false);

  const { displayed, done } = useTypewriter(
    "Turn wallet transaction history into cryptographically verified on-chain activity using Attestcoin, with verification references anchored through Creditcoin.",
    38,
    600,
  );

  /*
   * Mouse-controlled video scrubbing.
   */
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!video.duration || Number.isNaN(video.duration)) {
        prevX.current = event.clientX;
        return;
      }

      if (prevX.current === null) {
        prevX.current = event.clientX;
        return;
      }

      const currentX = event.clientX;
      const delta = currentX - prevX.current;

      prevX.current = currentX;

      const offset = (delta / window.innerWidth) * SENSITIVITY * video.duration;

      const currentTarget = targetTime.current || video.currentTime;

      targetTime.current = Math.max(
        0,
        Math.min(video.duration, currentTarget + offset),
      );

      if (!isSeeking.current) {
        isSeeking.current = true;
        video.currentTime = targetTime.current;
      }
    };

    const handleSeeked = () => {
      isSeeking.current = false;

      if (!video.duration) return;

      if (Math.abs(video.currentTime - targetTime.current) > 0.001) {
        isSeeking.current = true;

        video.currentTime = Math.max(
          0,
          Math.min(video.duration, targetTime.current),
        );
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    video.addEventListener("seeked", handleSeeked);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background video */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 z-0 h-full w-full object-cover"
        style={{ objectPosition: "70% center" }}
      />

      {/* Hero content */}

      <section className="w-full text-center flex flex-col items-center gap-5 mb-16 sm:mb-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-primary/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-primary/30 mb-4">
          <span className="w-2 h-2 rounded-full bg-secondary" />
          <span className="font-label-md text-label-md text-primary">
            Attestcoin Integration Live
          </span>
        </div>

        <h1 className="font-display-lg text-[36px] leading-[42px] font-extrabold sm:text-display-lg text-white max-w-3xl">
          Your On-Chain Activity.
          <br />
          <span className="gradient-text">Verified.</span>
        </h1>

        <p className="font-body-md text-body-md sm:text-body-lg text-black max-w-2xl mt-1 sm:mt-2">
          {displayed}

          {!done && (
            <span
              className="ml-[2px] inline-block h-[1.1em] w-[2px] align-middle bg-black"
              style={{
                animation: "blink 1s step-end infinite",
              }}
            />
          )}
        </p>

        <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-3 mt-4">
          <button
            type="button"
            onClick={onVerifyWallet}
            className="btn-primary px-6 py-3 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2"
          >
            Verify a Transaction
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </button>
          <a
            href="#how-it-works"
            className="px-6 text-black underline py-3 rounded-lg font-label-md text-label-md text-center"
          >
            Explore How It Works
          </a>
        </div>
      </section>
    </section>
  );
}
