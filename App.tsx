
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";

import { questions, schemas } from './constants';
import type { Question } from './types';
import Header from './components/Header';
import QuestionPanel from './components/QuestionPanel';
import EditorPanel from './components/EditorPanel';
import SolutionModal from './components/SolutionModal';

const App: React.FC = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timer, setTimer] = useState(240);
    const [timerActive, setTimerActive] = useState(true);
    const [userQuery, setUserQuery] = useState('');
    const [isSolutionVisible, setIsSolutionVisible] = useState(false);
    const [hint, setHint] = useState<string | null>(null);
    const [isHintLoading, setIsHintLoading] = useState(false);

    const currentQuestion: Question = useMemo(() => questions[currentQuestionIndex], [currentQuestionIndex]);

    const ai = useMemo(() => {
        if (process.env.API_KEY) {
            return new GoogleGenAI({ apiKey: process.env.API_KEY });
        }
        return null;
    }, []);

    const resetTimer = useCallback(() => {
        setTimer(240);
        setTimerActive(true);
    }, []);

    useEffect(() => {
        if (timerActive && timer > 0) {
            const intervalId = setInterval(() => {
                setTimer(t => t - 1);
            }, 1000);
            return () => clearInterval(intervalId);
        } else if (timer === 0) {
            setTimerActive(false);
        }
    }, [timer, timerActive]);

    const loadQuestion = useCallback((index: number) => {
        setCurrentQuestionIndex(index);
        setUserQuery('');
        setIsSolutionVisible(false);
        setHint(null);
        resetTimer();
    }, [resetTimer]);

    const handleNextQuestion = useCallback(() => {
        if (currentQuestionIndex < questions.length - 1) {
            loadQuestion(currentQuestionIndex + 1);
        } else {
            alert("Drill Complete! Great job.");
            setIsSolutionVisible(false);
        }
    }, [currentQuestionIndex, loadQuestion]);

    const handleCompareAnswer = () => {
        if (!userQuery.trim()) {
            alert("Please type a query first!");
            return;
        }
        setTimerActive(false);
        setIsSolutionVisible(true);
    };

    const handleGetHint = async () => {
        if (!ai) {
            alert("Gemini API key not configured.");
            return;
        }
        setIsHintLoading(true);
        setHint(null);
        try {
            const prompt = `
              You are a SQL teaching assistant.
              A user is trying to solve the following SQL problem:
              Title: "${currentQuestion.title}"
              Description: "${currentQuestion.desc.replace(/<[^>]*>?/gm, '')}" 
              
              The schema involves these tables: customers, orders, returns.
              
              Provide a concise, one or two-sentence hint to guide them. Do NOT give away the full query or the direct answer. Focus on the core concept they need to apply (e.g., "Think about how to connect orders with returns," or "Remember the keyword for filtering dates.").
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt
            });

            if (response.text) {
                setHint(response.text);
            } else {
                 setHint("Sorry, I couldn't generate a hint right now.");
            }
        } catch (error) {
            console.error("Error getting hint:", error);
            setHint("There was an error getting a hint. Please check your API key and try again.");
        } finally {
            setIsHintLoading(false);
        }
    };


    return (
        <div className="h-full flex flex-col">
            <Header
                currentQuestion={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                timer={timer}
            />

            <main className="flex-grow flex flex-col md:flex-row h-full overflow-hidden">
                <QuestionPanel
                    question={currentQuestion}
                    schemaHtml={schemas[currentQuestion.schema]}
                />
                <EditorPanel
                    userQuery={userQuery}
                    onQueryChange={setUserQuery}
                    onCompareAnswer={handleCompareAnswer}
                    onGetHint={handleGetHint}
                    isHintLoading={isHintLoading}
                    hint={hint}
                />
            </main>

            {isSolutionVisible && (
                <SolutionModal
                    question={currentQuestion}
                    userQuery={userQuery}
                    onClose={() => setIsSolutionVisible(false)}
                    onNextQuestion={handleNextQuestion}
                    ai={ai}
                />
            )}
        </div>
    );
};

export default App;
