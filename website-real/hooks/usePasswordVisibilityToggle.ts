"use client";

import { useEffect } from "react";

const TOGGLE_BUTTON_CLASS = "fs-password-toggle";

const createToggleButton = (input: HTMLInputElement) => {
  const existing = input.parentElement?.querySelector<HTMLButtonElement>(`.${TOGGLE_BUTTON_CLASS}`);
  if (existing) return existing;

  const button = document.createElement("button");
  button.type = "button";
  button.className = TOGGLE_BUTTON_CLASS;
  button.setAttribute("aria-label", "Show password");
  button.textContent = "Show";
  button.style.position = "absolute";
  button.style.top = "50%";
  button.style.right = "12px";
  button.style.transform = "translateY(-50%)";
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
  if (input.dataset.hasVisibilityToggle === "true") return;

  const wrapper = input.parentElement;
  if (!wrapper) return;

  if (getComputedStyle(wrapper).position === "static") {
    wrapper.style.position = "relative";
  }

  const toggle = createToggleButton(input);
  wrapper.appendChild(toggle);
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

    return () => observer.disconnect();
  }, []);
}
