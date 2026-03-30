"use client";

import { useEffect, useRef } from "react";

export function useFadeIn(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    // Observe the element itself and all children with fade-up-hidden
    const targets = [el, ...Array.from(el.querySelectorAll(".fade-up-hidden"))];
    targets.forEach((t) => {
      if (t.classList.contains("fade-up-hidden")) {
        observer.observe(t);
      }
    });

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
