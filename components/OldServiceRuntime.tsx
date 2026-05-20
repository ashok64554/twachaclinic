"use client";

import { useEffect } from "react";

export function OldServiceRuntime() {
  useEffect(() => {
    const root = document.querySelector(".old-service-detail");
    if (!root) return;

    const onClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const button = target.closest<HTMLElement>("[data-bs-toggle='collapse']");
      if (!button || !root.contains(button)) return;

      const selector = button.getAttribute("data-bs-target") || button.getAttribute("href");
      if (!selector || !selector.startsWith("#")) return;

      const panel = root.querySelector<HTMLElement>(selector);
      if (!panel) return;

      event.preventDefault();
      const parentSelector = panel.getAttribute("data-bs-parent");
      if (parentSelector) {
        root.querySelectorAll<HTMLElement>(`${parentSelector} .accordion-collapse.show`).forEach((item) => {
          if (item !== panel) {
            item.classList.remove("show");
            const id = item.getAttribute("id");
            if (id) root.querySelector<HTMLElement>(`[data-bs-target="#${id}"]`)?.classList.add("collapsed");
          }
        });
      }

      const willOpen = !panel.classList.contains("show");
      panel.classList.toggle("show", willOpen);
      button.classList.toggle("collapsed", !willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
    };

    const startCarousels = () => {
      const win = window as typeof window & { jQuery?: any };
      if (win.jQuery?.fn?.slick) {
        win.jQuery(root).find(".vs-carousel").each(function init(this: HTMLElement) {
          const carousel = win.jQuery(this);
          if (carousel.hasClass("slick-initialized")) return;
          carousel.slick({
            slidesToShow: Number(this.dataset.slideShow || 1),
            slidesToScroll: 1,
            fade: this.dataset.fade === "true",
            arrows: this.dataset.arrows === "true",
            dots: this.dataset.dots === "true",
            autoplay: this.dataset.autoplay === "true",
            responsive: [
              { breakpoint: 992, settings: { slidesToShow: Number(this.dataset.mdSlideShow || 1) } },
              { breakpoint: 768, settings: { slidesToShow: Number(this.dataset.smSlideShow || 1) } }
            ]
          });
        });
      }
    };

    document.addEventListener("click", onClick);
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      startCarousels();
      const win = window as typeof window & { jQuery?: any };
      if (attempts > 20 || win.jQuery?.fn?.slick) window.clearInterval(timer);
    }, 250);
    return () => {
      document.removeEventListener("click", onClick);
      window.clearInterval(timer);
    };
  }, []);

  return null;
}
