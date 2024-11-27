import React from "react";
import { motion, useAnimation } from "framer-motion";

const FloatingParticle = ({ delay }: { delay: number }) => (
	<motion.div
		className="absolute h-3 w-3 rounded-full bg-teal-300"
		initial={{ opacity: 0, y: 0 }}
		animate={{
			opacity: [0, 1, 0],
			y: [0, -100],
			x: Math.random() * 100 - 50,
		}}
		transition={{
			duration: 5,
			repeat: Infinity,
			delay: delay,
			ease: "easeInOut",
		}}
	/>
);

export default FloatingParticle;
