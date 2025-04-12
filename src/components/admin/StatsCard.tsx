"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Stethoscope, Users } from "lucide-react";
import { motion } from "framer-motion";

export function StatsCards() {
	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const item = {
		hidden: { y: 20, opacity: 0 },
		show: { y: 0, opacity: 1 },
	};

	return (
		<motion.div
			className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
			variants={container}
			initial="hidden"
			animate="show"
		>
			<motion.div variants={item}>
				<Card className="glass-card shadow-lg hover:shadow-xl transition-shadow">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Total Patients
								</p>
								<h3 className="text-2xl font-bold mt-1">1,248</h3>
							</div>
							<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
								<Users className="h-6 w-6 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			<motion.div variants={item}>
				<Card className="glass-card shadow-lg hover:shadow-xl transition-shadow">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Total Doctors
								</p>
								<h3 className="text-2xl font-bold mt-1">36</h3>
							</div>
							<div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
								<Stethoscope className="h-6 w-6 text-blue-500" />
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			<motion.div variants={item}>
				<Card className="glass-card shadow-lg hover:shadow-xl transition-shadow">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div className="w-48">
								<p className="text-sm font-medium text-muted-foreground">
									Appointments Today
								</p>
								<h3 className="text-2xl font-bold mt-1">24</h3>
							</div>
							<div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
								<Calendar className="h-6 w-6 text-green-500" />
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			<motion.div variants={item}>
				<Card className="glass-card shadow-lg hover:shadow-xl transition-shadow">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Average Wait Time
								</p>
								<h3 className="text-2xl font-bold mt-1">14 min</h3>
							</div>
							<div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
								<Clock className="h-6 w-6 text-amber-500" />
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</motion.div>
	);
}
