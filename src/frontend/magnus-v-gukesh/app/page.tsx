'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface GameState {
    board_fen: string;
    turn: 'white' | 'black';
    legal_moves: Record<string, [number, number][]>;
    is_check: boolean;
    is_checkmate: boolean;
    is_stalemate: boolean;
    winner: 'white' | 'black' | 'draw' | null;
    history_count: number;
    current_move_index: number;
    ai_move?: AnalysisInfo;
}

interface AnalysisInfo {
    from: string;
    to: string;
    evaluation: number;
    mate_in: number | null;
    analysis: Record<string, any>;
}

type BoardArray = (string | null)[][];
type SelectedSquare = { row: number; col: number } | null;
type LastMove = { from: string; to: string } | null;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const fenToBoardArray = (fen: string): BoardArray => {
    const board: BoardArray = Array(8).fill(null).map(() => Array(8).fill(null));
    const pieceMap: Record<string, string> = {
        'k': '♚', 
        'p': '♟︎', 
        'q': '♛', 
        'K': '♔', 
        'P': '♙', 
        'Q': '♕'  
    };    
    const fenBoard = fen.split(' ')[0];
    let row = 0;
    let col = 0;

    for (const char of fenBoard) {
        if (char === '/') {
            row++;
            col = 0;
        } else if (isNaN(parseInt(char))) {
            board[row][col] = pieceMap[char] || '';
            col++;
        } else {
            col += parseInt(char);
        }
    }
    return board;
};

const coordsToNotation = (row: number, col: number): string => {
    const file = String.fromCharCode('a'.charCodeAt(0) + col);
    const rank = 8 - row;
    return `${file}${rank}`;
};

