"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function EditAnimePage() {
  const router = useRouter();
  const { id } = useParams();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    animeName: string;
    description: string;
    category: string;
    status: string;
    image: File | null;
  }>({
    animeName: "",
    description: "",
    category: "",
    status: "",
    image: null,
  });

  // ✅ โหลดข้อมูลตาม id จาก API
  useEffect(() => {
    if (!id) return;

    const fetchAnime = async () => {
      try {
        const res = await axios.get(`http://localhost:5145/api/Anime/${id}`);
        const data = res.data;

        setFormData({
          animeName: data.animeName,
          description: data.description,
          category: data.category,
          status: data.status,
          image: null,
        });

        // ถ้ามีรูปเก่าให้ preview
        if (data.imageBase64) {
          setImagePreview(`data:image/png;base64,${data.imageBase64}`);
        }
      } catch (err) {
        console.error("Error loading anime:", err);
      }
    };

    fetchAnime();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files && files[0]) {
      setFormData({ ...formData, image: files[0] });
      setImagePreview(URL.createObjectURL(files[0])); // preview ไฟล์ใหม่
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    data.append("AnimeName", formData.animeName);
    data.append("Description", formData.description);
    data.append("Category", formData.category);
    data.append("Status", formData.status);

    if (formData.image) {
      data.append("Image", formData.image);
    }

    try {
      await axios.put(`http://localhost:5145/api/Anime/${id}`, data, {
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      });
      for (let pair of data.entries()) {
        console.log(pair[0], pair[1]);
      }
      alert("✅ Anime updated successfully!");
      router.push("/");
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Error updating anime.");
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white font-['Plus Jakarta Sans','Noto Sans',sans-serif]">
      <main className="flex justify-center px-10 py-8">
        <div className="max-w-[960px] w-full">
          <h1 className="text-[32px] font-bold mb-6">Edit Anime</h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-base font-medium mb-2">Anime Title</label>
              <input
                type="text"
                name="animeName"
                value={formData.animeName}
                onChange={handleChange}
                placeholder="Enter the anime title"
                className="w-full h-14 rounded-xl border border-[#474747] bg-[#212121] p-4 text-white placeholder:text-[#ababab] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a brief description of the anime"
                className="w-full min-h-[140px] rounded-xl border border-[#474747] bg-[#212121] p-4 text-white placeholder:text-[#ababab] focus:outline-none"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-base font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full h-14 rounded-xl border border-[#474747] bg-[#212121] p-4 text-white focus:outline-none"
                required
              >
                <option value="">Select a category</option>
                <option value="action">Action</option>
                <option value="drama">Drama</option>
                <option value="comedy">Comedy</option>
              </select>
            </div>

            <div>
              <label className="block text-base font-medium mb-2">Watch Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-14 rounded-xl border border-[#474747] bg-[#212121] p-4 text-white focus:outline-none"
                required
              >
                <option value="">Select watch status</option>
                <option value="watching">Watching</option>
                <option value="watched">Watched</option>
                <option value="planned">Planned</option>
              </select>
            </div>

            <div className="flex flex-col items-center gap-4 border-2 border-dashed border-[#474747] py-14 rounded-xl">
              <p className="text-lg font-bold">Anime Image</p>
              {imagePreview && (
                <img src={imagePreview} alt="preview" className="w-40 h-40 object-cover rounded-lg" />
              )}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                id="imageInput"
              />
              <label
                htmlFor="imageInput"
                className="h-10 px-4 rounded-xl bg-[#303030] text-sm font-bold cursor-pointer"
              >
                Browse Files
              </label>
              {/* {formData.image && (
                <p className="text-sm text-green-400">{formData.image.name}</p>
              )} */}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="h-10 px-4 rounded-xl bg-[#141414] text-sm font-bold border border-[#474747]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
