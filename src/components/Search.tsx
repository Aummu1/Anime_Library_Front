"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import axios from 'axios';
// --- SVG ICONS ---
// Custom SVG icons for a more polished look.

// --- TYPES ---
interface SearchItemType {
  id: number;
  name: string;
  icon: React.ReactNode;
  notification: string;
  color: string;
}

interface SearchItemProps {
  item: SearchItemType;
}

// --- DUMMY DATA ---
const recentSearches: SearchItemType[] = [

];

// --- Search Item Component ---
const SearchItem: React.FC<SearchItemProps> = ({ item }) => (
  <li className="flex items-center justify-between p-3 transition-all duration-300 ease-in-out bg-black/5 dark:bg-gray-500/10 hover:bg-black/10 dark:hover:bg-gray-500/20 rounded-xl hover:scale-[1.02] cursor-pointer">
    <div className="flex items-center gap-4">
      {item.icon}
      <span className="text-gray-700 dark:text-gray-200">{item.name}</span>
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <span style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }} className="w-2 h-2 rounded-full"></span>
      <span>{item.notification}</span>
    </div>
  </li>
);

// --- Main App Component ---
export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<SearchItemType[]>(recentSearches);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => setItems([]);

  const filteredItems = items.filter(item =>
    typeof item.name === "string" &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const res = await axios.get("http://localhost:5145/api/Anime/search", {
        params: { query: searchTerm }
      });

      // แปลงข้อมูลให้ตรงกับ SearchItemType
      const mappedItems = res.data.map((a: any) => ({
        id: a.id,
        name: a.animeName, // ✅ map จาก animeName เป็น name
        icon: null,
        notification: "Found",
        color: "blue", // หรือ logic เปลี่ยนสีตาม category
      }));

      setItems(mappedItems);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <div className="w-full">
      <div className="relative flex items-center justify-center font-sans w-full px-4 pb-8">

        {/* Search Modal */}
        <div className="w-full max-w-2xl mx-auto p-4 space-y-6 bg-white/30 dark:bg-black/30 backdrop-blur-3xl border border-black/10 dark:border-white/5 rounded-3xl shadow-lg dark:shadow-2xl dark:shadow-purple-500/15">

          {/* Search Input with Enhanced Gradient Border and Glow */}
          <div className="relative p-px rounded-2xl bg-gradient-to-r from-orange-500 via-purple-600 to-pink-600 shadow-lg shadow-purple-500/20 dark:shadow-purple-600/30 transition-shadow duration-300 hover:shadow-purple-500/40 dark:hover:shadow-purple-600/50 focus-within:shadow-purple-500/40 dark:focus-within:shadow-purple-600/50">
            <div className="flex items-center w-full px-4 py-2 bg-white/80 dark:bg-gray-900/90 rounded-[15px]">
              <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search the app.."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="w-full px-3 py-1 text-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:outline-none flex-1 min-w-0"
              />
              {/* <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex items-center justify-center w-6 h-6 p-1 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-inner">
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">K</span>
                      </div>
                  </div> */}
            </div>
          </div>

          {/* Recent Searches Section */}
          {items.length > 0 && (
            <div className="px-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">Recent search</h2>
                <button
                  onClick={handleClear}
                  className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/50 hover:text-black dark:hover:text-white"
                >
                  Clear all
                </button>
              </div>

              <ul className="space-y-2">
                {filteredItems.map(item => (
                  <SearchItem key={item.id} item={item} />
                ))}
                {filteredItems.length === 0 && (
                  <p className="text-center text-gray-400 dark:text-gray-500 py-4">No results found for &quot;{searchTerm}&quot;</p>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}