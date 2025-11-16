import axios from "axios";
import { useParams, NavLink } from "react-router-dom";
import useSWR, { mutate } from "swr";
import ReactPlayer from "react-player";
import { Eye, StarIcon, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";

export default function Episode() {
  const { userId, slug } = useParams();
  const base = "https://pandanime-backend-production.up.railway.app/";
  const { user } = useAuth();
  const [hasWatched, setHasWatched] = useState(false);
  const [eps, setEps] = useState([]);
  const [watchCount, setwatchCount] = useState(0);
  const [quality, setQuality] = useState("720p");
  const [videoURL, setVideoURL] = useState(null);
  const [animes, setAnime] = useState([]);

  const fetcher = async (url) => {
    const res = await axios.get(url);
    const a = await axios.get(`${base}anime/${slug}`);
    setAnime(a.data.anime);
    setEps(res.data.AllEpisode || []);
    setwatchCount(res.data.watchCount);

    return res.data.episode;
  };

  const { data, isLoading, error } = useSWR(
    `${base}episode/${slug}/${userId}`,
    fetcher
  );

  useEffect(() => {
    if (!user || !user.id) return;
    if (!data || !data.id) return;

    // Cegah double request saat SWR re-render
    if (hasWatched) return;

    const AnimeWatch = async () => {
      await axios.post(
        `${base}watch`,
        {
          userID: user.id,
          animeID: slug,
          episodeID: data.id,
        },
        { withCredentials: true }
      );

      setHasWatched(true); // tandai sudah insert
      mutate(`${base}episode/${slug}/${userId}`);
    };

    AnimeWatch();
  }, [user, data, slug, userId, hasWatched]);
  useEffect(() => {
    setHasWatched(false);
  }, [slug, userId]);

  useEffect(() => {
    if (data?.videoURL) {
      try {
        const parsed =
          typeof data.videoURL === "string"
            ? JSON.parse(data.videoURL)
            : data.videoURL;
        setVideoURL(parsed);
      } catch (err) {
        console.error("Gagal parse videoURL:", err);
      }
    }
  }, [data, eps]);
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-xl">
        Memuat episode...
      </div>
    );

  if (error || !data)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-400 text-xl">
        Gagal memuat video.
      </div>
    );
  console.log(watchCount);
  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <div className="w-full mx-auto flex flex-col lg:flex-row gap-6 px-4">
        {/* PLAYER WRAPPER (ref untuk fullscreen) */}
        <div className="w-full lg:w-[65%] relative rounded-2xl overflow-hidden shadow-lg border border-gray-700  bg-black">
          {videoURL ? (
            <ReactPlayer
              slot="media"
              src={videoURL[quality]}
              light={
                <img
                  src={`${base}storage/thumbnail/${animes?.slug?.substring(
                    0,
                    11
                  )}/${data?.sampul}`}
                  alt="Thumbnail"
                  className="object-cover w-full h-full"
                />
              }
              controls={true}
              style={{
                width: "100%",
                height: "100%",
                "--controls": "none",
              }}
            ></ReactPlayer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Tidak ada sumber video
            </div>
          )}

          {/* QUALITY SELECT */}
          {videoURL && (
            <div className="absolute top-4 right-4 bg-gray-800/80 rounded-lg border border-gray-700 px-3 py-1">
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="bg-gray-900 text-white text-sm px-2 py-1 rounded"
              >
                {Object.keys(videoURL).map((q) => (
                  <option key={q} value={q}>
                    {q.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* LIST EPISODE */}
        <div className="w-full lg:w-[35%] bg-gray-950 rounded-xl border border-gray-700 h-[500px] overflow-hidden pb-10">
          <h1 className="sticky z-30 top-0 bg-gray-900/90 p-5 text-2xl font-semibold border-b border-gray-700">
            Daftar Episode {animes?.judul}
          </h1>

          <div className="px-5 pt-5 flex flex-col gap-3 overflow-scroll h-[400px] w-full">
            {eps
              .sort((a, b) => a.episodeNumber - b.episodeNumber)
              .map((e, i) => (
                <NavLink
                  key={i}
                  to={`/Episode/${e.animeID}/${e.episodeNumber}`}
                  className={({ isActive }) =>
                    `group relative transition rounded-lg w-full p-5 flex flex-col gap-2.5 z-30 ${
                      isActive
                        ? "ring-2 ring-indigo-500 bg-indigo-900/50"
                        : "bg-gray-900 hover:bg-gray-800"
                    }`
                  }
                >
                  <span className="text-sm font-semibold">
                    Episode {e.episodeNumber}
                  </span>
                  <span className="text-xs">
                    {e.title.length > 50
                      ? e.title.substring(0, 50) + "..."
                      : e.title}
                  </span>
                </NavLink>
              ))}
          </div>
        </div>
      </div>
      <div className="w-full mx-auto flex flex-col lg:flex-row gap-6 px-4 mt-10">
        <div className="w-full p-5 flex flex-col gap-4 bg-gray-950">
          {/* Stats Row */}
          <div className="flex items-center gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-bold">
                {Intl.NumberFormat("id-ID", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(watchCount) || "N/A"}
                x ditonton
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-bold">10Rb Suka</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsDown className="w-5 h-5 text-red-500" />
              <span className="text-sm font-bold">10Rb Tidak Suka</span>
            </div>
            <div className="flex items-center gap-2">
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-bold">10Rb Skor</span>
            </div>
          </div>

          {/* Anime Title */}
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            {animes?.judul}
          </h1>

          {/* Episode Title */}
          <p className="text-xl text-slate-300">{data?.title}</p>

          {/* Episode Number */}
          <span className="text-xl font-semibold text-indigo-400">
            Episode {data?.episodeNumber}
          </span>
        </div>
      </div>
    </div>
  );
}
