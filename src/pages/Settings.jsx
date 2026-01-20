import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import BlindButton from "../components/BlindButton";
import { speak } from "../utils/speech";

export default function Settings() {
    const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));
    const [speed, setSpeed] = useState(localStorage.getItem("speechSpeed") || 1);
    const [lang, setLang] = useState(localStorage.getItem("preferredLang") || "en-US");

    const languages = [
        { name: "English (US)", code: "en-US" },
        { name: "Chinese (Mandarin)", code: "zh-CN" },
        { name: "Malay (Malaysia)", code: "ms-MY" },
        { name: "Japanese (Japan)", code: "ja-JP" },
        { name: "Korean (South Korea)", code: "ko-KR" },
        { name: "German (Germany)", code: "de-DE" }
    ];

    const toggleTheme = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        document.documentElement.classList.toggle("dark", newDark);
        localStorage.setItem("theme", newDark ? "dark" : "light");
        speak(newDark ? "Dark Mode." : "Light Mode.");
    };

    return (
        <Layout title="System Configuration">
            <div className="max-w-2xl mx-auto space-y-10 pb-16">
                {/* ACCOUNT */}
                <section className="fancy-card p-10 border-l-8 border-indigo-500">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-8">Identification</h2>
                    <div className="flex items-center gap-6 mb-10">
                        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">Y</div>
                        <p className="text-2xl font-bold">yongh@example.com</p>
                    </div>
                    <BlindButton onActivate={() => { localStorage.removeItem("token"); window.location.href="/login"; }} className="w-full py-5 rounded-2xl bg-red-500/5 text-red-500 font-black text-[10px] uppercase">Sign Out</BlindButton>
                </section>

                {/* VOICE synthesis */}
                <section className="fancy-glass p-10 space-y-10 border-l-8 border-purple-500">
                    <div className="space-y-6">
                        <div className="flex justify-between font-black italic"><span>Velocity</span><span className="text-indigo-500">{speed}x</span></div>
                        <input type="range" min="0.5" max="2" step="0.1" value={speed} onChange={(e) => { setSpeed(e.target.value); localStorage.setItem("speechSpeed", e.target.value); speak(`Velocity ${e.target.value}`); }} className="w-full h-3 bg-zinc-500/10 rounded-full appearance-none accent-indigo-500" />
                    </div>
                    <div className="space-y-4 pt-6 border-t border-white/10">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Localization</label>
                        <select value={lang} onChange={(e) => { setLang(e.target.value); localStorage.setItem("preferredLang", e.target.value); speak("Language synchronized."); }} className="w-full bg-[var(--surface)] text-[var(--text)] p-5 rounded-2xl border border-[var(--border)] font-black">
                            {languages.map(l => (
                                <option key={l.code} value={l.code} className="bg-[var(--bg)] text-[var(--text)]">{l.name}</option>
                            ))}
                        </select>
                    </div>
                </section>

                {/* APPEARANCE */}
                <section className="fancy-card p-10 flex justify-between items-center border-l-8 border-yellow-500">
                    <span className="text-xl font-black italic">Appearance</span>
                    <BlindButton onActivate={toggleTheme} className={`w-16 h-8 rounded-full p-1 transition-all ${isDark ? "bg-indigo-600" : "bg-zinc-300"}`}>
                        <div className={`w-6 h-6 bg-white rounded-full transition-all ${isDark ? "translate-x-8" : "translate-x-0"}`} />
                    </BlindButton>
                </section>
            </div>
        </Layout>
    );
}