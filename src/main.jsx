import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home.jsx";
import AddEditEventForm from "./components/AddEditEventForm.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./css/App.css";
import "./css/media.css";
import "./css/index.css";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import AuthProvider from "./components/AuthContext.jsx";
import Profile from "./components/Profile.jsx";
import ScrollProvider from "./components/ScrollContext.jsx";
import NotFound from "./components/NotFound.jsx";
import { ToastContainer } from "react-toastify";
import SingleEvent from "./components/SingleEvent.jsx";
import About from "./components/About.jsx";
import VerificationPage from "./components/VerificationPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, //contains Layout of the application
    children: [
      {
        index: true, //Default child
        element: (
          <ScrollProvider>
            <Home />
          </ScrollProvider>
        ),
      },
      {
        path: "addEvent",
        element: <AddEditEventForm />,
      },
      {
        path: "editEvent",
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
        element: <Profile />,
      },
      {
        path: "event/:eventId",
        element: <SingleEvent />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/verify",
        element: <VerificationPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <>
    <ToastContainer />
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </>
  // </StrictMode>
);
