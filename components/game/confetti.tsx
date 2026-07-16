"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export function useCelebrationConfetti(trigger: boolean) {
  useEffect(() => {
    if (!trigger) return;
    const colors = ["#3B82F6", "#10b981", "#f97316"];
    const duration = 1400;
    const end = Date.now() + duration;

    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    confetti({ particleCount: 80, spread: 100, origin: { y: 0.4 }, colors });
  }, [trigger]);
}
