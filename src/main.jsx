import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home.jsx";
import AddEditEventForm from "./components/AddEditEventForm.jsx";

import "./css/App.css";
import "./css/Footer.css";
import "./css/Header.css";
import "./css/index.css";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import AuthProvider from "./components/AuthContext.jsx";
import Profile from "./components/Profile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, //contains Layout of the application
    children: [
      {
        index: true, //Defaukt child
        element: <Home />,
      },
      {
        path: "event/add",
        element: <AddEditEventForm />,
      },
      {
        path: "event/edit",
        element: <AddEditEventForm />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "profile",
        element: <Profile />, //Just a placeholder for now
      },
    ],
  },
  {
    path: "*",
    element: <div>Page not found</div>,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
