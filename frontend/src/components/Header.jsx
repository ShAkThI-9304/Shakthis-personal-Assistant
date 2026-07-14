import { TrashIcon, SparklesIcon, InfoIcon } from "./icons";

import { Info } from 'lucide-react';


console.log("InfoIcon:", InfoIcon);
console.log("TrashIcon:", TrashIcon);
console.log("SparklesIcon:", SparklesIcon);

function Header({ onClear, onShowArchitecture }) {
    return (
        <div className="chat-header">
            <div className="header-brand">
                <div className="header-avatar">
                    <SparklesIcon size={20} />
                </div>
                <div className="header-info">
                    <h1>Shakthi AI Assistant</h1>
                    <div className="header-status">
                        <span className="status-dot" />
                        Online &mdash; ask me anything
                    </div>
                </div>
            </div>

            <div className="header-actions">
                <button className="icon-btn" onClick={onShowArchitecture} title="How this works">
                    {/* <InfoIcon size={16} /> */}
                    <div>
                        <InfoIcon size={16} />
                    </div>



                </button>
                <button className="clear-btn" onClick={onClear} title="Clear conversation">
                    <TrashIcon size={14} />
                    Clear

                </button>
            </div>
        </div>
    );
}

export default Header;
