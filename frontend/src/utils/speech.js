// src/utils/speech.js

let voices = [];
const loadVoices = () => {
    voices = window.speechSynthesis.getVoices();
};
// Chrome/Edge load voices asynchronously, this ensures we grab them ASAP
window.speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

export const speak = (text) => {
    // 1. INSTANT INTERRUPT
    window.speechSynthesis.cancel();

    if (!text || typeof text !== 'string' || !text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);

    // 2. SETTINGS SYNC
    const savedSpeed = localStorage.getItem("speechSpeed") || 1.0;
    const savedLang = localStorage.getItem("preferredLang") || "en-US";

    utterance.rate = parseFloat(savedSpeed);
    utterance.lang = savedLang;

    // 3. THE "GIRL VERSION" PRIORITY LOGIC
    // We look for Samantha or Google US English first, but only if they match the current language
    const preferredVoice = voices.find(v =>
        (v.name.includes("Samantha") || v.name.includes("Google US English") || v.name.includes("Female")) &&
        v.lang.startsWith(savedLang.split('-')[0])
    ) || voices.find(v => v.lang === savedLang) || voices[0];

    if (preferredVoice) utterance.voice = preferredVoice;

    // 4. ZERO-LAG EXECUTION
    // Using a 0ms timeout allows the .cancel() to complete so the next sound fires instantly
    setTimeout(() => {
        window.speechSynthesis.speak(utterance);
    }, 0);
};