// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { motion } from "framer-motion";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";

// export function ClientDashboardNav() {
// 	const pathname = usePathname();
// 	const [isHovered, setIsHovered] = useState<string | null>(null);

// 	return (
// 		<ScrollArea className="h-full py-6 pl-8 pr-6">
// 			<div className="flex flex-col items-center mb-6">
// 				<Avatar className="w-20 h-20 mb-4">
// 					<AvatarImage
// 						src="/placeholder.svg?height=80&width=80"
// 						alt="Patient"
// 					/>
// 					<AvatarFallback>PA</AvatarFallback>
// 				</Avatar>
// 				<h2 className="text-lg font-semibold">Carole Johnson</h2>
// 				<p className="text-sm text-muted-foreground">Patient ID: 123456</p>
// 			</div>
// 			<nav className="flex flex-col gap-4">
// 				{navItems.map((item) => (
// 					<Link key={item.href} href={item.href}>
// 						<Button
// 							variant={pathname === item.href ? "default" : "ghost"}
// 							className="w-full justify-start gap-2 relative"
// 							onMouseEnter={() => setIsHovered(item.href)}
// 							onMouseLeave={() => setIsHovered(null)}
// 						>
// 							<item.icon className="h-5 w-5" />
// 							<span>{item.label}</span>
// 							{isHovered === item.href && (
// 								<motion.div
// 									className="absolute bottom-0 left-0 h-0.5 bg-primary"
// 									initial={{ width: 0 }}
// 									animate={{ width: "100%" }}
// 									transition={{ duration: 0.3 }}
// 								/>
// 							)}
// 						</Button>
// 					</Link>
// 				))}
// 			</nav>
// 		</ScrollArea>
// 	);
// }
