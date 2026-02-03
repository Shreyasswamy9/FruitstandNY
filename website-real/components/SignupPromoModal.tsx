"use client";

import { useEffect, useState } from "react";

interface SignupPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupPromoModal({ isOpen, onClose }: SignupPromoModalProps) {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      window.localStorage.setItem("signupPromoSubmitted", "1");
    } catch {
      // no-op
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[12000] flex items-center justify-center bg-black/45 px-4 py-10"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-[420px] border border-black/40 bg-[#fbf6f0] px-8 py-10 shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-3xl leading-none text-black"
        >
          ×
        </button>

        <div className="text-center">
          <p className="text-sm font-semibold tracking-[0.4em] text-black">GET</p>
          <p className="mt-1 text-5xl font-black tracking-[0.08em] text-black">15% OFF</p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-black">
            BY SIGNING UP FOR
            <br />
            EMAIL OR TEXTS
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.16em] text-black">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email Address"
              className="w-full border border-black/40 bg-transparent px-4 py-3 text-sm text-black outline-none placeholder:text-black/60"
            />
          </div>

          <div className="flex items-center justify-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black">OR</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.16em] text-black">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone Number"
              className="w-full border border-black/40 bg-transparent px-4 py-3 text-sm text-black outline-none placeholder:text-black/60"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full bg-black py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
