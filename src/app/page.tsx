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
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleAddClick}
          className="sm:w-16 sm:h-16 w-12 h-12"
        >
          <AddIcon className="sm:text-[32px] text-[24px]" />
        </Fab>
      </div>
    </div>
  );
}
