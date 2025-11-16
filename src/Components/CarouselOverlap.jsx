import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import useSWR from "swr";
import { NavLink } from "react-router-dom";

// Fetcher SWR
const fetcher = async () => {
  const res = await axios.get("http://localhost:3000/anime/Carousel");
  return res.data.anime;
};

export default function Carousel() {
  const [index, setIndex] = useState(0);
  const { data, isLoading, error } = useSWR("carousel", fetcher);

  // Definisikan fungsi di luar kondisi agar selalu sama
  const next = () => {
    if (!data) return;
    setIndex((prev) => (prev + 1) % data.length);
  };

  const prev = () => {
    if (!data) return;
    setIndex((prev) => (prev - 1 + data.length) % data.length);
  };

  // Auto-slide (jalan hanya jika data tersedia)
  useEffect(() => {
    if (!data || data.length === 0) return;
    const timer = setInterval(next, 15000);
    return () => clearInterval(timer);
  }, [data]);

  // Kalau belum ada data, render tampilan loading di dalam return
  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f0f1a] text-white">
        <p className="animate-pulse text-gray-400">Loading anime...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f0f1a] text-red-500">
        <p>Gagal memuat data anime!</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f0f1a] text-white">
        <p>Tidak ada data anime ditemukan</p>
      </div>
    );
  }

  const current = data[index];
  const nextIndex = (index + 1) % data.length;
  const prevIndex = (index - 1 + data.length) % data.length;
  let gen = [];
  try {
    if (current?.genre && typeof current.genre === "string") {
      gen = JSON.parse(current.genre);
    } else if (Array.isArray(current?.genre)) {
      gen = current.genre;
    }
  } catch (err) {
    console.error("Gagal parse genre:", err);
    gen = [];
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-[#0f0f1a] to-[#1c1c28] text-white overflow-hidden pb-5">
      {/* Carousel */}
      <div className="relative w-[80%] h-[480px] flex justify-center items-center">
        {/* Previous */}
        <motion.img
          key={data[prevIndex].id}
          src={data[prevIndex].thumbnail}
          className="absolute w-60 h-[360px] rounded-2xl object-cover opacity-40 blur-[2px]"
          initial={{ x: -120, scale: 0.9 }}
          animate={{ x: -120, scale: 0.9 }}
          transition={{ duration: 0.5 }}
        />

        {/* Current */}
        <AnimatePresence mode="wait">
          <NavLink
            to={`/Anime/Detail/${current.slug}`}
            className="absolute w-[260px] h-[380px] rounded-2xl object-cover shadow-2xl z-20"
          >
            <motion.img
              key={current.id}
              src={current.thumbnail}
              className="w-[260px] h-[380px] rounded-2xl object-cover shadow-2xl z-20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1.05 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
            />
          </NavLink>
        </AnimatePresence>

        {/* Next */}
        <motion.img
          key={data[nextIndex].id}
          src={data[nextIndex].thumbnail}
          className="absolute w-60 h-[360px] rounded-2xl object-cover opacity-40 blur-[2px]"
          initial={{ x: 120, scale: 0.9 }}
          animate={{ x: 120, scale: 0.9 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Info Anime */}
      <NavLink className="mt-6 text-center" to={`/Anime/Detail/${current.id}`}>
        <h2 className="text-2xl font-semibold">{current.judul}</h2>
        <p className="text-sm text-gray-400 mt-1">
          ⭐ {current.skor} / 10 | {current.kualitas}
        </p>
        <span className="flex items-center justify-center gap-1 my-2.5">
          {Array.isArray(gen) &&
            gen.map((a, ik) => (
              <span
                className="text-sm p-1.5 bg-gray-950/90 rounded-sm text-slate-300"
                key={ik}
              >
                {a}
              </span>
            ))}
        </span>
        <p className="text-sm text-green-400">{current.status}</p>
      </NavLink>

      {/* Tombol Navigasi */}
      <div className="flex gap-5 mt-6">
        <button
          onClick={prev}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all"
        >
          ⬅ Prev
        </button>
        <button
          onClick={next}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all"
        >
          Next ➡
        </button>
      </div>

      {/* Indikator */}
      <div className="flex gap-2 mt-4">
        {data.map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === index ? "bg-white scale-125" : "bg-white/40"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
