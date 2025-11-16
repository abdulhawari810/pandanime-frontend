import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext.jsx";
import Modal from "./Modal.jsx";
import axios from "axios";
import notFound from "../assets/not-found.gif";
import defaultImage from "../assets/default.png";
import { Settings, SquareCheck } from "lucide-react";

export default function Navbar({ layout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(false);
  const [notif, setnotif] = useState(false);
  const [subnotif, setsubnotif] = useState(false);
  const [search, setSearch] = useState("");
  const [searchModal, setsearchModal] = useState(false);
  const [data, setData] = useState([]);
  const [navItems, setnavItems] = useState([
    "Home",
    "Anime",
    "Jadwal",
    "MyList",
  ]);
  const { user, logout } = useAuth();

  const baseURL = "http://localhost:3000/anime/search";
  const base = "http://localhost:3000/users";

  useEffect(() => {
    const fetchData = async () => {
      if (search === "") {
        setData([]);
        return;
      }
      if (layout && layout === "admin") {
        setnavItems(["Dashboard", "Users", "Anime", "Laporan"]);
      }
      try {
        const res = await axios.get(`${baseURL}/${search}`);
        setData(res.data.anime);
      } catch (error) {
        if (error.response?.status === 404) {
          setData([]);
        } else {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [search]);
  return (
    <>
      {/* NAVBAR */}

      <nav
        className="
          fixed inset-x-0 top-0 z-50
          backdrop-blur-md
          border-b border-slate-200/30 dark:border-slate-700/60
          bg-white/60 dark:bg-slate-900/70
          transition-colors duration-300
          px-4 md:px-10 h-[72px] flex items-center justify-between
        "
      >
        {/* Left: Brand + Mobile Button */}
        <div className="flex items-center gap-3">
          {/* Hamburger for mobile */}
          <button
            className="md:hidden p-2 rounded-md text-slate-900 dark:text-slate-100 hover:bg-white/5 group"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
          >
            <i className="ri-menu-line text-2xl group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-none">
                Pandanime
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 -mt-0.5">
                {layout === "admin" ? "Admin Pages" : "Streaming & Info Anime"}
              </p>
            </div>
          </NavLink>
        </div>

        {/* Center: Navigation Links */}
        {layout === "home" ? (
          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <NavLink
                key={item}
                to={`/${
                  layout === "home"
                    ? item === "Home"
                      ? ""
                      : item
                    : item === "Laporan"
                    ? "Admin/Report"
                    : "Admin/" + item
                }`}
                className={({ isActive }) =>
                  `transition-colors duration-200 px-3 py-2 rounded-md ${
                    isActive
                      ? "text-white bg-indigo-600 shadow-md dark:bg-white/10"
                      : "text-slate-700 dark:text-slate-200 hover:text-white hover:bg-indigo-100 dark:hover:bg-white/5"
                  }`
                }
              >
                {item}
              </NavLink>
            ))}
          </div>
        ) : null}

        {/* Right: Icons + Search + Profile */}
        <div className="flex items-center gap-3 text-slate-800 dark:text-slate-100 relative">
          {/* Search Input */}
          <form
            className="hidden md:flex items-center gap-2 relative"
            role="search"
          >
            <input
              type="search"
              placeholder="Search anime..."
              className="
                w-[300px] h-10 rounded-full
                bg-slate-100/80 dark:bg-slate-800/70
                text-slate-900 dark:text-slate-100
                placeholder:text-slate-500 dark:placeholder:text-slate-400
                px-4 pr-10 outline-none
                focus:ring-2 focus:ring-indigo-400/40 dark:focus:ring-indigo-500/40
                transition
              "
              value={search}
              onChange={(e) => {
                const val = e.target.value;
                setSearch(val);
                setsearchModal(val.trim() !== "");
              }}
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white absolute right-0 top-0"
            >
              <i className="ri-search-line" />
            </button>
          </form>

          {/* Notification */}
          <div className="relative group flex items-center">
            <button
              className={
                notif
                  ? "p-2 rounded-full bg-slate-200/50 dark:bg-slate-700/40 relative group"
                  : "p-2 rounded-full  relative group"
              }
              aria-label="Notifications"
              onClick={() => {
                setProfile(false);
                setnotif(!notif);
              }}
            >
              <i className="ri-notification-3-line text-lg" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            <div
              className={
                notif
                  ? "absolute top-20 right-0 mt-2 w-[350px] bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200/50 dark:border-slate-700/40  opacity-100 scale-100 pointer-events-auto origin-top-right transition-all duration-300 ease-out"
                  : "absolute top-20 right-0 mt-2 w-[350px] bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200/50 dark:border-slate-700/40 opacity-0 scale-95 pointer-events-none  origin-top-right transition-all duration-300 ease-out"
              }
            >
              <div className="w-full flex flex-col p-5">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl text-slate-50">Notifikasi</h1>
                  <div
                    className="relative flex items-center"
                    onClick={() => setsubnotif(!subnotif)}
                  >
                    <button
                      className={
                        subnotif
                          ? "w-[50px] h-[50px] flex items-center justify-center bg-slate-600 rounded-full text-2xl"
                          : "w-[50px] h-[50px] flex items-center justify-center  rounded-full text-2xl"
                      }
                    >
                      <i className="ri-more-fill"></i>
                    </button>
                    <div
                      className={
                        subnotif
                          ? "absolute w-[300px] top-12 right-0 p-5 mt-2 bg-gray-950 dark:bg-gray-950 rounded-xl shadow-xl border border-slate-200/50 dark:border-slate-700/40  opacity-100 scale-100 pointer-events-auto origin-top-right transition-all duration-300 ease-out gap-5"
                          : "absolute w-[300px] top-12 right-0 p-5 mt-2 bg-gray-950 dark:bg-gray-950 rounded-xl shadow-xl border border-slate-200/50 dark:border-slate-700/40  opacity-0 scale-95 pointer-events-auto origin-top-right transition-all duration-300 ease-out gap-5"
                      }
                    >
                      <div className="cursor-pointer hover:bg-indigo-500/30 rounded-lg w-full h-11 p-2.5 flex items-center gap-2.5 text-slate-400 hover:text-slate-200">
                        <SquareCheck className="w-5 h-5" />
                        <span>Tandai semua sudah dibaca</span>
                      </div>
                      <div className="cursor-pointer hover:bg-indigo-500/30 rounded-lg w-full h-11 p-2.5 flex items-center gap-2.5 text-slate-400 hover:text-slate-200 mt-2">
                        <Settings className="w-5 h-5" />
                        <span>Pengaturan Notifikasi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <NavLink
                to="/Profile"
                className="block px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50"
              >
                Profile
              </NavLink>
            </div>
          </div>

          {/* Profile Dropdown (visual only) */}
          <div
            className="relative group flex items-center"
            onClick={() => {
              setProfile(!profile);
              setnotif(false);
            }}
          >
            <button
              className={
                profile
                  ? "p-2 rounded-full bg-slate-200/50 dark:bg-slate-700/40 flex items-center"
                  : "p-2 rounded-full flex items-center"
              }
              aria-label="Profile menu"
            >
              <img
                src={
                  user && user !== null
                    ? user.profile && user.profile !== "default.png"
                      ? `${base.replace("/users", "")}/uploads/${user.profile}`
                      : defaultImage
                    : defaultImage
                }
                alt={user && user !== null ? user.username : defaultImage}
                className="w-[35px] h-[35px] object-cover rounded-full"
              />
            </button>
            <i
              className={`ri-arrow-down-s-line text-sm ${
                profile ? "rotate-180" : "rotate-0"
              }`}
            ></i>

            {/* Dropdown menu */}
            <div
              className={
                profile
                  ? "absolute top-20 right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200/50 dark:border-slate-700/40  opacity-100 scale-100 pointer-events-auto origin-top-right transition-all duration-300 ease-out"
                  : "absolute top-20 right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200/50 dark:border-slate-700/40 opacity-0 scale-95 pointer-events-none  origin-top-right transition-all duration-300 ease-out"
              }
            >
              <NavLink
                to="/Profile"
                className="block px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50"
              >
                Profile
              </NavLink>
              <NavLink
                to="/Settings"
                className="block px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50"
              >
                Settings
              </NavLink>
              {user && user.role === "admin" ? (
                <NavLink
                  to="/Admin/Dashboard"
                  className="block px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                >
                  Dashboard
                </NavLink>
              ) : (
                ""
              )}
              <hr className="my-1 border-slate-200 dark:border-slate-700" />
              {user ? (
                <button
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={logout}
                >
                  Logout
                </button>
              ) : (
                <NavLink
                  className="block px-4 py-2 text-slate-50 rounded-bl-lg rounded-br-lg bg-indigo-600 hover:bg-indigo-800 dark:hover:bg-indigo-900"
                  to={"/Auth/Login"}
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* END NAVBAR */}

      {/* BACKDROP */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-[1px] z-40 md:hidden animate-[fadeIn_0.3s_ease-out]"
        />
      )}

      {/* END BACKDROP */}

      {/* MOBILE SIDEBAR */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 
          bg-white/60 dark:bg-slate-900/70 
          backdrop-blur-md border-r border-slate-200/20 dark:border-slate-700/50 
          transform transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:hidden
        `}
      >
        <div className="px-4 py-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-linear-to-br from-rose-400 to-fuchsia-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold">P</span>
              </div>
              <div>
                <h2 className="text-slate-900 dark:text-white font-bold">
                  Pandanime
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Streaming
                </p>
              </div>
            </NavLink>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-slate-900 dark:text-white hover:bg-white/5 rounded-md"
            >
              <i className="ri-close-line text-xl" />
            </button>
          </div>

          {/* Links */}
          <nav className="mt-6 flex flex-col gap-1 animate-[fadeIn_0.5s_ease-out]">
            {navItems.map((item) => (
              <NavLink
                key={item}
                to={`/${
                  layout === "home"
                    ? item === "Home"
                      ? ""
                      : item
                    : item === "Laporan"
                    ? "Admin/Report"
                    : "Admin/" + item
                }`}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md transition ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-slate-900 dark:text-slate-200 hover:bg-indigo-100 dark:hover:bg-white/5"
                  }`
                }
              >
                {item}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Search */}
          <form className="mt-6 flex items-center gap-2">
            <input
              type="search"
              placeholder="Search anime..."
              className="w-full h-10 rounded-full bg-slate-100/80 dark:bg-slate-800/70 px-3 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none"
              value={search}
              onChange={(e) => {
                const val = e.target.value;
                setSearch(val);
                setsearchModal(val.trim() !== "");
              }}
            />
            <button
              className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white"
              aria-label="Search"
            >
              <i className="ri-search-line" />
            </button>
          </form>

          {/* Auth Buttons */}
          <div className="mt-6 flex flex-col gap-2">
            {user ? (
              <NavLink
                onClick={logout}
                className="w-full text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
              >
                Logout
              </NavLink>
            ) : (
              <NavLink
                to="/Auth/Login"
                className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </aside>

      {/* END MOBILE SIDEBAR */}

      {/* MODAL SEARCHING */}

      <Modal isOpen={searchModal}>
        <div className="w-[400px] h-[400px] flex flex-col p-5">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-lg font-bold">Hasil Pencarian</h1>
            <span
              className="cursor-pointer"
              onClick={() => {
                setsearchModal(false);
                setSearch("");
              }}
            >
              <i className="ri-close-line text-3xl text-slate-950"></i>
            </span>
          </div>
          <div className="flex w-full h-full items-center flex-col gap-3 overflow-scroll">
            {data && data.length > 0 ? (
              data.map((anime, index) => (
                <div className="flex items-center group" key={index}>
                  <NavLink
                    className="flex items-start gap-3"
                    to={`/Anime/Detail/${anime.slug}`}
                  >
                    <div>
                      <img
                        src={anime.thumbnail}
                        alt={anime.judul}
                        className="w-[100px] h-[100px] object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h2
                        className="text-gray-950 font-medium truncate text-2xl overflow-hidden text-ellipsis"
                        title={anime.judul}
                      >
                        {anime.judul.length > 10
                          ? anime.judul.substring(0, 7) + "..."
                          : anime.judul}
                      </h2>
                      <div className="flex flex-wrap gap-2.5">
                        <span className="text-gray-600 text-md flex items-center justify-center gap-1">
                          <i className="ri-tv-line"></i> {anime.kualitas}
                        </span>
                        <span className="text-gray-600 text-md flex items-center justify-center gap-1">
                          <i className="ri-star-line"></i> {anime.skor} / 10
                        </span>
                        <span className="text-gray-600 text-md flex items-center justify-center gap-1">
                          <i className="ri-time-line"></i>{" "}
                          {anime.status || "??"}
                        </span>
                        <span className="flex items-center gap-1 flex-wrap">
                          {Array.isArray(JSON.parse(anime.genre)) &&
                            JSON.parse(anime.genre)
                              .slice(0, 3)
                              .map((a, ik) => (
                                <span
                                  className="text-sm p-1.5 bg-gray-950/90 rounded-sm text-slate-300"
                                  key={ik}
                                >
                                  {a}
                                </span>
                              ))}
                        </span>
                      </div>
                    </div>
                  </NavLink>
                </div>
              ))
            ) : (
              <>
                <div>
                  <img
                    src={notFound}
                    alt="Data Not Found"
                    className="w-[200px] h-[200px] object-cover"
                  />
                  <h2 className="text-center text-indigo-600 text-2xl font-medium">
                    Data Not Found
                  </h2>
                  <p className="text-center mt-5">Anime tidak ditemukan!</p>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>

      {/* END MODAL SEARCHING */}
    </>
  );
}
