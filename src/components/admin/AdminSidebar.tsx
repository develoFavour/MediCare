"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
} from "@/components/ui/sidebar";
import {
	Activity,
	Calendar,
	LayoutDashboard,
	LogOut,
	Menu,
	Settings,
	Stethoscope,
	Users,
	BarChart3,
	BedDouble,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export function AdminSidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const [open, setOpen] = useState(false);

	const handleLogout = async () => {
		try {
			toast.loading("Logging out...");
			const response = await fetch("/api/users/logout", {
				method: "GET",
				credentials: "include",
			});

			if (response.ok) {
				toast.dismiss();
				toast.success("Logged out successfully");
				window.location.href = "/login";
			} else {
				toast.dismiss();
				toast.error("Logout failed");
			}
		} catch (error) {
			console.error("Logout error:", error);
			toast.dismiss();
			toast.error("An error occurred during logout");
		}
	};

	const isActive = (path: string) =>
		pathname === path || pathname.startsWith(path);

	return (
		<>
			{/* Mobile Sidebar */}
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden fixed top-4 left-4 z-40"
					>
						<Menu className="h-5 w-5" />
						<span className="sr-only">Toggle Menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="p-0 w-64">
					<MobileSidebarContent
						closeSheet={() => setOpen(false)}
						onLogout={handleLogout}
					/>
				</SheetContent>
			</Sheet>

			{/* Desktop Sidebar */}
			<SidebarProvider defaultOpen={true}>
				<Sidebar className="hidden md:flex border-r bg-white">
					<SidebarHeader className="border-b p-4">
						<Link href="/admin/dashboard" className="flex items-center gap-2">
							<div className="bg-primary rounded-md p-1">
								<Activity className="h-6 w-6 text-white" />
							</div>
							<span className="font-bold text-xl text-primary">MediCare</span>
						</Link>
					</SidebarHeader>
					<SidebarContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={isActive("/admin/dashboard")}
								>
									<Link href="/admin/dashboard">
										<LayoutDashboard className="h-5 w-5" />
										<span>Dashboard</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={isActive("/admin/dashboard/appointments")}
								>
									<Link href="/admin/dashboard/appointments">
										<Calendar className="h-5 w-5" />
										<span>Appointments</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={isActive("/admin/dashboard/doctors")}
								>
									<Link href="/admin/dashboard/doctors">
										<Stethoscope className="h-5 w-5" />
										<span>Doctors</span>
									</Link>
								</SidebarMenuButton>
								<SidebarMenuSub>
									<SidebarMenuSubItem>
										<SidebarMenuSubButton
											asChild
											isActive={isActive("/admin/dashboard/doctors/add-doctor")}
										>
											<Link href="/admin/dashboard/doctors/add-doctor">
												Add Doctor
											</Link>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
									<SidebarMenuSubItem>
										<SidebarMenuSubButton
											asChild
											isActive={isActive("/admin/dashboard/doctors/list")}
										>
											<Link href="/admin/dashboard/doctors/list">
												Doctors List
											</Link>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
								</SidebarMenuSub>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={isActive("/admin/dashboard/patients")}
								>
									<Link href="/admin/dashboard/patients">
										<Users className="h-5 w-5" />
										<span>Patients</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={isActive("/admin/dashboard/rooms")}
								>
									<Link href="/admin/dashboard/rooms">
										<BedDouble className="h-5 w-5" />
										<span>Rooms</span>
									</Link>
								</SidebarMenuButton>
								<SidebarMenuSub>
									<SidebarMenuSubItem>
										<SidebarMenuSubButton
											asChild
											isActive={isActive("/admin/dashboard/rooms/alloted")}
										>
											<Link href="/admin/dashboard/rooms/alloted">
												Alloted Rooms
											</Link>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
									<SidebarMenuSubItem>
										<SidebarMenuSubButton
											asChild
											isActive={isActive("/admin/dashboard/rooms/available")}
										>
											<Link href="/admin/dashboard/rooms/available">
												Available Rooms
											</Link>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
								</SidebarMenuSub>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={isActive("/admin/dashboard/reports")}
								>
									<Link href="/admin/dashboard/reports">
										<BarChart3 className="h-5 w-5" />
										<span>Reports</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={isActive("/admin/dashboard/settings")}
								>
									<Link href="/admin/dashboard/settings">
										<Settings className="h-5 w-5" />
										<span>Settings</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarContent>
					<SidebarFooter className="border-t p-4">
						<Button
							variant="ghost"
							className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
							onClick={handleLogout}
						>
							<LogOut className="mr-2 h-5 w-5" />
							Sign Out
						</Button>
					</SidebarFooter>
				</Sidebar>
			</SidebarProvider>
		</>
	);
}

