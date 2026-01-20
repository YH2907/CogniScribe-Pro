// src/pages/EditNote.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useDoubleTap from "../hooks/useDoubleTap";
import { speak } from "../utils/speech";

const API_URL = process.env.REACT_APP_API_URL;

export default function EditNote() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        async function loadNote() {
            try {
                const res = await fetch(`${API_URL}/notes/${id}`, {
                    headers: { Authorization: token },
                });
                if (!res.ok) {
                    speak("Could not load note");
                    return;
                }
                const data = await res.json();
                setContent(data.content || "");
                speak("Editing note");
            } catch {
                speak("Network error while loading note");
            }
        }
        loadNote();
    }, [id, token]);

    async function handleSave() {
        try {
            const res = await fetch(`${API_URL}/notes/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({ content }),
            });

            if (!res.ok) {
                speak("Failed to update note");
                return;
            }

            speak("Note updated");
            navigate("/notes");
        } catch {
            speak("Network error while updating note");
        }
    }

    const saveTap = useDoubleTap(handleSave);
    const backTap = useDoubleTap(() => navigate("/notes"));

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Edit Note</h1>
                <button
                    {...backTap}
                    className="px-4 py-3 rounded-lg bg-gray-700 text-xl font-bold"
                    aria-label="Back to notes list"
                >
                    Back
                </button>
            </header>

            <label className="block text-xl">
                Note content
                <textarea
                    className="mt-2 w-full p-3 rounded-lg bg-gray-900 border border-gray-600 text-xl h-56"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onBlur={() =>
                        speak(
                            content
                                ? `Note content length ${content.length} characters`
                                : "Note is empty."
                        )
                    }
                />
            </label>

            <button
                {...saveTap}
                className="w-full py-4 rounded-lg bg-green-600 text-2xl font-bold focus:outline-none focus:ring-4 focus:ring-green-400"
                aria-label="Save changes. Double tap or press enter."
            >
                Save Changes (double tap)
            </button>
        </div>
    );
}
