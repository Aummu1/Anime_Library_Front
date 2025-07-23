"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function AnimeDetailPage() {
  const { id } = useParams();
  const [anime, setAnime] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAnime = async () => {
      try {
        const res = await axios.get(`http://localhost:5145/api/Anime/${id}`);
        setAnime(res.data);
      } catch (err) {
        console.error("Failed to fetch anime data:", err);
      }
    };

    fetchAnime();
  }, [id]);

  const getImageSrc = (base64: string | undefined) => {
    if (!base64) return "https://via.placeholder.com/128";
    if (base64.startsWith("data:image")) return base64;
    return `data:image/png;base64,${base64}`;
  };

  if (!anime) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#141414] overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">

        <main className="px-40 py-5 flex-1">
          <div className="max-w-[960px] mx-auto">
            <div className="flex gap-2 text-[#ababab] p-4">
              <a href="/">Anime</a>
              <span>/</span>
              <span className="text-white">{anime.animeName}</span>
            </div>

            <section className="p-4 flex gap-4 items-start">
              <div
                className="w-98 mr-4 mb-4 min-h-58 bg-cover bg-center rounded-xl"
                style={{ backgroundImage: `url(${getImageSrc(anime.imageBase64)})` }}
              ></div>
              <div>
                <h1 className="text-[22px] font-bold text-white">{anime.animeName}</h1>
                <p className="text-[#ababab]">{anime.category}</p>
              </div>
            </section>

            <p className="text-white px-4 pb-3 pt-1">{anime.description}</p>

            <section className="px-4 pt-5">
              <h2 className="text-[22px] font-bold text-white pb-3">User Ratings</h2>
              <div className="flex flex-wrap gap-x-8 gap-y-6">
                {/* <div>
                  <p className="text-4xl font-black text-white">{anime.rating ?? "4.8"}</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d={
                            i < Math.floor(anime.rating ?? 4.8)
                              ? "M234.5,114.38l-45.1,39.36..." // filled star
                              : "M239.2,97.29a16,16..." // outline star
                          }
                        />
                      </svg>
                    ))}
                  </div>
                  <p className="text-white text-sm">{anime.reviewCount ?? "12,345"} reviews</p>
                </div> */}

                <div className="grid min-w-[200px] max-w-[400px] grid-cols-[20px_1fr_40px] gap-y-3">
                  {[5, 4, 3, 2, 1].map((score, i) => {
                    const percent = anime.ratingDistribution?.[score] ?? [40, 30, 15, 10, 5][i];
                    return (
                      <React.Fragment key={score}>
                        <p className="text-white text-sm">{score}</p>
                        <div className="flex h-2 bg-[#474747] overflow-hidden rounded-full">
                          <div className="bg-white rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                        <p className="text-sm text-right text-[#ababab]">{percent}%</p>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
