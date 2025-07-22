"use client"
import React, { useEffect, useState } from 'react';
import Search from "@/components/Search";
import NeonBadge from '@/components/Menu';
import AuroraText from '@/components/AuroraText';
import Card from '@/components/Card';
import axios from 'axios';

interface AnimePost {
  id: number;
  animeName: string;
  description: string;
  category: string;
  status: string;
  imageBase64: string;
  // onDelete?: (id: number) => void; // ✅ เพิ่ม onDelete
}

export default function MyLibrary() {
  const [posts, setPosts] = useState<AnimePost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5145/api/Anime');
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching anime:", err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="w-full max-h-full items-center flex px-4 flex-col">
      <div className="w-full max-w-[1000px] flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-4">
          <Search />
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <NeonBadge color="blue">Neon Blue</NeonBadge>
          <NeonBadge color="purple">Neon Purple</NeonBadge>
          <NeonBadge color="pink">Neon Pink</NeonBadge>
          <NeonBadge color="green">Neon Green</NeonBadge>
          <NeonBadge color="orange">Neon Orange</NeonBadge>
          <NeonBadge color="red">Neon Red</NeonBadge>
        </div>
      </div>
      <section className="py-20">
        <h1 className="mb-12 text-start pl-5 font-sans text-xl font-bold">Planned</h1>
        <div className="mx-auto grid max-w-screen-lg grid-cols-1 gap-5 p-5 sm:grid-cols-2 md:grid-cols-3 lg:gap-10">
          {posts.map((post, index) => (
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
    </div>
  );
}
