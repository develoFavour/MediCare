import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
	return (
		<div className="py-6 bg-gray-50 min-h-screen">
			{/* Header Skeleton */}
			<div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
				<div>
					<Skeleton className="h-8 w-64 mb-2" />
					<Skeleton className="h-4 w-40" />
				</div>
				<div className="flex items-center space-x-4">
					<Skeleton className="h-10 w-64 hidden md:block" />
					<Skeleton className="h-10 w-10 rounded-full" />
					<Skeleton className="h-10 w-10 rounded-full" />
				</div>
			</div>

			{/* Content Skeleton */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
				<div className="lg:col-span-2 space-y-6">
					{/* Appointments Overview Skeleton */}
					<Skeleton className="h-[200px] w-full rounded-lg" />

					{/* Upcoming Appointments Skeleton */}
					<Skeleton className="h-[300px] w-full rounded-lg" />

					{/* Recent Activities Skeleton */}
					<Skeleton className="h-[300px] w-full rounded-lg" />
				</div>

				<div className="space-y-6">
					{/* Quick Actions Skeleton */}
					<Skeleton className="h-[200px] w-full rounded-lg" />

					{/* Patient Statistics Skeleton */}
					<Skeleton className="h-[300px] w-full rounded-lg" />

					{/* Performance Metrics Skeleton */}
					<Skeleton className="h-[300px] w-full rounded-lg" />
				</div>
			</div>
		</div>
	);
}
