import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./Css/App.css";
import "remixicon/fonts/remixicon.css";
import App from "./Layout/App.jsx";
import Admin from "./Layout/Admin.jsx";
import Auth from "./Layout/Auth.jsx";
import Home from "./Views/Home/Home.jsx";
import About from "./Views/Home/About.jsx";
import Contact from "./Views/Home/Contact.jsx";
import Jadwal from "./Views/Home/Jadwal.jsx";
import Profile from "./Views/Home/Profile.jsx";
import MyList from "./Views/Home/MyList.jsx";
import Anime from "./Views/Home/Anime.jsx";
import Detail from "./Views/Home/Detail.jsx";
import Dashboard from "./Views/Admin/Dashboard.jsx";
import Animes from "./Views/Admin/Anime.jsx";
import Carousels from "./Views/Admin/Carousel.jsx";
import Users from "./Views/Admin/Users.jsx";
import Report from "./Views/Admin/Report.jsx";
import Login from "./Views/OAuth/Login.jsx";
import Register from "./Views/OAuth/Register.jsx";
import Forgot from "./Views/OAuth/Forgot.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext.jsx";
import ProtectedRoute from "./ProtectedRouter/ProtectedRouter.jsx";
import Carousel from "./Components/CarouselOverlap";
import Episode from "./Views/Home/Episode.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "About",
        element: <About />,
      },
      {
        path: "Contact",
        element: <Contact />,
      },
      {
        path: "Jadwal",
        element: <Jadwal />,
      },
      {
        path: "Profile",
        element: (
          <ProtectedRoute role="users">
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "MyList",
        element: <MyList />,
      },
      {
        path: "Anime",
        element: <Anime />,
      },
      {
        path: "Anime/Detail/:id",
        element: <Detail />,
      },
      {
        path: "Episode/:slug/:userId",
        element: <Episode />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute role="admin">
        <Admin />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "Dashboard",
        element: <Dashboard />,
      },
      {
        path: "Users",
        element: <Users />,
      },
      {
        path: "Anime",
        element: <Animes />,
      },
      {
        path: "Carousels",
        element: <Carousels />,
      },
      {
        path: "Report",
        element: <Report />,
      },
      {},
    ],
  },
  {
    path: "/Auth",
    element: <Auth />,
    children: [
      {
        path: "Login",
        element: <Login />,
      },
      {
        path: "Register",
        element: <Register />,
      },
      {
        path: "Forgot",
        element: (
          <ProtectedRoute>
            <Forgot />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
