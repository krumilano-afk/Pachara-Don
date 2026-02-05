
import React from 'react';

interface HeaderProps {
    currentQuestion: number;
    totalQuestions: number;
    timer: number;
}

const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
};

const Header: React.FC<HeaderProps> = ({ currentQuestion, totalQuestions, timer }) => {
    const timerColor = timer < 60 ? 'text-red-500 animate-pulse' : 'text-green-400';

    return (
        <header className="bg-slate-900 border-b border-slate-700 px-6 py-4 flex justify-between items-center shrink-0">
            <div className="flex items-center space-x-4">
                <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">SQL</div>
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-white">Marketplace SQL Drill</h1>
                    <p className="text-slate-400 text-xs">Target: 4 Minutes / Query</p>
                </div>
            </div>
            <div className="flex items-center space-x-6">
                <div className="text-right">
                    <div className="text-xs text-slate-400 uppercase tracking-wide">Question</div>
                    <div className="font-mono text-lg font-bold">
                        <span>{currentQuestion}</span>
                        <span className="text-slate-600"> / </span>
                        <span>{totalQuestions}</span>
                    </div>
                </div>
                <div className="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700 flex items-center space-x-2">
                    <span className="text-xs text-slate-400 uppercase">Time</span>
                    <span className={`font-mono text-xl font-bold ${timerColor}`}>{formatTime(timer)}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
