// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BlindButton from "../components/BlindButton";
import { speak } from "../utils/speech";

const API_URL = process.env.REACT_APP_API_URL;

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleRegister() {
        if (loading) return;
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            // Try to parse JSON, but don't crash if body is empty
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                console.error("Register error:", res.status, data);
                speak(data.message || "Registration failed");
            } else {
                speak("Registration successful. You can now log in.");
                setTimeout(() => {
                    navigate("/login", { replace: true });
                }, 100);
            }
        } catch (err) {
            console.error("Network error during registration:", err);
            speak("Network error during registration");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
            {/* BACKGROUND */}
            <div className="fixed inset-0 -z-10 bg-[var(--bg)] transition-colors duration-500" />
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />

            <div className="fancy-glass w-full max-w-lg p-12 space-y-10 shadow-2xl border-t-4 border-pink-500">
                <header className="text-center space-y-2">
                    <h1 className="text-5xl font-black italic tracking-tighter bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent uppercase">
                        Join Us
                    </h1>
                    <p className="text-zinc-500 font-bold tracking-widest uppercase text-xs">
                        Create Your Voice Account
                    </p>
                </header>

                <div className="space-y-8">
                    {/* EMAIL */}
                    <div className="space-y-2">
                        <label className="block text-sm font-black uppercase tracking-widest text-indigo-400 ml-2">
                            Email Address
                        </label>
                        <input
                            className="w-full bg-zinc-500/5 border-2 border-indigo-500/10 rounded-2xl p-5 text-2xl font-bold outline-none focus:border-indigo-500 focus:bg-indigo-500/5 transition-all"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => speak(`Email field. ${email || "empty"}`)}
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="space-y-2">
                        <label className="block text-sm font-black uppercase tracking-widest text-pink-400 ml-2">
                            Password
                        </label>
                        <input
                            className="w-full bg-zinc-500/5 border-2 border-pink-500/10 rounded-2xl p-5 text-2xl font-bold outline-none focus:border-pink-500 focus:bg-pink-500/5 transition-all"
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => speak("Password field. Value hidden.")}
                        />
                    </div>
                </div>

                <div className="pt-4 space-y-6">
                    <BlindButton
                        label={
                            loading
                                ? "Creating account"
                                : "Register button. Double tap to create your account."
                        }
                        onActivate={handleRegister}
                        className="w-full py-6 rounded-3xl bg-gradient-to-tr from-pink-600 to-purple-500 text-white text-2xl font-black tracking-widest shadow-xl shadow-pink-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        {loading ? "CREATING ACCOUNT..." : "REGISTER"}
                    </BlindButton>

                    <p className="text-center text-zinc-500 font-bold">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-pink-400 underline decoration-2 underline-offset-4 hover:text-pink-300"
                            onFocus={() => speak("Go to login page")}
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
