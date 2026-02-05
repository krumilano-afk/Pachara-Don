
import React from 'react';
import type { Question } from '../types';

interface QuestionPanelProps {
    question: Question;
    schemaHtml: string;
}

const DifficultyBadge: React.FC<{ difficulty: Question['difficulty'] }> = ({ difficulty }) => {
    let colorClasses = "bg-green-900 text-green-300";
    if (difficulty === "Exam Level" || difficulty === "Boss Level") {
        colorClasses = "bg-red-900 text-red-300";
    } else if (difficulty === "Intermediate") {
        colorClasses = "bg-yellow-900 text-yellow-300";
    }

    return (
        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${colorClasses}`}>
            {difficulty}
        </span>
    );
};

const SchemaDisplay: React.FC<{ htmlContent: string }> = ({ htmlContent }) => {
    return (
        <div 
            className="space-y-4 text-xs font-mono"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
};

const QuestionPanel: React.FC<QuestionPanelProps> = ({ question, schemaHtml }) => {
    return (
        <div className="w-full md:w-1/3 bg-slate-800 border-r border-slate-700 flex flex-col h-full">
            <div className="p-6 overflow-y-auto">
                <div className="mb-6">
                    <DifficultyBadge difficulty={question.difficulty} />
                </div>
                
                <h2 className="text-xl font-bold text-white mb-4">{question.title}</h2>
                <div className="text-slate-300 mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: question.desc }} />

                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Database Schema</h3>
                    <SchemaDisplay htmlContent={schemaHtml} />
                </div>
            </div>
        </div>
    );
};

export default QuestionPanel;
