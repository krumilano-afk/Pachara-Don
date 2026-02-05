
import React from 'react';

interface EditorPanelProps {
    userQuery: string;
    onQueryChange: (query: string) => void;
    onCompareAnswer: () => void;
    onGetHint: () => void;
    isHintLoading: boolean;
    hint: string | null;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
    userQuery,
    onQueryChange,
    onCompareAnswer,
    onGetHint,
    isHintLoading,
    hint,
}) => {
    return (
        <div className="w-full md:w-2/3 bg-slate-900 flex flex-col h-full relative">
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center text-xs text-slate-400 font-mono">
                <span>query.sql</span>
                <span className="ml-auto">ANSI SQL</span>
            </div>

            <textarea
                value={userQuery}
                onChange={(e) => onQueryChange(e.target.value)}
                className="flex-grow w-full bg-[#0f172a] text-slate-200 p-6 font-mono text-sm resize-none border-none leading-relaxed focus:ring-2 focus:ring-blue-600 focus:ring-inset"
                spellCheck="false"
                placeholder="-- Type your SQL query here..."
            />
            
            {hint && !isHintLoading && (
                 <div className="fade-in absolute bottom-20 left-4 right-4 bg-blue-900/50 border border-blue-700 p-3 rounded-lg text-sm text-blue-200 shadow-lg">
                    <strong>Hint:</strong> {hint}
                 </div>
            )}
            
            <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center z-10">
                <button
                    onClick={onGetHint}
                    className="text-slate-400 hover:text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isHintLoading}
                >
                    {isHintLoading ? 'Getting Hint...' : 'Need a hint?'}
                </button>
                <button
                    onClick={onCompareAnswer}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-bold transition-all shadow-lg hover:shadow-blue-500/20"
                >
                    Compare Answer
                </button>
            </div>
        </div>
    );
};

export default EditorPanel;
