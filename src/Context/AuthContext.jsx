import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// buat context
const AuthContext = createContext();

// provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // data user dari backend
  const [loading, setLoading] = useState(true); // status fetch awal
  const [error, setError] = useState(null);

  // konfigurasi axios agar kirim cookie otomatis
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/",
    withCredentials: true, // penting: kirim cookie httpOnly
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Hindari tampilkan 404 di console
      if (error.response && error.response.status === 404) {
        // tidak log ke console
        return Promise.reject(error);
      }

      // selain 404 tetap tampil untuk debugging
      console.error(error);
      return Promise.reject(error);
    }
  );

  // ambil data user dari backend
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/Me", {
        validateStatus: (status) => status < 500, // anggap 404 bukan error
      });
      setUser(res.data.user);
    } catch (err) {
      if (err.response?.status === 404) {
        // jangan tampilkan apa pun, cukup handle state
        console.log("Login terlebih dahulu!");
        setUser(null);
      } else {
        // tampilkan error lain (bukan 404)
        console.error(err);
      }
      setError(err.response?.data?.message || "Gagal memuat data user");
    } finally {
      setLoading(false);
    }
  };

  // logout
  const logout = async () => {
    try {
      await axiosInstance.post("/logout", {
        validateStatus: (status) => status < 500, // anggap 404 bukan error
      });
      setUser(null);
      toast.success("Logout Berhasil!");
    } catch (err) {
      console.error("Logout gagal:", err);
    }
  };

  const login = async (credentials) => {
    await axiosInstance.post("/login", credentials);
    await fetchUser(); // langsung update user setelah login
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // hitung role
  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        logout,
        login,
        isAdmin,
        isUser,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// custom hook biar mudah dipanggil di komponen
export const useAuth = () => useContext(AuthContext);
