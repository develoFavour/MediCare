"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

export function ThemeSwitcher() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	// Avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className="relative">
					<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					<motion.div
						initial={{ x: -5, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						className="flex items-center"
					>
						<Sun className="mr-2 h-4 w-4" />
						<span>Light</span>
					</motion.div>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					<motion.div
						initial={{ x: -5, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ delay: 0.1 }}
						className="flex items-center"
					>
						<Moon className="mr-2 h-4 w-4" />
						<span>Dark</span>
					</motion.div>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					<motion.div
						initial={{ x: -5, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="flex items-center"
					>
						<Monitor className="mr-2 h-4 w-4" />
						<span>System</span>
					</motion.div>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