// --- Main Component ---
export default function Home() {
    const [game, setGame] = useState<GameState | null>(null);
    const [board, setBoard] = useState<BoardArray>([]);
    const [selectedSquare, setSelectedSquare] = useState<SelectedSquare>(null);
    const [lastMove, setLastMove] = useState<LastMove>(null);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('minimax');
    const [aiDepth, setAiDepth] = useState(5);
    const [analysisInfo, setAnalysisInfo] = useState<AnalysisInfo | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Effects ---
    useEffect(() => {
        setBoard(Array(8).fill(null).map(() => Array(8).fill(null)));
    }, []);

    useEffect(() => {
        if (game) {
            setBoard(fenToBoardArray(game.board_fen));
            if (game.ai_move) {
                setLastMove({ from: game.ai_move.from, to: game.ai_move.to });
            }
            if (game.turn === 'white' && !game.winner) {
                handleAiMove();
            }
        }
    }, [game]);

    // --- API Handlers ---
    const handleApiCall = async (apiCall: () => Promise<any>) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await apiCall();
            if (response.data.error) {
                setError(response.data.error);
            } else {
                setGame(response.data);
                if (response.data.ai_move) {
                    setAnalysisInfo(response.data.ai_move);
                }
            }
        } catch (err) {
            setError('Failed to connect to the backend. Is the Python server running?');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetup = (type: 'random' | 'file', payload?: File) => {
        let apiCall;
        const params = { algorithm: selectedAlgorithm, ai_depth: aiDepth };
        setAnalysisInfo(null);
        setSelectedSquare(null);
        setLastMove(null);

        if (type === 'random') {
            apiCall = () => axios.get(`${API_BASE_URL}/api/setup_random`, { params });
        } else {
            if (!payload) return;
            const formData = new FormData();
            formData.append('file', payload);
            apiCall = () => axios.post(`${API_BASE_URL}/api/setup_from_file`, formData, { params });
        }
        handleApiCall(apiCall);
    };

    const handleAiMove = () => {
        handleApiCall(() => axios.get(`${API_BASE_URL}/api/ai_move`));
    };

    const handlePlayback = (command: string) => {
        setSelectedSquare(null);
        setLastMove(null);
        handleApiCall(() => axios.post(`${API_BASE_URL}/api/playback`, { command }));
    };
    
    const handleReset = () => {
        setGame(null);
        setBoard(Array(8).fill(null).map(() => Array(8).fill(null)));
        setAnalysisInfo(null);
        setError('');
        setSelectedSquare(null);
        setLastMove(null);
    };

    const onCellClick = (row: number, col: number) => {
        if (isLoading || !game || game.turn !== 'black' || game.winner) return;

        const pieceKey = `${row},${col}`;
        const legalMovesForPiece = game.legal_moves[pieceKey];

        if (selectedSquare) {
            const legalMovesForSelected = game.legal_moves[`${selectedSquare.row},${selectedSquare.col}`] || [];
            const isTargetLegal = legalMovesForSelected.some(move => move[0] === row && move[1] === col);

            if (isTargetLegal) {
                const fromNotation = coordsToNotation(selectedSquare.row, selectedSquare.col);
                const toNotation = coordsToNotation(row, col);
                setLastMove({ from: fromNotation, to: toNotation });

                const apiCall = () => axios.post(`${API_BASE_URL}/api/player_move`, {
                    start_row: selectedSquare.row,
                    start_col: selectedSquare.col,
                    end_row: row,
                    end_col: col
                });
                setSelectedSquare(null);
                handleApiCall(apiCall);
            } else {
                setSelectedSquare(null);
            }
        } else if (legalMovesForPiece) {
            setSelectedSquare({ row, col });
        }
    };

    // --- Render ---
    return (
        <div className={`min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans ${isLoading ? 'cursor-wait' : ''}`}>
            <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
                {/* Left Side: Board and Playback */}
                <div className="flex-grow lg:w-2/3">
                    <h1 className="text-4xl font-bold text-center mb-2">AI Magnus vs Gukesh</h1>
                    <p id="status-text" className="text-center text-gray-400 mb-4">
                        {game ? (game.winner ? (game.winner === 'draw' ? 'Game Over: Draw!' : `Game Over: ${game.winner.charAt(0).toUpperCase() + game.winner.slice(1)} wins!`) : `It is ${game.turn}'s turn.`) : 'Start a game to begin.'}
                    </p>
                    
                    <div className="relative w-full max-w-[600px] mx-auto aspect-square grid grid-cols-8 border-2 border-gray-700 rounded-lg overflow-hidden shadow-lg">
                        {board.map((rowArr, rowIndex) =>
                            rowArr.map((piece, colIndex) => {
                                const isLight = (rowIndex + colIndex) % 2 !== 0;
                                const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex;
                                const legalMovesForSelected = selectedSquare ? game?.legal_moves[`${selectedSquare.row},${selectedSquare.col}`] || [] : [];
                                const isMovable = legalMovesForSelected.some(move => move[0] === rowIndex && move[1] === colIndex);
                                
                                const currentSquareNotation = coordsToNotation(rowIndex, colIndex);
                                const isLastMoveFrom = lastMove?.from === currentSquareNotation;
                                const isLastMoveTo = lastMove?.to === currentSquareNotation;

                                return (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        onClick={() => onCellClick(rowIndex, colIndex)}
                                        className={`w-full h-full flex items-center justify-center text-4xl font-bold transition-colors duration-200
                                            ${isLoading ? 'cursor-wait' : 'cursor-pointer'}
                                            ${isLight ? 'bg-gray-400' : 'bg-gray-700'}
                                            ${isSelected ? 'ring-4 ring-yellow-400 z-10' : ''}
                                            ${isMovable ? 'bg-green-500/50' : ''}
                                            ${isLastMoveFrom ? 'bg-yellow-600/50' : ''}
                                            ${isLastMoveTo ? 'bg-yellow-500/70' : ''}
                                        `}
                                    >
                                        <span style={{ color: piece?.startsWith('w') ? '#FFFFFF' : '#000000' }}>
                                            {piece || <>&nbsp;</>}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-lg flex justify-center items-center gap-2 flex-wrap">
                        <h3 className="font-bold mr-4">Playback:</h3>
                        <button onClick={() => handlePlayback('first')} disabled={isLoading || !game || game.current_move_index === 0} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">First</button>
                        <button onClick={() => handlePlayback('undo')} disabled={isLoading || !game || game.current_move_index === 0} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                        <span className="w-24 text-center">{game ? `Move ${game.current_move_index} / ${game.history_count - 1}` : 'N/A'}</span>
                        <button onClick={() => handlePlayback('redo')} disabled={isLoading || !game || game.current_move_index >= game.history_count - 1} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                        <button onClick={() => handlePlayback('last')} disabled={isLoading || !game || game.current_move_index >= game.history_count - 1} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">Last</button>
                    </div>
                </div>

                {/* Right Side: Controls and Analysis */}
                <div className="lg:w-1/3 flex flex-col gap-6">
                    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold border-b border-gray-700 pb-2 mb-4">Game Controls</h2>
                        <fieldset disabled={isLoading} className="space-y-3">
                            <div>
                                <label htmlFor="algorithm" className="block text-sm font-medium text-gray-300 mb-1">Select Algorithm</label>
                                <select 
                                    id="algorithm" 
                                    value={selectedAlgorithm} 
                                    onChange={(e) => setSelectedAlgorithm(e.target.value)} 
                                    className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    <option value="minimax">Minimax</option>
                                    <option value="greedy">Greedy</option>
                                </select>
                            </div>
                             {selectedAlgorithm === 'minimax' && (
                                <div>
                                    <label htmlFor="depth" className="block text-sm font-medium text-gray-300 mb-1">AI Depth ({aiDepth})</label>
                                    <input 
                                        type="range" 
                                        id="depth" 
                                        min="2" 
                                        max="8" 
                                        step="1" 
                                        value={aiDepth} 
                                        onChange={(e) => setAiDepth(parseInt(e.target.value))} 
                                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                                    />
                                </div>
                            )}
                            <div className="flex gap-2">
                                <button onClick={() => fileInputRef.current?.click()} className="flex-1 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 font-semibold disabled:opacity-50">Upload Board</button>
                                <input type="file" ref={fileInputRef} onChange={(e) => handleSetup('file', e.target.files?.[0])} className="hidden" accept=".txt"/>
                                <button onClick={() => handleSetup('random')} className="flex-1 px-4 py-2 bg-green-600 rounded hover:bg-green-500 font-semibold disabled:opacity-50">Randomize</button>
                            </div>
                            <button onClick={handleReset} className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-500 font-semibold disabled:opacity-50">Reset</button>
                        </fieldset>
                    </div>

                    <div className="p-4 bg-gray-800 rounded-lg shadow-lg flex-grow">
                        <h2 className="text-2xl font-bold border-b border-gray-700 pb-2 mb-4">Analysis</h2>
                        <div className="space-y-2 text-sm">
                            {isLoading ? <p className="animate-pulse">AI is thinking...</p> : 
                             analysisInfo ? (
                                <>
                                    <p><span className="font-bold text-gray-300">AI Move:</span> {analysisInfo.from} to {analysisInfo.to}</p>
                                    {analysisInfo.mate_in && <p className="font-bold text-green-400 text-lg">Mate in {analysisInfo.mate_in} moves!</p>}
                                    {analysisInfo.analysis && Object.entries(analysisInfo.analysis).map(([key, value]) => (
                                         <p key={key}><span className="font-bold text-gray-300">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span> {typeof value === 'number' ? value.toFixed(2) : String(value)}</p>
                                    ))}
                                </>
                            ) : (
                                <p className="text-gray-400">No analysis yet.</p>
                            )}
                        </div>
                         {error && <p className="mt-4 text-red-400 bg-red-900 p-3 rounded">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
