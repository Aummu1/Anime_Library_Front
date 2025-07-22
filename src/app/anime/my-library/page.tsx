"use client";
import React, { useEffect, useState } from "react";
import Search from "@/components/Search";
import NeonBadge from "@/components/Menu";
import Card from "@/components/Card";
import axios from "axios";

interface AnimePost {
  id: number;
  animeName: string;
  description: string;
  category: string;
  status: string;
  imageBase64: string;
}

const categoryColors: Record<string, "blue" | "purple" | "pink" | "green" | "orange" | "red"> = {
  Action: "blue",
  Adventure: "purple",
  Detective: "pink",
  Drama: "green",
  Fantasy: "orange",
  Game: "red",
  Gourmet: "blue",
  Hentai: "purple",
  Historical: "pink",
  Horror: "green",
  Isekai: "orange",
  Magic: "red",
  Medical: "blue",
  Music: "purple",
  Psychological: "pink",
  Racing: "green",
  Reincarnation: "orange",
  Romance: "red",
  "Sci-Fi": "blue",
  "Slice of Life": "purple",
  Sports: "pink",
};

const statusOrder = ["Watching", "Planned", "Watched"];

export default function MyLibrary() {
  const [posts, setPosts] = useState<AnimePost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5145/api/Anime");
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching anime:", err);
      }
    };

    fetchPosts();
  }, []);

  // 🔍 กรองโพสต์ตาม category ที่เลือก
  const filterByCategory = (list: AnimePost[]) => {
    if (!selectedCategory) return list;
    return list.filter((post) =>
      post.category.split(",").map((c) => c.trim()).includes(selectedCategory)
    );
  };

  // 🔥 แยกตาม status แล้วกรอง category
  const postsByStatus: Record<string, AnimePost[]> = {
    Watching: filterByCategory(posts).filter((p) => p.status === "Watching"),
    Planned: filterByCategory(posts).filter((p) => p.status === "Planned"),
    Watched: filterByCategory(posts).filter((p) => p.status === "Watched"),
  };

  return (
    <div className="w-full max-h-full items-center flex px-4 flex-col">
      <div className="w-full max-w-[1000px] flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-4">
          <Search />
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          {Object.keys(categoryColors).map((cat) => (
            <NeonBadge
              key={cat}
              color={categoryColors[cat]}
              onClick={() => setSelectedCategory((prev) => (prev === cat ? null : cat))}
              className={selectedCategory === cat ? "ring-2 ring-white" : ""}
            >
              {cat}
            </NeonBadge>
          ))}
        </div>
      </div>

      {/* 🧠 แสดงเฉพาะ status ที่มีโพสต์ */}
      {statusOrder.map((status) => {
        const posts = postsByStatus[status];
        if (posts.length === 0) return null;

        return (
          <section key={status} className="py-4">
            <h1 className="mb-4 text-start pl-5 font-sans text-xl font-bold">{status} ({posts.length})</h1>
            <div className="mx-auto grid max-w-screen-lg grid-cols-1 gap-5 p-5 sm:grid-cols-2 md:grid-cols-3 lg:gap-10">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  id={post.id}
                  imageUrl={post.imageBase64}
                  category={post.category}
                  title={post.animeName}
                  description={post.description}
                  tags={[post.status]}
                  onDelete={(deletedId) =>
                    setPosts((prev) => prev.filter((p) => p.id !== deletedId))
                  }
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
