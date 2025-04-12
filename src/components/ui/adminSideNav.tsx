"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	type LucideIcon,
	ChevronDown,
	ChevronUp,
	Home,
	User,
	Users,
	PlusCircle,
	BedDouble,
	ClipboardList,
	DoorOpen,
	Settings,
	ClipboardCheck,
	Menu,
	MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/app/context/UserContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavigationItem {
	href: string;
	icon: LucideIcon;
	label: string;
	subItems?: NavigationItem[];
}

// Define adminNavItems here if it's not imported
const adminNavItems: NavigationItem[] = [
	{ href: "/admin/dashboard", icon: Home, label: "Home" },
	{ href: "/admin/dashboard/messages", icon: MessageCircle, label: "Messages" },
	{
		href: "/admin/dashboard/appointment-request",
		icon: ClipboardCheck,
		label: "Appointment Request",
	},
	{
		href: "/admin/doctors",
		icon: User,
		label: "Doctors",
		subItems: [
			{
				href: "/admin/dashboard/doctors",
				icon: ClipboardList,
				label: "Doctors List",
			},
			{
				href: "/admin/dashboard/add-doctor",
				icon: PlusCircle,
				label: "Add Doctor",
			},
		],
	},
	{
		href: "/admin/patients",
		icon: Users,
		label: "Patients",
		subItems: [
			{
				href: "/admin/dashboard/patients",
				icon: ClipboardList,
				label: "Patients List",
			},
		],
	},
	{
		href: "/admin/dashboard/",
		icon: BedDouble,
		label: "Rooms",
		subItems: [
			{
				href: "/admin/dashboard/",
				icon: ClipboardList,
				label: "Rooms Alloted",
			},
			{
				href: "/admin/dashboard/",
				icon: DoorOpen,
				label: "Available Rooms",
			},
		],
	},
	{ href: "/admin/dashboard/settings", icon: Settings, label: "Settings" },
];

const AdminSideNav = () => {
	const { userData, refreshUserData } = useUser();
	const pathname = usePathname();
	const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
	const [profileImageKey, setProfileImageKey] = useState(Date.now());
	const [imageError, setImageError] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		// Force refresh the profile image when userData changes
		if (userData?.profileImage) {
			console.log(
				"Updating profile image in AdminSideNav:",
				userData.profileImage
			);
			setProfileImageKey(Date.now());
			setImageError(false);
		}
	}, [userData?.profileImage]);

	// Refresh user data periodically to ensure we have the latest profile image
	useEffect(() => {
		const refreshInterval = setInterval(() => {
			if (imageError) {
				console.log("Image error detected, refreshing user data");
				refreshUserData();
			}
		}, 5000);

		return () => clearInterval(refreshInterval);
	}, [imageError, refreshUserData]);

	const toggleDropdown = (label: string) => {
		setOpenDropdowns((prev) =>
			prev.includes(label)
				? prev.filter((item) => item !== label)
				: [...prev, label]
		);
	};

	// Function to get user initials for the placeholder
	const getUserInitials = () => {
		if (!userData?.fullName) return "";
		const names = userData.fullName.split(" ");
		if (names.length >= 2) {
			return `${names[0][0]}${names[1][0]}`.toUpperCase();
		}
		return userData.fullName.substring(0, 2).toUpperCase();
	};

	// Add cache busting to profile image URL
	const getProfileImageUrl = () => {
		if (!userData?.profileImage) return null;
		// Split by ? to remove any existing query params, then add our timestamp
		return `${userData.profileImage.split("?")[0]}?t=${profileImageKey}`;
	};

	const renderNavItem = (item: NavigationItem, isSubItem = false) => {
		const Icon = item.icon;
		const isActive = pathname === item.href;
		const hasSubItems = item.subItems && item.subItems.length > 0;
		const isOpen = openDropdowns.includes(item.label);

		return (
			<li key={item.label} className={cn("", isActive ? "navlist-item" : "")}>
				<Link
					href={hasSubItems ? "#" : item.href}
					className={cn(
						"flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors navlist-hover",
						isActive
							? "text-[#116aef] bg-[#e9f2ff] hover:bg-[#e9f2ff]"
							: "hover:text-white nav-list-item",
						isSubItem && "pl-10"
					)}
					onClick={() => {
						if (hasSubItems) {
							toggleDropdown(item.label);
						} else {
							setIsMobileMenuOpen(false); // Close mobile menu when clicking a link
						}
					}}
				>
					<Icon
						className={cn(
							"h-8 w-8 p-[6px] rounded-[7px]",
							isActive ? "bg-[#116aef] text-white" : "hover:text-white"
						)}
					/>
					<span>{item.label}</span>
					{hasSubItems && (
						<span className="ml-auto">
							{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
						</span>
					)}
				</Link>
				{hasSubItems && isOpen && (
					<ul className="mt-2 space-y-1">
						{item.subItems!.map((subItem) => renderNavItem(subItem, true))}
					</ul>
				)}
			</li>
		);
	};

	// Content for the sidebar (used in both desktop and mobile)
	const sidebarContent = (
		<div className="space-y-4">
			<div className="px-3 border-b border-b-[#f1f1f1]">
				<div className="flex gap-2 items-center mb-4">
					{userData?.profileImage && !imageError ? (
						<div className="relative h-16 w-16 rounded-full overflow-hidden img-shadow">
							<Image
								key={profileImageKey}
								src={getProfileImageUrl() || "/placeholder.svg"}
								alt="user-avatar"
								width={64}
								height={64}
								className="object-cover h-full w-full"
								onError={() => {
									console.error("Failed to load profile image in AdminSideNav");
									setImageError(true);

									refreshUserData();
								}}
							/>
						</div>
					) : (
						<div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-xl img-shadow">
							{getUserInitials()}
						</div>
					)}
					<div>
						<p className="font-semibold text-lg text-gray-800">
							{userData?.fullName}
						</p>
						<span className="text-sm text-gray-600">{userData?.role}</span>
					</div>
				</div>
			</div>
			<ul className="space-y-1">
				{adminNavItems.map((item) => renderNavItem(item))}
			</ul>
		</div>
	);

	return (
		<>
			{/* Desktop Sidebar */}
			<nav className="dashboard-nav-bg fixed left-0 top-0 hidden md:flex h-screen w-[310px] flex-col justify-between border-r border-gray-200 pt-8 text-white sm:p-4 xl:py-6 xl:px-0 overflow-y-auto">
				{sidebarContent}
			</nav>

			{/* Mobile Menu Button - Fixed at the top */}
			<div className="fixed top-4 left-4 z-50 md:hidden">
				<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
					<SheetTrigger asChild>
						<Button variant="outline" size="icon" className="rounded-full">
							<Menu className="h-5 w-5" />
							<span className="sr-only">Toggle Menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="p-0 w-[280px] sm:w-[350px]">
						<div className="dashboard-nav-bg h-full overflow-y-auto py-6">
							{sidebarContent}
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</>
	);
};

export default AdminSideNav;
