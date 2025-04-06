import { Outlet } from "react-router-dom";
import Navigation from "./components/Navigation.jsx";
import Footer from "./components/Footer.jsx";
import ScrollProvider from "./components/ScrollContext.jsx";

// This contains the layout of the webapplication
export default function App() {
  return (
    <div className="">
      <header>
        <ScrollProvider>
          <Navigation />
        </ScrollProvider>
      </header>

      <main className="px-3 py-1">
        <Outlet />
      </main>

      <footer className="p-1 d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        <Footer />
      </footer>
    </div>
  );
}
