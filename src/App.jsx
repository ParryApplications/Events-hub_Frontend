import { Outlet } from "react-router-dom";
import Navigation from "./components/Navigation.jsx";
import Footer from "./components/Footer.jsx";
import ScrollProvider from "./components/ScrollContext.jsx";

// This contains the layout of the webapplication
export default function App() {
  return (
    <div>
      <header>
        <Navigation />
      </header>

      <main>
        <ScrollProvider>
          <Outlet />
        </ScrollProvider>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}
