import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login"; // <--- IMPORT THIS
import Dashboard from "./pages/Dashboard"; // <--- IMPORT THIS
import BookDetails from "./pages/BookDetails"; // <--- IMPORT THIS

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />

        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/book/:id" element={<BookDetails />} />
          </Routes>
        </main>

        <footer className="bg-primary text-white text-center py-4 mt-10">
          <p>© 2024 Maktabat Al-Noor. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
