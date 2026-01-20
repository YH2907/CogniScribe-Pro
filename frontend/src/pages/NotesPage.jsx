import { useState, useEffect, useRef } from "react";
import API from "../api";
import { speak } from "../utils/speech";
import BlindButton from "../components/BlindButton";
import Layout from "../components/Layout";

export default function NotesPage() {
    const [notes, setNotes] = useState([]);
    const [input, setInput] = useState("");
    const [listening, setListening] = useState(false);
    const [sortOrder, setSortOrder] = useState("newest");
    // Track summaries per note by note ID
    const [noteSummaries, setNoteSummaries] = useState({});
    // Track loading state per note
    const [summarizingNotes, setSummarizingNotes] = useState({});

    const recognitionRef = useRef(null);
    const transcriptBuffer = useRef("");

    useEffect(() => {
        loadNotes();

        // Warm up the voice engine for the browser
        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.getVoices();
            window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
        }

        return () => {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, []);

    async function loadNotes() {
        try {
            const res = await API.get("/notes");
            setNotes(res.data);
            speak("Workspace loaded.");
        } catch {
            speak("Error connecting to database.");
        }
    }

    // --- GROQ AI SUMMARY FUNCTION (PER NOTE) ---
    const summarizeNote = async (noteId, noteText) => {
        // Set loading state for this specific note
        setSummarizingNotes(prev => ({ ...prev, [noteId]: true }));
        speak("Summarizing note.");

        try {
            const res = await API.post("/notes/summarize", { text: noteText });

            if (res.data.summary) {
                setNoteSummaries(prev => ({ ...prev, [noteId]: res.data.summary }));
                speak(`Summary: ${res.data.summary}`);
            }
        } catch (err) {
            console.error("Frontend Summary Error:", err);
            speak("Summarization failed.");
            setNoteSummaries(prev => ({ ...prev, [noteId]: "Error: Summarization failed." }));
        } finally {
            setSummarizingNotes(prev => ({ ...prev, [noteId]: false }));
        }
    };

    function toggleSpeech() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            speak("Voice engine unavailable.");
            return;
        }

        if (listening) {
            recognitionRef.current?.stop();
            setListening(false);
            speak("Recording stopped.");
            return;
        }

        const recog = new SpeechRecognition();
        recognitionRef.current = recog;

        recog.lang = localStorage.getItem("preferredLang") || "en-US";
        recog.continuous = true;
        recog.interimResults = true;

        recog.onstart = () => {
            setListening(true);
            speak("Listening.");
        };

        recog.onresult = (e) => {
            let liveInterim = "";
            for (let i = e.resultIndex; i < e.results.length; i++) {
                if (e.results[i].isFinal) {
                    transcriptBuffer.current += e.results[i][0].transcript + " ";
                } else {
                    liveInterim += e.results[i][0].transcript;
                }
            }
            setInput(transcriptBuffer.current + liveInterim);
        };

        recog.onerror = () => {
            setListening(false);
            speak("Voice input error.");
        };

        recog.onend = () => {
            if (listening) {
                try {
                    recog.start();
                } catch { }
            }
        };

        recog.start();
    }

    const sortedNotes = [...notes].sort((a, b) =>
        sortOrder === "newest"
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : new Date(a.createdAt) - new Date(b.createdAt)
    );

    return (
        <Layout title="Intelligence Feed">
            <div className="flex flex-col space-y-12 pb-24">

                {/* CAPTURE TERMINAL */}
                <section className="fancy-glass p-10 border-t-4 border-indigo-500 shadow-xl shadow-indigo-500/5">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-6">
                        Capture Terminal
                    </h2>

                    <textarea
                        className="w-full bg-transparent text-3xl font-bold outline-none placeholder:text-zinc-500 min-h-[160px] resize-none leading-relaxed"
                        placeholder="What is in your mind..."
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            transcriptBuffer.current = e.target.value;
                        }}
                    />

                    <div className="flex gap-4 pt-8 border-t border-[var(--border)]">
                        <BlindButton
                            label="Double tap to record."
                            onActivate={toggleSpeech}
                            className={`flex-1 py-5 rounded-3xl font-black text-sm tracking-widest transition-all ${listening
                                ? "bg-red-500 text-white animate-pulse"
                                : "bg-indigo-600/10 text-indigo-500"
                                }`}
                        >
                            {listening ? "STOP" : "VOICE"}
                        </BlindButton>

                        <BlindButton
                            label="Double tap to save."
                            onActivate={async () => {
                                if (!input.trim()) {
                                    speak("Entry is empty.");
                                    return;
                                }
                                const res = await API.post("/notes", { text: input });
                                setNotes([res.data, ...notes]);
                                setInput("");
                                transcriptBuffer.current = "";
                                speak("Notes saved.");
                            }}
                            className="flex-1 py-5 rounded-3xl bg-indigo-600 text-white font-black text-sm tracking-widest shadow-xl shadow-indigo-500/20"
                        >
                            SAVE ENTRY
                        </BlindButton>
                    </div>
                </section>

                {/* ARCHIVE GRID */}
                <section className="space-y-8">
                    <div className="flex justify-between items-center px-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">
                            Archive Repository
                        </h2>

                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="bg-transparent border-none text-indigo-500 font-black text-[10px] uppercase tracking-[0.2em] outline-none cursor-pointer"
                        >
                            <option value="newest">Descending</option>
                            <option value="oldest">Ascending</option>
                        </select>
                    </div>

                    <div className="grid gap-6">
                        {sortedNotes.map(n => (
                            <div
                                key={n._id}
                                className="fancy-glass p-8 border-l-4 border-indigo-500/20 hover:border-indigo-500 transition-all"
                            >
                                {/* Note Text */}
                                <p className="text-xl font-medium mb-4 leading-relaxed opacity-80">
                                    {n.text}
                                </p>

                                {/* AI Summary for this note */}
                                {noteSummaries[n._id] && (
                                    <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-l-4 border-pink-500">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-500 mb-2">
                                            AI Summary
                                        </p>
                                        <p className="text-lg italic font-medium opacity-90 leading-relaxed">
                                            {noteSummaries[n._id]}
                                        </p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3 flex-wrap">
                                    <BlindButton
                                        label="Read"
                                        onActivate={() => speak(n.text || "")}
                                        className="flex-1 py-4 rounded-2xl bg-indigo-500/5 text-indigo-500 font-black text-[12px] uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all"
                                    >
                                        Read
                                    </BlindButton>

                                    <BlindButton
                                        label="Summarize this note"
                                        onActivate={() => summarizeNote(n._id, n.text)}
                                        className={`flex-1 py-4 rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all ${summarizingNotes[n._id]
                                                ? "bg-pink-500 text-white animate-pulse"
                                                : "bg-pink-500/10 text-pink-500 hover:bg-pink-500 hover:text-white"
                                            }`}
                                    >
                                        {summarizingNotes[n._id] ? "Summarizing..." : "Summarize"}
                                    </BlindButton>

                                    <BlindButton
                                        label="Delete"
                                        onActivate={async () => {
                                            await API.delete(`/notes/${n._id}`);
                                            setNotes(notes.filter(note => note._id !== n._id));
                                            // Also remove the summary for this note
                                            setNoteSummaries(prev => {
                                                const updated = { ...prev };
                                                delete updated[n._id];
                                                return updated;
                                            });
                                            speak("Notes Deleted");
                                        }}
                                        className="px-6 py-4 rounded-2xl bg-red-500/5 text-red-500 font-black text-[12px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        Delete
                                    </BlindButton>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </Layout>
    );
}