"use client";
import React, { useEffect } from "react";
import MyLibrary from "@/app/anime/my-library/page";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleAddClick = () => {
    router.push("/anime/add");
  };

  // ✅ ดักเช็ค token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // 🔒 redirect ถ้าไม่มี token
      router.push("/signin");
    }
  }, [router]);

  return (
    <div className="">
      <MyLibrary />

      {/* ✅ ปุ่ม + ลอยอยู่ขวาล่าง */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* <Fab
          color="primary"
          aria-label="add"
          onClick={handleAddClick}
          className="sm:w-16 sm:h-16 w-12 h-12"
        >
          <AddIcon className="sm:text-[32px] text-[24px]" />
        </Fab> */}

        <button
          title="Add New"
          onClick={handleAddClick}
          className="group cursor-pointer outline-none hover:rotate-90 duration-300 sm:text-[32px] text-[24px]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50px"
            height="50px"
            viewBox="0 0 24 24"
            className="stroke-purple-400 fill-none group-hover:fill-purple-800 group-active:stroke-purple-200 group-active:fill-purple-600 group-active:duration-0 duration-300"
          >
            <path
              d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
              strokeWidth="1.5"
            />
            <path d="M8 12H16" strokeWidth="1.5" />
            <path d="M12 16V8" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
