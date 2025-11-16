import { useEffect, useState } from "react";
import defaultProfile from "../../assets/default.png";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const [usernames, setusernames] = useState("");
  const [emails, setemail] = useState("");
  const [passwords, setpassword] = useState("");
  const [profiles, setprofile] = useState(null);
  const [preview, setPreview] = useState("");

  const base = "https://pandanime-backend-production.up.railway.app/users";
  const nav = useNavigate();

  // useEffect(() => {
  //   if (user && user !== null) {
  //     setusernames(user.username);
  //     setemail(user.email);
  //   }
  // }, [user]);

  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const allowed = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/webp",
      "image/gif",
    ];
    if (!allowed.includes(selected.type)) {
      toast.error("Format gambar tidak valid!");
      e.target.value = "";
      return;
    }

    // Preview langsung berubah
    const previewURL = URL.createObjectURL(selected);
    setPreview(previewURL);

    // Kirim langsung ke backend
    const formData = new FormData();
    formData.append("profile", selected);
    formData.append("username", user.username);
    formData.append("email", user.email);

    try {
      await axios.patch(`${base}/${user.id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Foto profil berhasil diperbarui!");
      nav(0);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Gagal mengubah foto profil");
      // kembalikan preview ke foto lama kalau gagal
      setPreview(
        user.profile && user.profile !== "default.png"
          ? `${base.replace("/users", "")}/uploads/${user.profile}`
          : defaultProfile
      );
    }
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${base}/${user && user !== null ? user.id : null}`,
        {
          username: usernames,
          email: emails,
          password: passwords,
          profile: profiles,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Profile berhasil diubah!");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="w-full h-screen px-12">
        <div className="w-full h-auto flex relative">
          <div className="w-full flex items-center justify-center overflow-hidden rounded-2xl">
            <div className="w-full h-[350px] bg-linear-to-br to-indigo-500 from-purple-500"></div>
          </div>
          <img
            src={
              user && user !== null
                ? user.profile && user.profile !== "default.png"
                  ? `${base.replace("/users", "")}/uploads/${user.profile}`
                  : defaultProfile
                : null
            }
            alt={user && user !== null ? user.username : "??"}
            className="rounded-full w-[250px] h-[250px] object-cover absolute -bottom-40 border-20 -left-1.5 border-gray-950"
          />
          <form className="absolute text-4xl text-slate-100 -bottom-32 left-44  rounded-full p-4">
            <input
              type="file"
              name="profile"
              id="profiles"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="profiles"
              className="absolute text-4xl top-0 -translate-y-10 -translate-x-2 text-slate-100 bg-gray-950 rounded-full p-4"
            >
              <i className="ri-image-edit-line"></i>
            </label>
          </form>
        </div>
        <div className="w-full h-auto flex flex-col relative">
          <div className="absolute top-5 left-64 flex flex-col">
            <h1 className="text-4xl text-slate-100 font-bold">
              {user && user !== null ? user.username : "??"}
            </h1>
            <span className="text-2xl text-slate-300 cursor-pointer">
              {user && user !== null ? user.email : "??"}
            </span>
          </div>
        </div>
        <div className="w-full h-auto mt-48 justify-center items-center flex pb-10">
          <form
            className="w-[50%] flex justify-center gap-10 items-center flex-col py-10 bg-gray-900 rounded-4xl"
            onSubmit={handleProfile}
          >
            <h1 className=" text-center text-slate-100 font-bold text-2xl mb-5">
              Ubah Profile
            </h1>
            <div className="form-group w-[60%] rounded-lg relative flex justify-center items-center">
              <input
                type="email"
                name="email"
                id="email"
                placeholder=" "
                defaultValue={user && user !== null ? user.email : ""}
                onChange={(e) => setemail(e.target.value)}
                autoComplete="off"
                className="rounded-lg h-11 w-full outline-1 outline-slate-500 not-placeholder-shown:outline-slate-50  focus:outline-slate-50 px-5 text-slate-50"
              />
              <label htmlFor="email">Alamat Email</label>
            </div>
            <div className="form-group w-[60%] rounded-lg relative flex justify-center items-center">
              <input
                type="text"
                name="username"
                id="username"
                placeholder=" "
                defaultValue={user && user !== null ? user.username : ""}
                autoComplete="off"
                onChange={(e) => setusernames(e.target.value)}
                className="rounded-lg h-11 w-full outline-1 outline-slate-500 not-placeholder-shown:outline-slate-50  focus:outline-slate-50 px-5 text-slate-50"
              />
              <label htmlFor="username">Username</label>
            </div>
            <div className="form-group w-[60%] rounded-lg relative flex justify-center items-center">
              <input
                type="password"
                name="password"
                id="password"
                placeholder=" "
                autoComplete="off"
                onChange={(e) => setpassword(e.target.value)}
                className="rounded-lg h-11 w-full outline-1 outline-slate-500 not-placeholder-shown:outline-slate-50  focus:outline-slate-50 px-5 text-slate-50"
              />
              <label htmlFor="password">Password</label>
            </div>
            <button className="mt-5 flex items-center justify-center hover:cursor-pointer rounded-lg bg-indigo-600 hover:bg-indigo-900 text-slate-50 w-[60%] h-11">
              Edit Profile
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
