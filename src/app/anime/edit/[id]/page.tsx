"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

interface FormDataType {
  animeName: string;
  description: string;
  category: string[];
  status: string;
  image: File | null;
}

interface OptionType {
  label: string;
  value: string;
}

export default function EditAnimePage() {
  const router = useRouter();
  const { id } = useParams();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormDataType>({
    animeName: "",
    description: "",
    category: [],
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
          category: data.category ? data.category.split(",") : [],
          status: data.status,
          image: null,
        });

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files && files[0]) {
      setFormData({ ...formData, image: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    data.append("AnimeName", formData.animeName);
    data.append("Description", formData.description);
    data.append("Category", formData.category.join(","));
    data.append("Status", formData.status);
    if (formData.image) {
      data.append("Image", formData.image);
    }

    try {
      // ส่งคำขอ PUT ไปยัง API
      await axios.put(`http://localhost:5145/api/Anime/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data; charset=utf-8"  // ใช้ : แทน ;
        }
      });
      // แสดงข้อความเมื่อส่งข้อมูลสำเร็จ
      console.log("Form data before submit:", formData);
      alert("✅ Anime updated successfully!");
      // รีไดเรกไปที่หน้าอื่น
      router.push("/");
    } catch (err) {
      // ถ้ามีข้อผิดพลาดในการส่งคำขอ
      console.error("❌ Error:", err);
      alert("Error updating anime.");
    }
  };

  const categoryOptions: OptionType[] = [
    { label: "Action", value: "Action" },
    { label: "Adventure", value: "Adventure" },
    { label: "Comedy", value: "Comedy" },
    { label: "Detective", value: "Detective" },
    { label: "Drama", value: "Drama" },
    { label: "Fantasy", value: "Fantasy" },
    { label: "Game", value: "Game" },
    { label: "Gourmet", value: "Gourmet" },
    { label: "Hentai", value: "Hentai" },
    { label: "Historical", value: "Historical" },
    { label: "Horror", value: "Horror" },
    { label: "Isekai", value: "Isekai" },
    { label: "Magic", value: "Magic" },
    { label: "Medical", value: "Medical" },
    { label: "Music", value: "Music" },
    { label: "Psychological", value: "Psychological" },
    { label: "Racing", value: "Racing" },
    { label: "Reincarnation", value: "Reincarnation" },
    { label: "Romance", value: "Romance" },
    { label: "Sci-Fi", value: "Sci-Fi" },
    { label: "Slice of Life", value: "Slice of Life" },
    { label: "Sports", value: "Sports" },
  ];

  const watchStatusOptions: OptionType[] = [
    { label: "Watching", value: "Watching" },
    { label: "Watched", value: "Watched" },
    { label: "Planned", value: "Planned" },
  ];

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

            {/* --- ✅ CategoryMultiSelect inline --- */}
            <div>
              <label className="block text-base font-medium mb-2">Category</label>
              <Autocomplete
                multiple
                disableCloseOnSelect
                options={categoryOptions}
                value={categoryOptions.filter((option) =>
                  formData.category.includes(option.value)
                )}
                onChange={(_e, newValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: newValue.map((opt) => opt.value),
                  }))
                }
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderOption={(props, option, { selected }) => {
                  const { key, ...rest } = props; // แยก key ออกมา
                  return (
                    <li key={key} {...rest}>
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        checked={selected}
                        style={{ marginRight: 8 }}
                      />
                      {option.label}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select categories"
                    sx={{
                      "& .MuiInputBase-root": {
                        backgroundColor: "#212121",
                        color: "#fff",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#fff",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#fff",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#fff",
                      },
                      "& .MuiAutocomplete-tag": {
                        color: "#fff",
                      },
                    }}
                  />
                )}
              />
            </div>

            {/* --- ✅ WatchStatusSelect inline --- */}
            <div>
              <label className="block text-base font-medium mb-2">Watch Status</label>
              <Autocomplete
                disablePortal
                options={watchStatusOptions}
                value={
                  watchStatusOptions.find((opt) => opt.value === formData.status) || null
                }
                onChange={(_event, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    status: newValue ? newValue.value : "",
                  }));
                }}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select watch status"
                    sx={{
                      "& .MuiInputBase-root": {
                        backgroundColor: "#212121",
                        color: "#fff",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#000",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#fff",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#fff",
                      },
                    }}
                  />
                )}
              />
            </div>

            {/* --- ✅ Image Upload Preview --- */}
            <div className="flex flex-col items-center gap-4 border-2 border-dashed border-[#474747] py-14 rounded-xl">
              <p className="text-lg font-bold">Anime Image</p>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-40 h-40 object-cover rounded-lg"
                />
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
                className="h-10 px-4 rounded-xl bg-[#303030] text-sm font-bold cursor-pointer flex items-center"
              >
                Browse Files
              </label>
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
