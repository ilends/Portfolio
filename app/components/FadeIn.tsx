"use client";

import { motion } from "framer-motion";

const springTransition = {
  type: "spring" as const,
  stiffness: 80,
  damping: 13,
  mass: 0.9,
};

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/** Single element: fade up with a bouncy spring on scroll-enter. */
export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...springTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Staggered container: children animate in one-by-one on scroll-enter. */
export function StaggerContainer({
  children,
  className,
  stagger = 0.09,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Item inside a StaggerContainer — inherits parent variants. */
export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 22 },
        visible: {
          opacity: 1,
          y: 0,
          transition: springTransition,
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
