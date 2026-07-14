import { CodeIcon, ServerIcon, LinkIcon, SparklesIcon, DatabaseIcon } from "./icons";

const STACK = [
    { label: "React", icon: CodeIcon },
    { label: "FastAPI", icon: ServerIcon },
    { label: "LangChain", icon: LinkIcon },
    { label: "Gemini AI", icon: SparklesIcon },
    { label: "AstraDB", icon: DatabaseIcon },
];

function TechStackBar() {
    return (
        <div className="tech-stack">
            <span className="tech-stack-label">Built with</span>
            <div className="tech-stack-chips">
                {STACK.map(({ label, icon: Icon }) => (
                    <span key={label} className="tech-chip">
                        <Icon size={13} />
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default TechStackBar;