function MobileSidebarContent({
	closeSheet,
	onLogout,
}: {
	closeSheet: () => void;
	onLogout: () => void;
}) {
	const pathname = usePathname();

	const isActive = (path: string) =>
		pathname === path || pathname.startsWith(path);

	return (
		<div className="flex h-full flex-col bg-white">
			<div className="border-b p-4">
				<Link
					href="/admin/dashboard"
					className="flex items-center gap-2"
					onClick={closeSheet}
				>
					<div className="bg-primary rounded-md p-1">
						<Activity className="h-6 w-6 text-white" />
					</div>
					<span className="font-bold text-xl text-primary">MediCare</span>
				</Link>
			</div>
			<ScrollArea className="flex-1 p-3">
				<nav className="space-y-1">
					<NavItem
						href="/admin/dashboard"
						icon={LayoutDashboard}
						label="Dashboard"
						active={isActive("/admin/dashboard") && !pathname.includes("/")}
						onClick={closeSheet}
					/>
					<NavItem
						href="/admin/dashboard/appointments"
						icon={Calendar}
						label="Appointments"
						active={isActive("/admin/dashboard/appointments")}
						onClick={closeSheet}
					/>
					<NavItem
						href="/admin/dashboard/doctors"
						icon={Stethoscope}
						label="Doctors"
						active={isActive("/admin/dashboard/doctors")}
						onClick={closeSheet}
					/>
					<div className="pl-9 space-y-1 mt-1">
						<NavItem
							href="/admin/dashboard/doctors/add-doctor"
							label="Add Doctor"
							active={isActive("/admin/dashboard/doctors/add-doctor")}
							onClick={closeSheet}
							subItem
						/>
						<NavItem
							href="/admin/dashboard/doctors/list"
							label="Doctors List"
							active={isActive("/admin/dashboard/doctors/list")}
							onClick={closeSheet}
							subItem
						/>
					</div>
					<NavItem
						href="/admin/dashboard/patients"
						icon={Users}
						label="Patients"
						active={isActive("/admin/dashboard/patients")}
						onClick={closeSheet}
					/>
					<NavItem
						href="/admin/dashboard/rooms"
						icon={BedDouble}
						label="Rooms"
						active={isActive("/admin/dashboard/rooms")}
						onClick={closeSheet}
					/>
					<div className="pl-9 space-y-1 mt-1">
						<NavItem
							href="/admin/dashboard/rooms/alloted"
							label="Alloted Rooms"
							active={isActive("/admin/dashboard/rooms/alloted")}
							onClick={closeSheet}
							subItem
						/>
						<NavItem
							href="/admin/dashboard/rooms/available"
							label="Available Rooms"
							active={isActive("/admin/dashboard/rooms/available")}
							onClick={closeSheet}
							subItem
						/>
					</div>
					<NavItem
						href="/admin/dashboard/reports"
						icon={BarChart3}
						label="Reports"
						active={isActive("/admin/dashboard/reports")}
						onClick={closeSheet}
					/>
					<NavItem
						href="/admin/dashboard/settings"
						icon={Settings}
						label="Settings"
						active={isActive("/admin/dashboard/settings")}
						onClick={closeSheet}
					/>
				</nav>
			</ScrollArea>
			<div className="border-t p-4">
				<Button
					variant="ghost"
					className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
					onClick={() => {
						closeSheet();
						onLogout();
					}}
				>
					<LogOut className="mr-2 h-5 w-5" />
					Sign Out
				</Button>
			</div>
		</div>
	);
}

interface NavItemProps {
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
	label: string;
	active?: boolean;
	onClick?: () => void;
	subItem?: boolean;
}

function NavItem({
	href,
	icon: Icon,
	label,
	active,
	onClick,
	subItem,
}: NavItemProps) {
	return (
		<Link
			href={href}
			className={cn(
				"flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
				active
					? "bg-primary/10 text-primary"
					: "text-gray-700 hover:bg-gray-100",
				subItem && "pl-4 text-xs"
			)}
			onClick={onClick}
		>
			{Icon && (
				<Icon
					className={cn(
						"mr-3 h-5 w-5",
						active ? "text-primary" : "text-gray-500"
					)}
				/>
			)}
			{label}
		</Link>
	);
}
