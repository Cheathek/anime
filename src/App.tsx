import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AnimeDetail from "./pages/AnimeDetail";
import SearchResults from "./pages/SearchResults";
import TopAiring from "./pages/TopAiring";
import Seasonal from "./pages/Seasonal";
import Popular from "./pages/Popular";
import Latest from "./pages/Latest";

function App() {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/anime/:id" element={<AnimeDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/top-airing" element={<TopAiring />} />
            <Route path="/latest" element={<Latest />} />
            <Route path="/popular" element={<Popular />} />
            <Route path="/seasonal" element={<Seasonal />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
