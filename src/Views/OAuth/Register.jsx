import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const baseURL = "https://pandanime-backend-production.up.railway.app/";
  const nav = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        baseURL + "register",
        {
          email,
          username,
          password,
          confPass: confPassword,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Registrasi berhasil! Silakan login.");
      return nav("/Auth/Login");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(`Registrasi gagal: ${error.response.data.error}`);
      } else {
        console.error("Registration error:", error);
        toast.error(
          error.response?.data?.message || "Terjadi kesalahan saat registrasi."
        );
      }
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form
        className="w-[90%] bg-white/60 dark:bg-slate-900/70 flex items-center justify-between rounded-lg"
        onSubmit={handleRegister}
      >
        <div className="w-[50%] py-5 flex items-center justify-center flex-col gap-2.5">
          <h2 className="text-[30px] mb-8 text-slate-300">Daftar Akun Baru</h2>
          <div className="form-group w-[70%] h-auto  flex items-center justify-center relative rounded-lg">
            <input
              type="email"
              placeholder=" "
              id="email"
              name="email"
              autoComplete="off"
              className="rounded-lg w-full h-11 outline-1 outline-slate-500 not-placeholder-shown:outline-slate-50 focus:outline-slate-50 px-5 text-slate-50"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">Alamat Email</label>
          </div>
          <span className="w-[70%] info text-slate-400 text-sm mb-6">
            * Kami tidak akan membagikan informasi anda kepada siapapun.
          </span>
          <div className="form-group mb-4 w-[70%] h-auto flex items-center justify-center relative rounded-lg">
            <input
              type="text"
              placeholder=" "
              id="username"
              name="username"
              autoComplete="off"
              className="rounded-lg w-full h-11 outline-1 outline-slate-500 not-placeholder-shown:outline-slate-50  focus:outline-slate-50 px-5 text-slate-50"
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="username">Username</label>
          </div>
          <div className="form-group w-[70%] h-auto mb-4 flex items-center justify-center relative rounded-lg">
            <input
              type="password"
              placeholder=" "
              id="password"
              name="password"
              autoComplete="off"
              className="rounded-lg w-full h-11 outline-1 outline-slate-500 not-placeholder-shown:outline-slate-50 focus:outline-slate-50 px-5 text-slate-50"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Password</label>
          </div>
          <div className="form-group w-[70%] h-auto mb-4 flex items-center justify-center relative rounded-lg">
            <input
              type="password"
              placeholder=" "
              id="confPassword"
              name="confPassword"
              autoComplete="off"
              className="rounded-lg w-full h-11 outline-1 outline-slate-500 not-placeholder-shown:outline-slate-50 focus:outline-slate-50 px-5 text-slate-50"
              onChange={(e) => setConfPassword(e.target.value)}
            />
            <label htmlFor="confPassword">Konfirmasi Password</label>
          </div>
          <button
            type="submit"
            className="mt-5 flex items-center justify-center bg-linear-to-br to-indigo-600 from-purple-600 rounded-lg text-slate-50 w-[70%] h-11 hover:cursor-pointer hover:to-indigo-800 hover:from-purple-800"
          >
            Buat Akun Baru
          </button>
          <NavLink
            to="/Auth/Login"
            className="mt-2.5 text-slate-300 hover:underline"
          >
            Sudah punya akun? Login
          </NavLink>
        </div>
        <div className="w-[50%] h-[600px] rounded-tr-lg rounded-br-lg flex p-5 rounded-tl-[100%] justify-center items-end relative flex-col bg-linear-to-br to-indigo-600 from-purple-600 gap-5">
          <h1 className="w-[80%] text-4xl text-slate-50 items-end justify-end flex font-bold">
            Welcome to Register Pages
          </h1>
          <span className="w-[80%] text-2xl text-slate-300 flex items-end justify-end font-medium">
            Buat akun baru untuk melanjutkan
          </span>
        </div>
      </form>
    </div>
  );
}
