import React from "react";
import { Outlet, useLocation } from "react-router";
import { Transition, Variants, motion } from "framer-motion";
import CompareCartButton from "../components/CompareCartButton.tsx";

const pageVariants: Variants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

const pageTransition: Transition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

export default function Root() {
  const { pathname } = useLocation();

  return (
    <div className="flex h-full flex-col bg-bg">
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        variants={pageVariants}
        transition={pageTransition}
        className="grow overflow-scroll">
        <Outlet />
      </motion.div>
      <CompareCartButton />
    </div>
  );
}
