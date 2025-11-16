import axios from "axios";
import { useParams, NavLink } from "react-router-dom";
import useSWR, { mutate } from "swr";
import Breadcrumb from "./../../Components/Breadcrumb";
import {
  Clock,
  Calendar,
  Hash,
  BookOpen,
  MapPin,
  NotebookPen,
  Tv,
  BookA,
  CalendarCheck,
  Clapperboard,
  ChartNoAxesColumn,
  MonitorPlay,
  Eye,
  Star,
  UserPen,
} from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "../../assets/loading.gif";

export default function Detail() {
  const { id } = useParams();
  const [eps, seteps] = useState([]);
  const [displayedEps, setDisplayedEps] = useState([]); // <-- Episode yang ditampilkan saat ini
  const [page, setPage] = useState(1); // <-- Halaman saat ini
  const [limit] = useState(10);
  const base = "https://pandanime-backend-production.up.railway.app/";

  useEffect(() => {
    if (eps.length > 0) {
      if (displayedEps.length === 0) {
        // Inisialisasi awal (page === 1)
        setDisplayedEps(eps.slice(0, limit));
      } else if (eps.length > displayedEps.length) {
        // Data bertambah di server (eps lebih panjang)

        // Hitung data baru yang belum ditampilkan:
        const newEps = eps.slice(displayedEps.length);

        // Tambahkan data baru ke tampilan tanpa me-reset yang sudah ada
        setDisplayedEps((prevEps) => [...prevEps, ...newEps]);

        // Catatan: Jika Anda melakukan ini, Anda harus mengatur ulang page
        // berdasarkan displayedEps.length / limit agar loadMore berikutnya benar.
        setPage(Math.ceil(eps.length / limit));
      }
    }
  }, [eps, limit]);
  const fetcher = async (url) => {
    const res = await axios.get(url);
    // Mengasumsikan endpoint Anda mengembalikan { anime: ... }
    seteps(res.data.episode || []);
    return res.data.anime;
  };

  const { data, error, isLoading } = useSWR(
    `https://pandanime-backend-production.up.railway.app/Anime/${id}`,
    fetcher
  );

  // File: Detail.jsx

  const loadMore = () => {
    // Jika data yang ditampilkan sudah sama dengan total data, jangan lakukan apa-apa
    if (displayedEps.length >= eps.length) return;

    // Ambil index awal dari jumlah episode yang sudah ditampilkan
    const nextStart = displayedEps.length;
    const nextEnd = nextStart + limit;

    // Ambil data baru
    const newEps = eps.slice(nextStart, nextEnd);

    // Tambahkan data baru
    setDisplayedEps((prevEps) => [...prevEps, ...newEps]);

    // Tingkatkan page (ini lebih bersifat indikator saja di logika ini)
    setPage((prevPage) => prevPage + 1);
  };

  // --- Handling Loading and Error States ---
  if (isLoading) {
    return (
      <div className="fixed z-50 bg-gray-950 w-full h-screen top-0 left-0 flex justify-center items-center flex-col">
        <img src={Loading} alt="Loading..." />
        <span className="font-medium text-slate-400 text-lg">
          Sedang Memuat...
        </span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-red-500">
        <span className="text-xl">Error: Failed to load anime details.</span>
      </div>
    );
  }

  let gen = [];
  try {
    if (data?.genre && typeof data.genre === "string") {
      gen = JSON.parse(data.genre);
    } else if (Array.isArray(data?.genre)) {
      gen = data.genre;
    }
  } catch (err) {
    console.error("Gagal parse genre:", err);
    gen = [];
  }
  return (
    <div className="p-10  text-slate-50 bg-gray-900 min-h-screen">
      <div className="full mx-auto">
        <Breadcrumb links={["Anime", "Detail", data.judul]} />

        <div className="flex flex-col bg-gray-800 p-6 md:p-10 rounded-xl shadow-2xl mt-6">
          <div className="flex flex-row">
            {/* Left Column: Thumbnail */}
            <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0 md:pr-10">
              <img
                src={data.thumbnail}
                alt={data.judul}
                className="object-cover w-full max-w-xs md:max-w-sm h-auto rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
                style={{ maxHeight: "500px" }}
              />
            </div>

            {/* Right Column: Details */}
            <div className="w-full md:w-2/3 flex flex-col">
              <h1 className="text-slate-100 font-extrabold text-4xl lg:text-5xl mb-10">
                {data.judul}
              </h1>

              {/* Metadata Section */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-700 p-3 rounded-lg flex items-center shadow-md">
                  <CalendarCheck className="w-5 h-5 text-blue-400 mr-3" />
                  <div>
                    <p className="text-sm text-slate-400">Status</p>
                    <span className="font-semibold text-lg text-white">
                      {data?.status}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg flex items-center shadow-md">
                  <Calendar className="w-5 h-5 text-red-400 mr-3" />
                  <div>
                    <p className="text-sm text-slate-400">Musim</p>
                    <span className="font-semibold text-lg text-white">
                      {data.musim || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg flex items-center shadow-md">
                  <Clapperboard className="w-5 h-5 text-lime-400 mr-3" />
                  <div>
                    <p className="text-sm text-slate-400">Studio</p>
                    <span className="font-semibold text-lg text-white">
                      {data.studio || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg flex items-center shadow-md">
                  <MapPin className="w-5 h-5 text-green-400 mr-3" />
                  <div>
                    <p className="text-sm text-slate-400">Negara</p>
                    <span className="font-semibold text-lg text-white">
                      {data.negara || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg flex items-center shadow-md">
                  <NotebookPen className="w-5 h-5 text-orange-400 mr-3" />
                  <div>
                    <p className="text-sm text-slate-400">Adaptasi</p>
                    <span className="font-semibold text-lg text-white">
                      {data.adapatasi || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg flex items-center shadow-md">
                  <MonitorPlay className="w-5 h-5 text-indigo-400 mr-3" />
                  <div>
                    <p className="text-sm text-slate-400">Kualitas</p>
                    <span className="font-semibold text-lg text-white">
                      {data.kualitas || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg flex items-center shadow-md">
                  <Clock className="w-5 h-5 text-yellow-400 mr-3" />
                  <div>
                    <p className="text-sm text-slate-400">Durasi</p>
                    <span className="font-semibold text-lg text-white">
                      {data.durasi || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg flex items-center shadow-md">
                  <Tv className="w-5 h-5 text-emerald-400 mr-3" />
                  <div>
                    <p className="text-sm text-slate-400">Tipe</p>
                    <span className="font-semibold text-lg text-white">
                      {data.tipe || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg flex items-center shadow-md">
                  <BookA className="w-5 h-5 text-cyan-400 mr-3" />
                  <div>
                    <p className="text-sm text-slate-400">Eksplisit</p>
                    <span className="font-semibold text-lg text-white">
                      {data.eksplisit || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg flex items-center shadow-md">
                  <ChartNoAxesColumn className="w-5 h-5 text-violet-400 mr-3" />
                  <div>
                    <p className="text-sm text-slate-400">Demografis</p>
                    <span className="font-semibold text-lg text-white">
                      {data.demografis || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg flex items-center shadow-md">
                  <Eye className="w-5 h-5 text-teal-400 mr-3" />
                  <div>
                    <p className="text-sm text-slate-400">Peminat</p>
                    <span className="font-semibold text-lg text-white">
                      {Intl.NumberFormat("id-ID", {
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }).format(data?.peminat) || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg flex items-center shadow-md">
                  <Hash className="w-5 h-5 text-yellow-400 mr-3" />
                  <div>
                    <p className="text-sm text-slate-400">Total Episode</p>
                    <span className="font-semibold text-lg text-white">
                      {data.total_eps || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg flex items-center shadow-md">
                  <Star className="w-5 h-5 text-amber-400 mr-3" />
                  <div>
                    <p className="text-sm text-slate-400">Rating</p>
                    <span className="font-semibold text-lg text-white">
                      {data.rating || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg flex items-center shadow-md">
                  <UserPen className="w-5 h-5 text-rose-400 mr-3" />
                  <div>
                    <p className="text-sm text-slate-400">Kredit By</p>
                    <span className="font-semibold text-lg text-white">
                      {data.kredit || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* genre section */}
              <div className="grid grid-cols-5 gap-5 my-2.5">
                {gen.map((g, i) => (
                  <span
                    className="p-5 text-center rounded-lg bg-indigo-600 text-lg"
                    key={i}
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Description Section */}
              <h2 className="text-2xl font-semibold mt-4 mb-2 text-slate-200 flex items-center">
                <BookOpen className="w-6 h-6 mr-2" />
                Sinopsis
              </h2>
              <div
                // Menghapus gap-2.5 yang mungkin menyebabkan tampilan aneh pada HTML mentah
                dangerouslySetInnerHTML={{ __html: data.deskripsi }}
                className="text-slate-300 leading-relaxed space-y-4 text-base"
              />

              {/* Genre Section (Optional, if you have this data) */}
              {data.genres && data.genres.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-2xl font-semibold mb-2 text-slate-200">
                    Genre
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {data.genres.map((genre) => (
                      <span
                        key={genre}
                        className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full hover:bg-blue-700 cursor-pointer"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="w-full flex flex-col mt-10">
            <div className="flex items-center justify-between">
              <h4 className="text-2xl text-slate-50 font-bold">
                Daftar Episode
              </h4>
            </div>
            <div className="w-full grid grid-cols-5 py-5 gap-5">
              {Array.isArray(displayedEps) &&
                displayedEps.map((ep, i) => (
                  <NavLink
                    className="w-full hover:scale-105 bg-gray-950 flex justify-start items-center flex-col rounded-2xl relative mt-5"
                    key={i}
                    to={`/Episode/${ep?.animeID}/${ep?.episodeNumber}`}
                  >
                    <img
                      src={`${base}storage/thumbnail/${data?.slug.slice(
                        0,
                        11
                      )}/${ep?.sampul}`}
                      alt={ep?.title}
                      className="w-full h-[200px] object-cover rounded-t-2xl mb-2.5"
                    />
                    <div className="w-full flex flex-col gap-2 p-2.5">
                      <h5 className="text-[20px] font-medium">
                        {ep?.title
                          ? ep?.title.substring(0, 20) + "..."
                          : ep?.title}
                      </h5>
                      <span className="mb-2.5">
                        Episode {ep?.episodeNumber}
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 flex items-center justify-center gap-1 mt-2.5">
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-slate-600 text-xs">
                        {Intl.NumberFormat("id-ID", {
                          notation: "compact",
                          maximumFractionDigits: 1,
                        }).format(1930130103) || "N/A"}{" "}
                        views
                      </span>
                    </div>
                  </NavLink>
                ))}
            </div>
            {/* --- Tombol Load More --- */}
            {eps.length > displayedEps.length && (
              <div className="w-full flex justify-center mt-5">
                <button
                  onClick={loadMore}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
                >
                  Muat {limit} Episode Lagi
                </button>
              </div>
            )}
            {/* --- Akhir Tombol Load More --- */}

            {eps.length > 0 && eps.length === displayedEps.length && (
              <p className="text-center text-slate-400 mt-5">
                Semua episode sudah dimuat.
              </p>
            )}

            {eps.length === 0 && (
              <p className="text-center text-slate-400 mt-5">
                Belum ada episode yang tersedia.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
