import { Outlet } from "react-router-dom";
import Navigation from "./components/Navigation.jsx";
import Footer from "./components/Footer.jsx";

// This contains the layout of the webapplication
export default function App() {
  return (
    <div>
      <header>
        <Navigation />
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}
