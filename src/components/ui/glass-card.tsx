"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";

interface GlassCardProps {
	className?: string;
	children: React.ReactNode;
	header?: React.ReactNode;
	title?: React.ReactNode;
	description?: React.ReactNode;
	footer?: React.ReactNode;
	animate?: boolean;
}

export function GlassCard({
	className,
	children,
	header,
	title,
	description,
	footer,
	animate = true,
}: GlassCardProps) {
	const CardComponent = animate ? motion.div : Card;
	const animationProps = animate
		? {
				initial: { opacity: 0, y: 20 },
				animate: { opacity: 1, y: 0 },
				transition: { duration: 0.5 },
		  }
		: {};

	return (
		<CardComponent
			className={cn("glass-card overflow-hidden", className)}
			{...animationProps}
		>
			{(header || title || description) && (
				<CardHeader>
					{header}
					{title && <CardTitle>{title}</CardTitle>}
					{description && <CardDescription>{description}</CardDescription>}
				</CardHeader>
			)}
			<CardContent>{children}</CardContent>
			{footer && <CardFooter>{footer}</CardFooter>}
		</CardComponent>
	);
}
