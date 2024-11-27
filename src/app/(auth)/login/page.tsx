"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Home } from "lucide-react";
import { motion, useAnimation } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons/icon";
import SideImg from "@/components/ui/sideImg";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

interface LoginFormData {
	email: string;
	password: string;
}

export default function LoginPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState<LoginFormData>({
		email: "",
		password: "",
	});
	const controls = useAnimation();
	const router = useRouter();

	useEffect(() => {
		controls.start({
			y: [0, -10, 0],
			transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
		});
	}, [controls]);

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsLoading(true);

		try {
			const response = await axios.post("/api/users/login", formData);

			if (response.data.success) {
				toast.success("Login successful");
				console.log(response);

				router.push("/protected");
			} else {
				toast.error(response.data.error || "Login failed");
			}
		} catch (error: any) {
			console.error("Login error:", error);
			toast.error(error.response?.data?.error || "Invalid credentials");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen flex-col lg:flex-row bg-[#2272bd]">
			<SideImg img="/img/health4.png" />
			<main className="flex flex-1 items-center justify-center p-6 lg:p-8">
				<div className="absolute top-0 right-0 px-4 py-4 text-white">
					<Link href="/" aria-label="Go to home page">
						<Home className="h-6 w-6" />
					</Link>
				</div>
				<div className="w-full max-w-md space-y-6">
					<motion.div
						className="space-y-2 text-center"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h1 className="text-3xl font-semibold tracking-tight text-white">
							Login
						</h1>
						<p className="text-sm text-white">
							Enter your email and password below to login
						</p>
					</motion.div>
					<motion.form
						onSubmit={onSubmit}
						className="space-y-4"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.5 }}
					>
						<div className="space-y-2">
							<Label htmlFor="email" className="text-gray-300">
								Email
							</Label>
							<Input
								id="email"
								placeholder="name@example.com"
								type="email"
								name="email"
								onChange={handleFormChange}
								value={formData.email}
								autoCapitalize="none"
								autoComplete="email"
								autoCorrect="off"
								disabled={isLoading}
								required
								className="bg-[#428ed66c] input-phone text-white placeholder-gray-400"
							/>
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="password" className="text-gray-300">
									Password
								</Label>
								<Link
									href="/forgot-password"
									className="text-sm text-[#a5c9ec] hover:text-teal-300"
								>
									Forgot password?
								</Link>
							</div>
							<Input
								id="password"
								placeholder="Your password"
								type="password"
								name="password"
								onChange={handleFormChange}
								value={formData.password}
								autoCapitalize="none"
								autoComplete="current-password"
								autoCorrect="off"
								disabled={isLoading}
								required
								className="bg-[#428ed66c] input-phone text-white placeholder-gray-400"
							/>
						</div>
						<Button
							type="submit"
							className="w-full bg-[#205c99] hover:bg-[#205c9971] text-white"
							disabled={isLoading}
						>
							{isLoading ? (
								<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
							) : (
								"Sign In"
							)}
						</Button>
					</motion.form>
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-gray-600" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-[#2272bd] px-2 text-gray-400">
								Or continue with
							</span>
						</div>
					</div>

					<div className="space-y-3">
						<Button
							variant="outline"
							type="button"
							className="w-full bg-[#428ED6] text-white border-white hover:bg-[#3190e95d] hover:text-white"
							disabled={isLoading}
							onClick={() => toast.error("GitHub login not implemented yet")}
						>
							{isLoading ? (
								<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<Icons.gitHub className="mr-2 h-4 w-4" />
							)}
							GitHub
						</Button>

						<Button
							variant="outline"
							type="button"
							className="w-full bg-[#428ED6] text-white border-white hover:bg-[#3190e95d] hover:text-white"
							disabled={isLoading}
							onClick={() => toast.error("Google login not implemented yet")}
						>
							{isLoading ? (
								<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<Icons.google className="mr-2 h-4 w-4" />
							)}
							Google
						</Button>
					</div>

					<motion.div
						animate={controls}
						className="text-center text-sm text-white"
					>
						Don&apos;t have an account?{" "}
						<Link
							href="/signup"
							className="text-[#a5c9ec] underline underline-offset-4 hover:text-teal-300"
						>
							Create a new account
						</Link>
					</motion.div>
				</div>
			</main>
			<Toaster
				position="top-center"
				reverseOrder={false}
				toastOptions={{
					duration: 3000,
					// style: {
					// 	background: "bg-primary-blue",
					// },
				}}
			/>
		</div>
	);
}
