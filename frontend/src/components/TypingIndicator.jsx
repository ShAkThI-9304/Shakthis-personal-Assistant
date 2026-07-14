import { useEffect, useState } from "react";
import { BotIcon } from "../components/icons";

// Cycles through a few status phrases so the loading state feels alive
// instead of a static "Thinking..." label.
const PHRASES = [
    "Reading Shakthi's profile",
    "Searching the knowledge base",
    "Putting the answer together",
];

function TypingIndicator() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((i) => (i + 1) % PHRASES.length);
        }, 1800);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="typing-row">
            <div className="avatar assistant">
                <BotIcon />
            </div>

            <div className="typing-bubble">
                <span key={index} className="typing-text">
                    {PHRASES[index]}
                </span>
                <span className="typing-dots">
                    <span />
                    <span />
                    <span />
                </span>
            </div>
        </div>
    );
}

export default TypingIndicator;
