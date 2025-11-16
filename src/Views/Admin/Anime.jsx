import Breadcrumb from "../../Components/Breadcrumb";
import Card from "../../Components/Card";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import useSWR, { mutate } from "swr";
import Modal from "./../../Components/Modal";
import { useState } from "react";
import { CircleX, SquarePen } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Animes() {
  const [deskripsi, setdeskripsi] = useState("");
  const [jadwal, setjadwal] = useState("");
  const [waktu, setwaktu] = useState("");
  const [formData, setFormData] = useState({
    judul: "",
    thumbnail: "",
    status: "",
    kualitas: "",
    negara: "",
    tipe: "",
    rating: "",
    studio: "",
    musim: "",
    adaptasi: "",
    kredit: "",
    durasi: "",
    peminat: 0,
    skor: 0,
    total_eps: 0,
  });

  const [genres, setGenres] = useState([""]);
  const addGenre = () => setGenres([...genres, ""]);
  const [openAdd, setopenAdd] = useState(false);
  const [openEdit, setopenEdit] = useState(false);
  const [ids, setids] = useState(null);
  const removeGenre = (index) =>
    setGenres(genres.filter((_, i) => i !== index));
  const updateGenre = (index, value) => {
    const newGenres = [...genres];
    newGenres[index] = value;
    setGenres(newGenres);
  };
  const base = "https://pandanime-backend-production.up.railway.app/anime";

  const handleAddAnime = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const push = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${base}`,
        {
          formData,
          deskripsi,
          genre: genres,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      setopenAdd(false);
      setGenres([""]);
      mutate(`${base}` || "adminAnime");
    } catch (error) {
      console.log("error:" + error.message);
    }
  };

  const fetch = async (url) => {
    const res = await axios.get(url);
    return res.data.anime;
  };

  const { data, isLoading, error } = useSWR(
    `${ids !== null ? base + "/" + ids : base}`,
    fetch
  );

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f] text-white text-xl">
        Memuat episode...
      </div>
    );

  if (error || !data)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f] text-red-400 text-xl">
        Gagal memuat video.
      </div>
    );

  return (
    <>
      <div className="w-full min-h-screen bg-[#0a0a0f] text-slate-100 px-10 py-8">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-500">
              Daftar Anime
            </h1>

            <div className="flex items-center gap-3">
              <button
                className="w-[150px] hover:cursor-pointer hover:bg-green-800 h-11 bg-green-600 flex items-center justify-center rounded-lg font-bold"
                onClick={() => setopenAdd(true)}
              >
                Tambah Anime
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3 mt-5">
            {["Semua", "Update Terbaru", "Rilis Terbaru", "Populer"].map(
              (btn, i) => (
                <span
                  key={i}
                  className="cursor-pointer px-5 py-3 rounded-xl bg-linear-to-br from-purple-700 to-indigo-700 text-white font-semibold hover:shadow-indigo-500 shadow transition"
                >
                  {btn}
                </span>
              )
            )}
          </div>

          {/* Card Grid */}
          <Card type="wrap">
            {Array.isArray(data) &&
              data.map((anime, i) => (
                <div
                  className="flex flex-col w-[200px] bg-[#15151f] rounded-2xl  hover:scale-[1.03] hover:shadow-indigo-600 shadow-md transition relative mt-10"
                  key={i}
                >
                  <button
                    className="absolute top-0 right-0 bg-indigo-600 text-slate-50 rounded-lg p-2.5 w-[50px] h-[50px] flex items-center justify-center hover:bg-indigo-800 cursor-pointer"
                    onClick={() => {
                      setopenEdit(true);
                      setids(anime.id);
                      setGenres(JSON.parse(anime.genre));
                    }}
                  >
                    <SquarePen className="w-5 h-5" />
                  </button>
                  <NavLink key={i} to={`/Anime/Detail/${anime.slug}`}>
                    <img
                      src={anime.thumbnail}
                      alt={anime.judul}
                      className="w-full h-[200px] object-cover rounded-t-2xl"
                    />
                    <div className="flex flex-col p-4">
                      <h1
                        className="text-slate-50 font-bold text-lg truncate mb-3"
                        title={anime.judul}
                      >
                        {anime.judul}
                      </h1>
                      <span className="text-slate-400 text-sm mt-1">
                        Total Episode {anime.total_eps || "??"}
                      </span>
                      <span
                        className={`${
                          anime.status === "Selesai Tayang"
                            ? "text-green-400"
                            : "text-amber-400"
                        } text-sm mt-1`}
                      >
                        {anime.status || "N/A"}
                      </span>
                    </div>
                    <div className="flex p-2.5 items-center justify-between gap-2 text-md text-gray-400">
                      <span>⭐ {anime.skor ?? "N/A"} / 10</span>
                      <span>👁️ {anime.views ?? 0}</span>
                    </div>
                  </NavLink>
                </div>
              ))}
          </Card>
        </div>
      </div>

      <Modal isOpen={openAdd}>
        <div className="flex items-center justify-center flex-col bg-[#0a0a0f]/90 w-full h-screen fixed top-0 left-0 z-50 backdrop-blur-sm  py-8">
          <form
            className="w-[70%] h-full  bg-[#15151f] flex flex-col items-center justify-center  rounded-2xl  border border-[#2a2a35] pt-8 relative"
            onSubmit={push}
          >
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-500 mb-5">
              Tambah Anime
            </h1>
            <button
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-slate-800"
              onClick={() => setopenAdd(false)}
            >
              <CircleX className="w-5 h-5 text-red-500" />
            </button>
            <div className="w-full py-5 flex flex-wrap gap-6 h-full justify-center overflow-scroll">
              {[
                "judul",
                "thumbnail",
                "status",
                "kualitas",
                "negara",
                "tipe",
                "rating",
                "studio",
                "musim",
                "skor",
                "total_eps",
                "peminat",
                "adaptasi",
                "durasi",
                "kredit",
              ].map((field) => (
                <div
                  key={field}
                  className="form-group w-[300px] h-12 relative text-slate-200"
                >
                  <input
                    type={
                      field === "skor" ||
                      field === "total_eps" ||
                      field === "peminat"
                        ? "number"
                        : "text"
                    }
                    name={field}
                    id={field}
                    placeholder=" "
                    min={0}
                    className="peer w-full h-full bg-[#15151f] text-slate-100 px-4 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600 not-placeholder-shown:border-indigo-500 not-placeholder-shown:ring-2 not-placeholder-shown:ring-indigo-600 transition outline-none"
                    onChange={handleAddAnime}
                  />
                  <label
                    htmlFor={field}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm   peer-focus:top-0 peer-not-placeholder-shown:top-0 peer-focus:text-xs peer-focus:text-indigo-500 peer-not-placeholder-shown:text-indigo-500 transition-all peer-not-placeholder-shown:bg-[#15151f] peer-not-placeholder-shown:text-xs peer-focus:bg-[#15151f] p-2.5"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                </div>
              ))}

              {/* Input Genre Dinamis */}
              <div className="w-full flex flex-col items-center gap-2 mt-3">
                <label className="text-slate-300 text-lg font-semibold">
                  Genre
                </label>
                {genres.map((genre, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 w-[300px] relative"
                  >
                    <input
                      type="text"
                      name={`genre-${index}`}
                      id={`genre-${index}`}
                      placeholder="Genre..."
                      value={genre}
                      onChange={(e) => updateGenre(index, e.target.value)}
                      className="w-full bg-[#1e1e29] text-slate-100 px-4 py-2 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600 outline-none transition"
                    />
                    {genres.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGenre(index)}
                        className="text-red-500 hover:text-red-700 text-xl"
                      >
                        ✖
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addGenre}
                  className="mt-2 px-4 py-2 bg-linear-to-r from-purple-600 to-indigo-600 rounded-lg text-white text-sm hover:scale-105 transition font-semibold"
                >
                  + Tambah Genre
                </button>
              </div>

              {/* Input Deskripsi */}
              <div className="w-[630px] flex flex-col mt-6">
                <label
                  htmlFor="deskripsi"
                  className="text-slate-300 text-lg font-semibold mb-2"
                >
                  Deskripsi
                </label>
                <textarea
                  name="deskripsi"
                  id="deskripsi"
                  rows="4"
                  placeholder="Tulis deskripsi singkat anime..."
                  onChange={(e) => setdeskripsi(e.target.value)}
                  className="w-full bg-[#1e1e29] text-slate-100 px-4 py-3 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600 outline-none transition resize-none"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              className="my-10 w-[260px] h-20 bg-green-600 text-slate-50 font-bold rounded-lg hover:scale-105 hover:bg-green-800 transition"
            >
              Tambah Anime Baru
            </button>
          </form>
        </div>
      </Modal>
      <Modal isOpen={openEdit}>
        <div className="flex items-center justify-center flex-col bg-[#0a0a0f]/90 w-full h-screen fixed top-0 left-0 z-50 backdrop-blur-sm  py-8">
          <form className="w-[70%] h-full  bg-[#15151f] flex flex-col items-center justify-center  rounded-2xl  border border-[#2a2a35] pt-8 relative">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-500 mb-5">
              Edit Anime
            </h1>
            <button
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-slate-800"
              onClick={() => {
                setopenEdit(false);
                setids(null);
                setGenres([]);
              }}
            >
              <CircleX className="w-5 h-5 text-red-500" />
            </button>
            <div className="w-full py-5 flex flex-wrap gap-6 h-full justify-center overflow-scroll">
              {[
                "judul",
                "thumbnail",
                "status",
                "kualitas",
                "negara",
                "tipe",
                "rating",
                "studio",
                "musim",
                "adaptasi",
                "kredit",
              ].map((field) => (
                <div
                  key={field}
                  className="form-group w-[300px] h-12 relative text-slate-200"
                >
                  <input
                    type="text"
                    name={field}
                    id={field}
                    defaultValue={data?.[field] || ""}
                    placeholder=" "
                    min={0}
                    className="peer w-full h-full bg-[#15151f] text-slate-100 px-4 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600 not-placeholder-shown:border-indigo-500 not-placeholder-shown:ring-2 not-placeholder-shown:ring-indigo-600 transition outline-none"
                  />
                  <label
                    htmlFor={field}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm   peer-focus:top-0 peer-not-placeholder-shown:top-0 peer-focus:text-xs peer-focus:text-indigo-500 peer-not-placeholder-shown:text-indigo-500 transition-all peer-not-placeholder-shown:bg-[#15151f] peer-not-placeholder-shown:text-xs peer-focus:bg-[#15151f] p-2.5"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                </div>
              ))}

              {/* Input Genre Dinamis */}
              <div className="w-full flex flex-col items-center gap-5 mt-3">
                <label className="text-slate-300 text-lg font-semibold">
                  Genre
                </label>
                {genres.map((genre, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 w-[300px] relative"
                  >
                    <input
                      type="text"
                      name={`genre-${index}`}
                      id={`genre-${index}`}
                      placeholder=" "
                      value={genre}
                      onChange={(e) => updateGenre(index, e.target.value)}
                      className="w-full bg-[#1e1e29] text-slate-100 px-4 py-2 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600 not-placeholder-shown:border-indigo-500 not-placeholder-shown:ring-2 not-placeholder-shown:ring-indigo-600 outline-none transition"
                    />
                    {genres.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGenre(index)}
                        className="text-red-500 hover:text-red-700 text-xl"
                      >
                        ✖
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addGenre}
                  className="mt-2 px-4 py-2 bg-linear-to-r from-purple-600 to-indigo-600 rounded-lg text-white text-sm hover:scale-105 transition font-semibold"
                >
                  + Tambah Genre
                </button>
              </div>

              {/* Input Deskripsi */}
              <div className="w-[630px] flex flex-col mt-6">
                <label
                  htmlFor="deskripsi"
                  className="text-slate-300 text-lg font-semibold mb-2"
                >
                  Deskripsi
                </label>
                <textarea
                  name="deskripsi"
                  id="deskripsi"
                  rows="4"
                  defaultValue={data?.deskripsi}
                  placeholder="Tulis deskripsi singkat anime..."
                  className="w-full bg-[#1e1e29] text-slate-100 px-4 py-3 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600 outline-none transition resize-none"
                ></textarea>
              </div>

              {/* Input Jadwal & Waktu */}
              <div className="flex flex-wrap gap-6 mt-4 justify-center">
                <div className="form-group w-[300px] flex flex-col">
                  <label
                    htmlFor="jadwal"
                    className="text-slate-300 text-lg font-semibold mb-2"
                  >
                    Jadwal Rilis
                  </label>
                  <input
                    type="date"
                    name="jadwal"
                    id="jadwal"
                    className="w-full bg-[#1e1e29] text-slate-100 px-4 py-2 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600 outline-none transition"
                  />
                </div>

                <div className="form-group w-[300px] flex flex-col">
                  <label
                    htmlFor="waktu"
                    className="text-slate-300 text-lg font-semibold mb-2"
                  >
                    Waktu Rilis
                  </label>
                  <input
                    type="time"
                    name="waktu"
                    id="waktu"
                    className="w-full bg-[#1e1e29] text-slate-100 px-4 py-2 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600 outline-none transition"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="my-10 w-[260px] h-20 bg-indigo-600 hover:bg-indigo-800  text-slate-50 font-bold rounded-lg hover:scale-105 transition"
            >
              Edit Anime
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}
