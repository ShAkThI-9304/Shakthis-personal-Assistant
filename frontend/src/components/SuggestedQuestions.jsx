const questions = [
    "Tell me about Shakthi",
    "What are Shakthi's skills?",
    "What projects has Shakthi worked on?",

    "Show Shakthi's contact details",
    "How was this AI assistant built?",
];

function SuggestedQuestions({ onSelect }) {
    return (
        <div className="suggestions">
            {questions.map((q) => (
                <button key={q} onClick={() => onSelect(q)}>
                    {q}
                </button>
            ))}
        </div>
    );
}

export default SuggestedQuestions;