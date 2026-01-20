// src/hooks/useDoubleTap.js
import { useRef } from "react";

export default function useDoubleTap(onActivate, delay = 350) {
    const lastTapRef = useRef(0);
    const tapCountRef = useRef(0);

    function handleTap() {
        const now = Date.now();
        const timeSinceLastTap = now - lastTapRef.current;

        // If taps are too far apart, treat this as a new first tap
        if (timeSinceLastTap > delay) {
            tapCountRef.current = 1;
        } else {
            tapCountRef.current += 1;
        }

        lastTapRef.current = now;

        // Only run action on the *second* tap in the time window
        if (tapCountRef.current === 2) {
            tapCountRef.current = 0;
            onActivate();
        }
    }

    return {
        onClick: handleTap,
        onTouchStart: handleTap,
        onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleTap();
            }
        },
        tabIndex: 0,
        role: "button",
    };
}
