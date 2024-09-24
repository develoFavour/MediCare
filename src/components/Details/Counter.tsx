"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

const useCounter = (end: number, duration: number) => {
	const [count, setCount] = useState(0);
	const { ref, inView } = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});

	useEffect(() => {
		if (inView) {
			let start = 0;
			const increment = end / (duration / 16); // 60 FPS

			const timer = setInterval(() => {
				start += increment;
				setCount(Math.floor(start));

				if (start >= end) {
					clearInterval(timer);
					setCount(end);
				}
			}, 16);

			return () => clearInterval(timer);
		}
	}, [inView, end, duration]);

	return { count, ref };
};

interface CounterProps {
	end: number;
	duration?: number;
	label: string;
}

const Counter: React.FC<CounterProps> = ({ end, duration = 2000, label }) => {
	const { count, ref } = useCounter(end, duration);

	return (
		<div ref={ref} className="text-white relative w-56 pl-24">
			<span className="counter">{count}</span>
			<p>{label}</p>
		</div>
	);
};

export default Counter;
