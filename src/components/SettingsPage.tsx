"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { useUser } from "@/app/context/UserContext";
import { toast, Toaster } from "react-hot-toast";

const SettingsPage = () => {
    const { userData, updateUserData, refreshUserData } = useUser();
    const router = useRouter();
    const [name, setName] = useState("");
    const [isUpdatingName, setIsUpdatingName] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (userData) {
            setName(userData.fullName || "");
            setPreviewImage(userData.profileImage || null);
        }
    }, [userData]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleUpdateName = async () => {
        if (!userData?._id || !name) return;

        setIsUpdatingName(true);

        try {
            const response = await fetch("/api/users/update-name", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userData._id,
                    fullName: name,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Name updated successfully");
                // Update user data in context
                if (updateUserData && userData) {
                    updateUserData({
                        ...userData,
                        fullName: name,
                    });
                }
            } else {
                toast.error(data.error || "Failed to update name");
            }
        } catch (error) {
            console.error("Error updating name:", error);
            toast.error("An error occurred while updating name");
        } finally {
            setIsUpdatingName(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast.error("Image size should not exceed 5MB");
            return;
        }

        // Check file type
        const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        if (!validTypes.includes(file.type)) {
            toast.error(
                "Invalid file type. Only JPEG, PNG, and WebP images are allowed."
            );
            return;
        }

        // Preview the selected image
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
        toast.success("Image selected. Click 'Update Profile Picture' to save.");
    };

    const handleUpdateProfilePicture = async () => {
        if (!userData?._id) return;

        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            toast.error("Please select an image to upload");
            return;
        }

        setIsUploadingImage(true);

        try {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("userId", userData._id);

            console.log("Uploading image for user:", userData._id);

            const response = await fetch("/api/users/profile-image", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log("Upload response:", data);

            if (response.ok) {
                toast.success("Profile picture updated successfully");
                // Update user data in context
                if (updateUserData && userData) {
                    const updatedUserData = {
                        ...userData,
                        profileImage: data.imageUrl,
                    };
                    console.log("Updating user data with new image:", updatedUserData);
                    updateUserData(updatedUserData);
                } else {
                    console.warn(
                        "updateUserData function not available or userData is null"
                    );
                }

                // Force a refresh of user data
                await refreshUserData();
            } else {
                toast.error(data.error || "Failed to update profile picture");
            }
        } catch (error) {
            console.error("Error updating profile picture:", error);
            toast.error("An error occurred while updating profile picture");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleResetImage = () => {
        setPreviewImage(userData?.profileImage || null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        toast.success("Image selection reset");
    };

    return (
        <div className="container py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Manage your account settings.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={handleNameChange}
                            placeholder="Your Name"
                        />
                        <Button
                            onClick={handleUpdateName}
                            disabled={isUpdatingName || !name || name === userData?.fullName}
                            className="bg-[#116aef] hover:bg-[#0f5ed8]"
                        >
                            {isUpdatingName ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Name"
                            )}
                        </Button>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="picture">Profile Picture</Label>
                        <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto">
                            {previewImage ? (
                                <Image
                                    src={previewImage || "/placeholder.svg"}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                    onError={() => {
                                        setPreviewImage("/placeholder.svg?height=128&width=128");
                                        toast.error("Failed to load image preview");
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <div className="flex flex-col items-center">
                                        <Camera className="w-8 h-8 text-gray-400" />
                                        <span className="text-xs text-gray-400 mt-1">Upload</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <Input
                            type="file"
                            id="picture"
                            className="hidden"
                            onChange={handleImageChange}
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            ref={fileInputRef}
                        />
                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                            <Button
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full sm:w-auto"
                            >
                                Select Image
                            </Button>
                            <Button
                                onClick={handleUpdateProfilePicture}
                                disabled={
                                    isUploadingImage || !fileInputRef.current?.files?.length
                                }
                                className="w-full sm:w-auto bg-[#116aef] hover:bg-[#0f5ed8]"
                            >
                                {isUploadingImage ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    "Update Profile Picture"
                                )}
                            </Button>
                            {previewImage && previewImage !== userData?.profileImage && (
                                <Button
                                    onClick={handleResetImage}
                                    variant="destructive"
                                    className="w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Toaster position="top-right" />
        </div>
    );
};

export default SettingsPage;
