
import React, { useState } from 'react';
import type { Question } from '../types';
import type { GoogleGenAI } from "@google/genai";

interface SolutionModalProps {
    question: Question;
    userQuery: string;
    onClose: () => void;
    onNextQuestion: () => void;
    ai: GoogleGenAI | null;
}

const AIFeedback: React.FC<{
    ai: GoogleGenAI | null;
    question: Question;
    userQuery: string;
}> = ({ ai, question, userQuery }) => {
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getFeedback = async () => {
        if (!ai) {
            alert("Gemini API key not configured.");
            return;
        }
        setIsLoading(true);
        setFeedback('');

        try {
            const prompt = `
                You are a SQL expert reviewing a user's query.
                The problem was:
                Title: "${question.title}"
                Description: "${question.desc.replace(/<[^>]*>?/gm, '')}"

                The model solution is:
                \`\`\`sql
                ${question.solution}
                \`\`\`
                
                The user's submitted query is:
                \`\`\`sql
                ${userQuery}
                \`\`\`
                
                Please provide feedback on the user's query. Compare it to the model solution. 
                - If it's correct and functionally equivalent, praise them and perhaps point out any minor stylistic differences.
                - If it's incorrect, explain what's wrong with their logic and guide them toward the correct approach.
                - Keep the feedback concise and encouraging. Use markdown for formatting.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });
            
            if (response.text) {
                setFeedback(response.text);
            } else {
                setFeedback("Sorry, I could not generate feedback at this time.");
            }

        } catch (error) {
            console.error("Error getting AI feedback:", error);
            setFeedback("An error occurred while getting feedback. Please check your API key.");
        } finally {
            setIsLoading(false);
        }
    };
    
    if(!ai) return null;

    return (
        <div className="mt-4 pt-4 border-t border-slate-700">
             <button
                onClick={getFeedback}
                disabled={isLoading}
                className="w-full text-center bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded font-bold transition-colors text-sm disabled:opacity-50"
            >
                {isLoading ? 'Analyzing...' : 'Get AI Feedback on Your Query'}
            </button>
            {feedback && (
                <div className="mt-4 p-4 bg-slate-900 rounded prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: feedback.replace(/\n/g, '<br>') }}>
                </div>
            )}
        </div>
    );
};


const SolutionModal: React.FC<SolutionModalProps> = ({ question, userQuery, onClose, onNextQuestion, ai }) => {
    return (
        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4 md:p-8 fade-in">
            <div className="w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-slate-900 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
                    <h3 className="font-bold text-white">Model Solution</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <pre className="font-mono text-sm text-green-400 mb-4 bg-black/30 p-4 rounded border border-slate-600 whitespace-pre-wrap">
                        {question.solution}
                    </pre>
                    
                    <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4">
                        <h4 className="text-blue-400 font-bold text-xs uppercase mb-1">Logic Breakdown</h4>
                        <div className="text-slate-300 text-sm" dangerouslySetInnerHTML={{ __html: question.logic }} />
                    </div>
                    
                    <AIFeedback ai={ai} question={question} userQuery={userQuery} />

                </div>
                <div className="bg-slate-900 px-6 py-4 flex justify-end shrink-0">
                    <button onClick={onNextQuestion} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-bold">
                        Next Question &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SolutionModal;
