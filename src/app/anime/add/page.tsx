"use client"
import React, { useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function AddAnimePage() {
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

  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files) {
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
      await axios.post("http://localhost:5145/api/Anime", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ Anime added successfully!");
      router.push("/");
      console.log(data)
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Error uploading anime.");
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white font-['Plus Jakarta Sans','Noto Sans',sans-serif]">
      <main className="flex justify-center px-10 py-8">
        <div className="max-w-[960px] w-full">
          <h1 className="text-[32px] font-bold mb-6">Add New Anime</h1>

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
              <p className="text-lg font-bold">Upload Anime Image</p>
              <p className="text-sm">Drag and drop or click to upload</p>

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
                required
              />
              <label
                htmlFor="imageInput"
                className="h-10 px-4 rounded-xl bg-[#303030] text-sm font-bold cursor-pointer"
              >
                Browse Files
              </label>
              {formData.image && (
                <p className="text-sm text-green-400">{formData.image.name}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="h-10 px-4 rounded-xl bg-[#141414] text-sm font-bold border border-[#474747]"
              >
                Add Anime
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
