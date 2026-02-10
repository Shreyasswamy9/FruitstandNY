"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import ProductPageBrandHeader from "@/components/ProductPageBrandHeader";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#fbf6f0] overflow-hidden">
      <ProductPageBrandHeader />

      <div className="relative mx-auto max-w-7xl px-6 pt-15 pb-8 sm:pt-12 sm:pb-16 lg:py-24">
        {/* Hero Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-6 sm:mb-12 lg:mb-20"
        >
          <div className="relative w-full h-75 sm:h-125 lg:h-175 bg-[#fbf6f0]">
            <Image
              src="/images/About-us/image.png"
              alt="Fruit stand"
              fill
              className="object-contain -rotate-90"
              priority
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>
        </motion.div>

        {/* About Us Heading */}
        <h1 className="text-4xl font-bold text-center mt-8">About FRUITSTAND:</h1>

        {/* Content Section */}
        <div className="mx-auto max-w-5xl mt-8">
          <div className="space-y-6 sm:space-y-10 lg:space-y-14">
            {/* First Paragraph - Staggered animation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 h-full w-1.5 bg-linear-to-b from-[#181818] via-[#181818]/50 to-transparent rounded-full" />
              <p className="font-avenir-black text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.2] text-[#181818] tracking-tight pl-6">
                Think of a real fruit stand in the city—early mornings, all day on the block. It's stacked with local and international variety and taste from everywhere, all in one place.
              </p>
            </motion.div>

            {/* Second Paragraph - Offset animation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
              className="relative ml-auto max-w-4xl"
            >
              <div className="absolute -right-4 top-0 h-full w-1.5 bg-linear-to-b from-[#181818] via-[#181818]/50 to-transparent rounded-full" />
              <p className="font-avenir-black text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.2] text-[#181818] tracking-tight pr-6">
                In reality, we're a three person team in an office, trying to make it happen.
              </p>
            </motion.div>
          </div>

          {/* Fun decorative accents */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "backOut" }}
            className="mt-16 sm:mt-24 flex items-center justify-center gap-2"
          >
            <div className="h-2 w-2 rounded-full bg-[#181818] animate-bounce" style={{ animationDelay: '0ms', animationDuration: '2s' }} />
            <div className="h-2 w-2 rounded-full bg-[#181818] animate-bounce" style={{ animationDelay: '200ms', animationDuration: '2s' }} />
            <div className="h-2 w-2 rounded-full bg-[#181818] animate-bounce" style={{ animationDelay: '400ms', animationDuration: '2s' }} />
          </motion.div>
        </div>

        {/* Enhanced decorative elements with color */}
        <div className="absolute top-1/4 -left-20 h-125 w-125 rounded-full bg-linear-to-br from-orange-200/20 to-yellow-200/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 h-150 w-150 translate-x-1/3 rounded-full bg-linear-to-bl from-red-200/20 to-pink-200/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 h-100 w-100 rounded-full bg-linear-to-tr from-green-200/20 to-blue-200/20 blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}
