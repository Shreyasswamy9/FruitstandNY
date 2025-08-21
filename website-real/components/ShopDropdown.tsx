'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ShopDropdown() {
  const menuItems = [
    { name: 'T-Shirts', href: '/tshirts' },
    { name: 'Tracksuits', href: '/tracksuits' },
    { name: 'Jerseys', href: '/jerseys' },
    { name: 'Hats', href: '/hats' },
    { name: 'Socks', href: '/socks' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-full left-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/20"
    >
      <div className="py-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Link
              href={item.href}
              className="block px-4 py-2 text-gray-800 hover:text-gray-600 hover:bg-gray-100/50 transition-colors duration-200 text-sm font-medium"
            >
              {item.name}
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
