import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotesPage from "./pages/NotesPage";
import Settings from "./pages/Settings";

function App() {
    // State to track token so the UI updates immediately after login
    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        // Sync theme
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            document.documentElement.classList.add("light");
        } else {
            document.documentElement.classList.remove("light");
        }

        // Listen for login changes
        const handleStorageChange = () => setToken(localStorage.getItem("token"));
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Use the token state for protection */}
                <Route
                    path="/notes"
                    element={token ? <NotesPage /> : <Navigate to="/login" />}
                />
                <Route
                    path="/settings"
                    element={token ? <Settings /> : <Navigate to="/login" />}
                />

                <Route path="/" element={<Navigate to="/notes" />} />
            </Routes>
        </Router>
    );
}

export default App;