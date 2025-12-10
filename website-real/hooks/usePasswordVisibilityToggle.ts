"use client";

import { useEffect } from "react";

const TOGGLE_BUTTON_CLASS = "fs-password-toggle";
const resizeHandlers = new Map<HTMLInputElement, () => void>();
const resizeObservers = new Map<HTMLInputElement, ResizeObserver>();

const createToggleButton = (input: HTMLInputElement) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = TOGGLE_BUTTON_CLASS;
  button.setAttribute("aria-label", "Show password");
  button.textContent = "Show";
  button.style.position = "absolute";
  button.style.top = "0";
  button.style.right = "12px";
  button.style.background = "transparent";
  button.style.border = "none";
  button.style.cursor = "pointer";
  button.style.fontSize = "14px";
  button.style.lineHeight = "1";
  button.style.padding = "4px";
  button.style.color = "#4b5563";

  button.addEventListener("click", () => {
    const isHidden = input.getAttribute("type") === "password";
    input.setAttribute("type", isHidden ? "text" : "password");
    button.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    button.textContent = isHidden ? "Hide" : "Show";
    input.focus({ preventScroll: true });
  });

  return button;
};

const enhancePasswordInput = (input: HTMLInputElement) => {
  const wrapper = input.parentElement;
  if (!wrapper) return;

  if (getComputedStyle(wrapper).position === "static") {
    wrapper.style.position = "relative";
  }

  let toggle = wrapper.querySelector<HTMLButtonElement>(`.${TOGGLE_BUTTON_CLASS}`);
  if (!toggle) {
    toggle = createToggleButton(input);
    wrapper.appendChild(toggle);
  }

  if (parseFloat(getComputedStyle(input).paddingRight || "0") < 40) {
    input.style.paddingRight = "48px";
  }

  const positionToggle = () => {
    if (!toggle || !wrapper.isConnected || !input.isConnected) return;
    const wrapperRect = wrapper.getBoundingClientRect();
    const inputRect = input.getBoundingClientRect();
    const offset = inputRect.top - wrapperRect.top + inputRect.height / 2;
    toggle.style.top = `${offset}px`;
    toggle.style.transform = "translateY(-50%)";
  };

  positionToggle();
  requestAnimationFrame(positionToggle);

  if (!resizeHandlers.has(input)) {
    const resizeHandler = () => positionToggle();
    resizeHandlers.set(input, resizeHandler);
    window.addEventListener("resize", resizeHandler);
  }

  if (!resizeObservers.has(input) && typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(() => positionToggle());
    observer.observe(input);
    resizeObservers.set(input, observer);
  }

  input.dataset.hasVisibilityToggle = "true";
};

export function usePasswordVisibilityToggle() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scan = () => {
      const passwordInputs = document.querySelectorAll<HTMLInputElement>('input[type="password"]');
      passwordInputs.forEach(enhancePasswordInput);
    };

    scan();

    const observer = new MutationObserver(() => {
      scan();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      resizeHandlers.forEach((handler) => {
        window.removeEventListener("resize", handler);
      });
      resizeHandlers.clear();
      resizeObservers.forEach((resizeObserver) => {
        resizeObserver.disconnect();
      });
      resizeObservers.clear();
    };
  }, []);
}
