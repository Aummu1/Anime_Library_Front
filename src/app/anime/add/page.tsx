"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

// --- ✅ TYPE
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

// --- ✅ CategoryMultiSelect
const CategoryMultiSelect = ({
  formData,
  setFormData,
}: {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}) => {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
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

  const handleCategoryChange = (
    _event: React.SyntheticEvent,
    newValue: OptionType[]
  ) => {
    const selectedValues = newValue.map((option) => option.value);
    setFormData((prev) => ({ ...prev, category: selectedValues }));
  };

  return (
    <div>
      <label className="block text-base font-medium mb-2">Category</label>
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={categoryOptions}
        value={categoryOptions.filter((option) =>
          formData.category.includes(option.value)
        )}
        onChange={handleCategoryChange}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderOption={(props, option, { selected }) => {
          const { key, ...restProps } = props;
          return (
            <li key={key} {...restProps}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.label}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Select categories"
            className="rounded-xl"
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
  );
};

// --- ✅ WatchStatusSelect
const WatchStatusSelect = ({
  formData,
  setFormData,
}: {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}) => {
  const watchStatusOptions: OptionType[] = [
    { label: "Watching", value: "Watching" },
    { label: "Watched", value: "Watched" },
    { label: "Planned", value: "Planned" },
  ];

  return (
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
            className="rounded-xl"
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
  );
};

// --- ✅ AddAnimePage
export default function AddAnimePage() {
  const [formData, setFormData] = useState<FormDataType>({
    animeName: "",
    description: "",
    category: [],
    status: "",
    image: null,
  });

  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files) {
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
      await axios.post("http://localhost:5145/api/Anime", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Anime added successfully!");
      router.push("/");
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

            <CategoryMultiSelect formData={formData} setFormData={setFormData} />
            <WatchStatusSelect formData={formData} setFormData={setFormData} />

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
                className="h-10 px-4 rounded-xl bg-[#303030] text-sm font-bold cursor-pointer flex items-center justify-center"
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
