"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#fbf6f0] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-[-120px] left-1/2 h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-[#181818]/10 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-160px] h-[360px] w-[360px] rounded-full bg-[#181818]/5 blur-3xl" />
      </div>

      <ProductPageBrandHeader />

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-24 text-center uppercase tracking-[0.22em]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-12"
        >
          <div className="space-y-3">
            <p className="text-xs text-[#6f6f6f]">STUDIO NOTE</p>
            <h1 className="text-2xl font-black text-[#181818] sm:text-3xl">ABOUT PAGE IN MAINTENANCE MODE</h1>
            <p className="mx-auto max-w-xl text-[11px] font-medium leading-relaxed text-[#4a4a4a]">
              WE ARE REFINING THE FRUITSTAND® STORY. EXPECT A FULL IMMERSIVE EXPERIENCE SOON. THANK YOU FOR STAYING WITH US WHILE WE POLISH EVERY DETAIL.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="grid gap-6 sm:grid-cols-2"
          >
            <div className="rounded-2xl border border-[#181818]/10 bg-white/80 p-6 shadow-[0_30px_60px_rgba(0,0,0,0.08)] backdrop-blur">
              <p className="text-[10px] font-semibold text-[#181818]/60">WHAT&apos;S COMING</p>
              <p className="mt-3 text-xs font-semibold text-[#181818]">
                A FULL LOOK INSIDE OUR DESIGN PROCESS, MATERIAL SOURCING, AND COLLABORATIONS.
              </p>
            </div>
            <div className="rounded-2xl border border-[#181818]/10 bg-white/80 p-6 shadow-[0_30px_60px_rgba(0,0,0,0.08)] backdrop-blur">
              <p className="text-[10px] font-semibold text-[#181818]/60">STAY LOOPED</p>
              <p className="mt-3 text-xs font-semibold text-[#181818]">
                FOLLOW @FRUITSTANDNY FOR LIVE DROPS AND BEHIND THE SCENES UNTIL THIS PAGE GOES LIVE.
              </p>
            </div>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="rounded-full border border-[#181818] bg-[#181818] px-8 py-3 text-[11px] font-semibold text-white transition-transform duration-200 ease-out hover:-translate-y-1 hover:bg-black"
            >
              BACK TO SHOP
            </Link>
            <Link
              href="/"
              className="rounded-full border border-[#181818] bg-transparent px-8 py-3 text-[11px] font-semibold text-[#181818] transition-transform duration-200 ease-out hover:-translate-y-1 hover:bg-[#181818] hover:text-white"
            >
              RETURN HOME
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
