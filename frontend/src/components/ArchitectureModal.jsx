import {
    UserIcon,
    DatabaseIcon,
    LinkIcon,
    SparklesIcon,
    ServerIcon,
    CodeIcon,
    CloseIcon,
} from "./icons";

import { X } from 'lucide-react';




const STEPS = [
    {
        icon: UserIcon,
        title: "You ask a question",
        description: "Typed into the React chat UI and sent to the FastAPI backend.",
    },
    {
        icon: DatabaseIcon,
        title: "Vector search in AstraDB",
        description:
            "Your question is embedded and matched against Shakthi's resume, projects, and profile data stored as vectors in AstraDB.",
    },
    {
        icon: LinkIcon,
        title: "LangChain builds the prompt",
        description:
            "The retrieved context is combined with the system prompt and your question into a single grounded prompt.",
    },
    {
        icon: SparklesIcon,
        title: "Gemini AI generates a reply",
        description:
            "The prompt is sent to Gemini, with automatic fallback across models if one hits its rate limit.",
    },
    {
        icon: ServerIcon,
        title: "FastAPI returns clean HTML",
        description: "The model's response is normalized into HTML and sent back as JSON.",
    },
    {
        icon: CodeIcon,
        title: "Rendered in React",
        description: "The chat UI renders the formatted HTML directly in this conversation.",
    },
];

function ArchitectureModal({ onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2>How this assistant works</h2>
                        <p>A look at the full-stack RAG pipeline behind every reply.</p>
                    </div>
                    <button className="modal-close" onClick={onClose} title="Close">
                        <div>
                            <CloseIcon />
                        </div>



                    </button>
                </div>

                <div className="modal-steps">
                    {STEPS.map(({ icon: Icon, title, description }, i) => (
                        <div className="modal-step" key={title}>
                            <div className="modal-step-icon">
                                <Icon size={18} />
                            </div>
                            <div className="modal-step-content">
                                <h3>
                                    <span className="modal-step-number">{i + 1}</span>
                                    {title}
                                </h3>
                                <p>{description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ArchitectureModal;
