"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const [user, setUser] = useState<{ userId: number; username: string; email: string; imageBase64?: string | null } | null>(null);
    const [username, setUsername] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setUsername(parsed.username);
            setImagePreview(parsed.imageBase64 || null);
        }
    }, []);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!user) return;

        const payload: any = {};
        if (username !== user.username) payload.username = username;
        if (imagePreview && imagePreview !== user.imageBase64) payload.imageBase64 = imagePreview;

        try {
            await axios.patch(`http://localhost:5145/api/User/${user.userId}`, payload);

            const updatedUser = { ...user, ...payload };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            alert("Saved successfully!");
            router.push("/");
            router.refresh();
        } catch (err) {
            console.error("Failed to save:", err);
            alert("Save failed");
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl text-gray-900">
            <h1 className="text-2xl font-bold mb-6 text-center">Profile Settings</h1>

            {/* รูปโปรไฟล์ */}
            <div className="flex justify-center mb-6">
                <label className="cursor-pointer relative w-32 h-32">
                    {imagePreview ? (
                        <img
                            src={imagePreview}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 shadow"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-4xl font-bold shadow">
                            {username.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition">
                        <span className="text-white text-sm">Change</span>
                    </div>
                </label>
            </div>

            {/* Username */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {/* Email */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email (read-only)</label>
                <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600"
                />
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
            >
                Save Changes
            </button>
        </div>
    );
}
