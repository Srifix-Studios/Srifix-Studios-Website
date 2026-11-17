import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../styles/preloader.css";

export default function Preloader() {
  const [mounted, setMounted] = useState(true);
  const rootRef = useRef(null);
  const hudRef = useRef(null);
  const counterRef = useRef(null);
  const iconFillRef = useRef(null);

  useEffect(() => {
    if (!mounted) return undefined;

    const root = rootRef.current;
    const hud = hudRef.current;
    const previousOverflow = document.body.style.overflow;
    let active = true;
    let tickerAdded = false;

    // Keep the page still while the preloader is visible.
    document.body.style.overflow = "hidden";
    window.lenis?.stop?.();

    const progressState = { value: 0 };

   
const renderProgress = () => {
  const progress = Math.max(
    0,
    Math.min(100, progressState.value)
  );

  if (counterRef.current) {
    counterRef.current.textContent = `${Math.round(progress)}%`;
  }

  if (!iconFillRef.current) return;

  if (progress >= 100) {
    iconFillRef.current.style.clipPath = "inset(0 0 0 0)";
    return;
  }

  const phase = performance.now() / 350;
  const amplitude = 3;
  const points = [];

  for (let x = 0; x <= 100; x += 2) {
    const wave =
      Math.sin((x / 100) * Math.PI * 4 + phase) * amplitude;

    const y = 100 - progress + wave;

    points.push(`${x}% ${y}%`);
  }

  iconFillRef.current.style.clipPath =
    `polygon(0% 100%, 100% 100%, ${points.reverse().join(", ")})`;
};


    gsap.ticker.add(renderProgress);
    tickerAdded = true;

    const waitForPageReady = async () => {
      const pageLoad =
        document.readyState === "complete"
          ? Promise.resolve()
          : new Promise((resolve) => {
              window.addEventListener("load", resolve, { once: true });
            });

      const fontsReady = document.fonts?.ready ?? Promise.resolve();
      await Promise.all([pageLoad, fontsReady]);
    };

    const tweenProgress = (target, duration) =>
      new Promise((resolve) => {
        gsap.to(progressState, {
          value: target,
          duration,
          ease: "power1.out",
          onUpdate: renderProgress,
          onComplete: resolve,
        });
      });

    const runPreloader = async () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) {
        progressState.value = 100;
        renderProgress();
      } else {
        await tweenProgress(85, 4);
        if (!active) return;

        await waitForPageReady();
        if (!active) return;

        await tweenProgress(100, 1.2);
        if (!active) return;
      }

      if (tickerAdded) {
        gsap.ticker.remove(renderProgress);
        tickerAdded = false;
      }

      gsap.to(hud, {
        autoAlpha: 0,
        duration: 0.35,
        ease: "power1.out",
      });

      gsap.to(root, {
        autoAlpha: 0,
        duration: 0.6,
        delay: 0.15,
        ease: "power2.out",
        onComplete: () => {
          if (active) setMounted(false);
        },
      });
    };

    runPreloader();

    return () => {
      active = false;
      if (tickerAdded) gsap.ticker.remove(renderProgress);
      gsap.killTweensOf(progressState);
      gsap.killTweensOf(hud);
      gsap.killTweensOf(root);
      document.body.style.overflow = previousOverflow;
      window.lenis?.start?.();
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="preloader" ref={rootRef} aria-label="Loading" role="status">
    <div className="preloader-hud" ref={hudRef}>
  <div className="preloader-brand">
    <span className="brand-sri">SRIFIX</span>{" "}
    <span className="brand-studios">STUDIOS</span>
  </div>


        <div className="preloader-icon">
          <img
            src="/assets/favicon-logo.png"
            className="preloader-icon-base"
            alt=""
            aria-hidden="true"
          />

          <div className="preloader-icon-fill" ref={iconFillRef}>
            <img
              src="/assets/favicon-logo.png"
              className="preloader-icon-fill-image"
              alt=""
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="preloader-progress">
          <span ref={counterRef}>0%</span>
          <span className="preloader-loading-label">LOADING EXPERIENCE</span>
        </div>
      </div>
    </div>
  );
}
