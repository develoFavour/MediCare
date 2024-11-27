export const fetchUserData = async () => {
	try {
		const response = await fetch("/api/users/profile", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			if (response.status === 401) {
				// Token has expired, try to refresh
				const refreshResponse = await fetch("/api/auth/refresh", {
					method: "POST",
					credentials: "include",
				});

				if (refreshResponse.ok) {
					// Retry the original request
					const retryResponse = await fetch("/api/users/profile", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
					});

					if (retryResponse.ok) {
						return await retryResponse.json();
					}
				}
			}
			throw new Error("Failed to fetch user data");
		}

		return await response.json();
	} catch (error: any) {
		console.error("Error fetching user data:", error);
		throw new Error("Session expired. Please log in again.");
	}
};
