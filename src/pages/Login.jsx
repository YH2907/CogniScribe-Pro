// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BlindButton from "../components/BlindButton";
import { speak } from "../utils/speech";

const API_URL = process.env.REACT_APP_API_URL;

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleLogin() {
        if (loading) return;
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                speak(data.message || "Login failed");
                return;
            }

            // ✅ Save token
            localStorage.setItem("token", data.token);

            // ✅ Speak feedback
            speak("Login successful");

            // ✅ IMPORTANT: defer navigation to avoid SpeechSynthesis blocking
            setTimeout(() => {
                navigate("/notes", { replace: true });
            }, 100);

        } catch (err) {
            speak("Network error during login");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
            {/* BACKGROUND */}
            <div className="fixed inset-0 -z-10 bg-[var(--bg)] transition-colors duration-500" />
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[120px]" />

            <div className="fancy-glass w-full max-w-lg p-12 space-y-10 shadow-2xl border-t-4 border-indigo-500">
                <header className="text-center space-y-2">
                    <h1 className="text-5xl font-black italic tracking-tighter bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent uppercase">
                        Welcome Back
                    </h1>
                    <p className="text-zinc-500 font-bold tracking-widest uppercase text-xs">
                        Secure Voice Access
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
                            placeholder="Password"
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
                                ? "Logging in"
                                : "Login button. Double tap to access your notes."
                        }
                        onActivate={handleLogin}
                        className="w-full py-6 rounded-3xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white text-2xl font-black tracking-widest shadow-xl shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        {loading ? "AUTHENTICATING..." : "SIGN IN"}
                    </BlindButton>

                    <p className="text-center text-zinc-500 font-bold">
                        New here?{" "}
                        <Link
                            to="/register"
                            className="text-indigo-400 underline decoration-2 underline-offset-4 hover:text-indigo-300"
                            onFocus={() => speak("Go to registration page")}
                        >
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
