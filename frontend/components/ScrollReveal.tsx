"use client";

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children?: ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right';
  hero?: boolean;
  amount?: number;
  delay?: number;
  once?: boolean;
  style?: React.CSSProperties;
}

interface ScrollRevealGroupProps {
  children?: ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right';
  stagger?: number;
  delayChildren?: number;
  hero?: boolean;
  style?: React.CSSProperties;
}

interface ScrollRevealItemProps {
  children?: ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right';
  hero?: boolean;
  style?: React.CSSProperties;
}

function getHiddenState(direction: 'up' | 'left' | 'right', hero?: boolean) {
  const x = direction === 'left' ? -40 : direction === 'right' ? 40 : 0;
  const y = direction === 'up' ? 40 : 0;

  return {
    opacity: 0,
    x,
    y,
    scale: hero ? 0.985 : 0.98,
  };
}

function getVisibleTransition(hero?: boolean, delay = 0) {
  if (hero) {
    return {
      opacity: { duration: 1.8, ease: [0.16, 1, 0.3, 1] },
      x: { type: 'spring', stiffness: 40, damping: 22, mass: 1, delay },
      y: { type: 'spring', stiffness: 40, damping: 22, mass: 1, delay },
      scale: { type: 'spring', stiffness: 40, damping: 22, mass: 1, delay },
    } as const;
  }

  return {
    type: 'spring',
    stiffness: 50,
    damping: 20,
    mass: 1,
    delay,
  } as const;
}

function createVariants(direction: 'up' | 'left' | 'right', hero?: boolean, delay = 0) {
  return {
    hidden: getHiddenState(direction, hero),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: getVisibleTransition(hero, delay),
    },
  };
}

export function ScrollRevealGroup({
  children,
  className,
  direction = 'up',
  stagger = 0.12,
  delayChildren = 0,
  hero,
  style,
}: ScrollRevealGroupProps) {
  const groupVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealItem({ children, className, direction = 'up', hero, style }: ScrollRevealItemProps) {
  const variants = createVariants(direction, hero);

  return (
    <motion.div className={className} variants={variants} style={{ willChange: 'transform, opacity', ...style }}>
      {children}
    </motion.div>
  );
}

export default function ScrollReveal({
  children,
  className,
  direction = 'up',
  hero,
  amount = 0.2,
  delay = 0,
  once = true,
  style,
}: ScrollRevealProps) {
  const variants = createVariants(direction, hero, delay);

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      style={{ willChange: 'transform, opacity', ...style }}
    >
      {children}
    </motion.div>
  );
}