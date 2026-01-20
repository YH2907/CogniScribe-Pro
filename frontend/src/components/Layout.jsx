import React from "react";
import { Link, useLocation } from "react-router-dom";
import { speak } from "../utils/speech";

export default function Layout({ children, title }) {
    const location = useLocation();

    return (
        <div className="min-h-screen relative overflow-x-hidden">
            {/* Aesthetic Background Blobs */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[120px]" />
            </div>

            <header className="sticky top-0 z-50 bg-white/70 dark:bg-black/40 backdrop-blur-2xl border-b border-[var(--border)] px-8 py-5">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    {/* Updated Professional Brand Name */}
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent uppercase">
                            CogniScribe Pro
                        </h1>
                        <span className="text-[10px] font-bold tracking-[0.4em] opacity-40 uppercase ml-1">
                            {title}
                        </span>
                    </div>

                    <nav className="flex gap-2 p-1.5 rounded-2xl bg-zinc-500/5 border border-[var(--border)]">
                        {['Notes', 'Settings'].map(item => (
                            <Link
                                key={item}
                                to={`/${item.toLowerCase()}`}
                                onFocus={() => speak(`Maps to ${item}`)}
                                className={`px-5 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${location.pathname.includes(item.toLowerCase())
                                        ? "bg-[var(--accent)] text-white shadow-lg shadow-indigo-500/20"
                                        : "opacity-40 hover:opacity-100"
                                    }`}
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-8 py-12">
                {children}
            </main>
        </div>
    );
}