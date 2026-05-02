'use client';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } }
};

export function HeroContent({ title, subtitle, children }) {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex-1 text-center lg:text-left"
    >
      <motion.h1 
        variants={item}
        className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-[1.1] text-primary"
      >
        {title}
      </motion.h1>
      <motion.p 
        variants={item}
        className="text-xl mb-10 max-w-xl leading-relaxed mx-auto lg:mx-0 text-muted"
      >
        {subtitle}
      </motion.p>
      <motion.div variants={item}>
        {children}
      </motion.div>
    </motion.div>
  );
}

export function HeroImage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
      className="flex-1 relative w-full max-w-lg lg:max-w-none"
    >
      {children}
    </motion.div>
  );
}
