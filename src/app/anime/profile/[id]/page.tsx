"use client";
import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import { useRouter } from "next/navigation";
import axios from "axios";

interface AnimePost {
    id: number;
    animeName: string;
    description: string;
    category: string;
    status: string;
    imageBase64: string;
    favorite: boolean;
    userId: number;
}

export default function ProfilePage() {
    const router = useRouter();
    const [posts, setPosts] = useState<AnimePost[]>([]);
    const [user, setUser] = useState<{ userId: number; username: string; email: string; imageBase64: string | null; } | null>(null);

    const [randomBg, setRandomBg] = useState("");

    useEffect(() => {
        const colors = [
            "from-pink-500 to-yellow-500",
            "from-green-400 to-blue-500",
            "from-purple-500 to-indigo-500",
            "from-orange-400 to-red-500",
        ];
        const picked = colors[Math.floor(Math.random() * colors.length)];
        setRandomBg(picked);
    }, []);

    // ✅ ดึง user จาก localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser({
                userId: parsed.userId,
                username: parsed.username,
                email: parsed.email,
                imageBase64: parsed.imageBase64 || null,
            });
        }
    }, []);

    // ✅ ดึงข้อมูล anime ที่กด favorite จาก API
    useEffect(() => {
        const fetchFavoriteAnime = async () => {
            if (!user?.userId) return;

            try {
                const res = await axios.get(`http://localhost:5145/api/Anime/user/${user.userId}`);
                setPosts(res.data);
            } catch (error) {
                console.error("Failed to fetch favorite anime:", error);
            }
        };

        fetchFavoriteAnime();
    }, [user]);

    // ✅ เพิ่มก่อน return
    const postsByStatus: Record<string, AnimePost[]> = {
        Watching: posts.filter((p) => p.status === "Watching"),
        Planned: posts.filter((p) => p.status === "Planned"),
        Watched: posts.filter((p) => p.status === "Watched"),
    };

    // fallback initials
    const initials = user?.username
        ? user.username.split(' ')[0]?.charAt(0).toUpperCase()
        : 'U';

    return (
        <div className="">
            <div className="max-w-2xl mx-4 sm:max-w-xl md:max-w-xl lg:max-w-2xl xl:max-w-3xl sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900">
                <div className={`rounded-t-lg h-32 overflow-hidden bg-gradient-to-r ${randomBg}`} />
                <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-md">
                    {user?.imageBase64 ? (
                        <img
                            src={user.imageBase64}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {initials}
                        </div>
                    )}
                </div>

                {/* <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-md">
                    {user?.username
                        ? user.username
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        : "??"}
                </div> */}
                <div className="text-center mt-2">
                    <h2 className="font-semibold text-lg text-black">
                        {user?.username || "Guest"}
                    </h2>
                    <p className="text-gray-500 text-sm">{user?.email || "Not logged in"}</p>
                </div>
                <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
                    <li className="flex flex-col items-center justify-around">
                        <h2 className="text-xl font-bold text-black">Planned</h2>
                        <div className="text-2xl font-bold text-black">({postsByStatus["Planned"].length})</div>
                    </li>
                    <li className="flex flex-col items-center justify-around">
                        <h2 className="text-xl font-bold text-black">Watching</h2>
                        <div className="text-2xl font-bold text-black">({postsByStatus["Watching"].length})</div>
                    </li>
                    <li className="flex flex-col items-center justify-around">
                        <h2 className="text-xl font-bold text-black">Watched</h2>
                        <div className="text-2xl font-bold text-black">({postsByStatus["Watched"].length})</div>
                    </li>
                </ul>
                <div className="p-4 border-t mx-8 mt-2">
                    <button className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2">
                        Follow
                    </button>
                </div>
            </div>

            <section className="py-6">
                <h1 className="mb-4 text-start pl-5 font-sans text-xl font-bold">
                    Favorites ({posts.filter((p) => p.favorite).length})
                </h1>
                <div className=" grid max-w-screen-lg grid-cols-1 gap-5 p-5 sm:grid-cols-2 md:grid-cols-3 lg:gap-10">
                    {posts
                        .filter((post) => post.favorite)
                        .map((post) => (
                            <Card
                                key={post.id}
                                id={post.id}
                                imageUrl={post.imageBase64}
                                category={post.category}
                                title={post.animeName}
                                description={post.description}
                                tags={[post.status]}
                                favorite={post.favorite}
                                onDelete={(deletedId) =>
                                    setPosts((prev) => prev.filter((p) => p.id !== deletedId))
                                }
                                onUnlike={(unlikedId) =>
                                    setPosts((prev) => prev.filter((p) => p.id !== unlikedId))
                                }
                                onClick={() => router.push(`/anime/animeinfo/${post.id}`)}
                            />
                        ))}
                </div>
            </section>
        </div>
    );
}
