import React, { useState } from "react";
import AuroraText from "./AuroraText";
import NeonBadge from "./Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";

const categoryColors: Record<string, "blue" | "purple" | "pink" | "green" | "orange" | "red"> = {
  Action: "blue",
  Adventure: "purple",
  Comedy: "red",
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

interface PostCardProps {
  id: number; // ✅ เพิ่ม id
  imageUrl: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  onDelete?: (deletedId: number) => void; // ✅ เพิ่มตรงนี้
  onClick?: () => void;
}

const Card: React.FC<PostCardProps> = ({
  id,
  imageUrl,
  category,
  title,
  description,
  tags,
  onDelete,
  onClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // ป้องกันลิงก์คลิก
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // ป้องกันการกระจายของ event
    handleClose();
    router.push(`/anime/edit/${id}`);
    console.log("Edit clicked");
  };

  const handleDelete = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // ป้องกันการกระจายเหตุการณ์ที่ทำให้เกิดการคลิกที่อื่น
    handleClose();

    const confirmed = confirm("Are you sure you want to delete this anime?");
    if (!confirmed) {
      router.push("/"); // ไปหน้า "/" เมื่อกด Cancel
      return;
    }

    try {
      await axios.delete(`http://localhost:5145/api/Anime/${id}`);
      alert("✅ Deleted successfully!");
      router.push(`/`); // หลังจากลบเสร็จไปหน้าแรก

    } catch (err) {
      console.error("❌ Error deleting anime:", err);
      alert("Error deleting anime.");
    }
  };

  return (
    <article onClick={onClick} className="w-full max-w-[360px] h-[500px] col-span-1 m-auto cursor-pointer overflow-hidden rounded-lg shadow-lg bg-black">

      {/* รูปภาพ สูง 50% */}
      <div className="relative h-[50%] overflow-hidden">
        {imageUrl ? (
          <img
            src={
              imageUrl.startsWith("data:image")
                ? imageUrl
                : `data:image/png;base64,${imageUrl}`
            }
            alt="featured image"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-sm">
            No image available
          </div>
        )}

        {/* จุดสามจุดมุมขวาล่าง */}
        <div className="absolute bottom-2 right-2 z-10">
          <IconButton onClick={handleMenuClick} size="small" className="bg-black/60">
            <MoreVertIcon className="text-white" fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            transformOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
        </div>
      </div>

      {/* เนื้อหา */}
      <div className="h-[50%] p-4 flex flex-col justify-between">
        <div>
          {/* ✅ แก้ตรงนี้: แสดง tag แรก (ถ้ามี) */}
          <p className="text-sm font-medium text-red-500">{tags[0]}</p>
          <AuroraText className="line-clamp-2">{title}</AuroraText>
          <p className="text-sm font-medium text-white line-clamp-2">{description}</p>
        </div>

        {/* ✅ แสดง category เป็น badge เดียว และใช้ tags.map */}
        <div className="mt-4 flex flex-wrap items-center">
          {category.split(",").map((cat) => {
            const trimmedCat = cat.trim();
            const color = categoryColors[trimmedCat] || "blue"; // fallback เผื่อไม่ match
            return (
              <NeonBadge
                key={trimmedCat}
                color={color}
                className="mr-2 mt-1 rounded-2xl py-1.5 px-4 text-xs"
              >
                {trimmedCat}
              </NeonBadge>
            );
          })}
        </div>
      </div>
    </article>
  );
};

export default Card;
