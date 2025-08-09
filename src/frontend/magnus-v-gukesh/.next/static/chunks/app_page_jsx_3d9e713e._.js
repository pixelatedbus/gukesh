(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/app/page.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>Home
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chessboard$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-chessboard/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// --- Helper Functions ---
const API_BASE_URL = 'http://127.0.0.1:8000'; // Your FastAPI backend URL
// Converts algebraic notation from the backend to a format react-chessboard understands
const formatToUci = (from, to)=>"".concat(from).concat(to);
// Converts row/col from react-chessboard to what the backend expects
const squareToCoords = (square)=>{
    const col = square.charCodeAt(0) - 'a'.charCodeAt(0);
    const row = 8 - parseInt(square[1], 10);
    return {
        row,
        col
    };
};
function Home() {
    _s();
    const [game, setGame] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // Holds the entire game state from the backend
    const [selectedAlgorithm, setSelectedAlgorithm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('minimax');
    const [aiDepth, setAiDepth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(5);
    const [analysisInfo, setAnalysisInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // This effect triggers the AI's move whenever it's White's turn
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (game && game.turn === 'white' && !game.winner) {
                handleAiMove();
            }
        }
    }["Home.useEffect"], [
        game
    ]);
    // --- API Handlers ---
    const handleApiCall = async (apiCall)=>{
        setIsLoading(true);
        setError('');
        try {
            const response = await apiCall();
            if (response.data.error) {
                setError(response.data.error);
                setGame(null);
            } else {
                setGame(response.data);
                if (response.data.ai_move) {
                    setAnalysisInfo(response.data.ai_move);
                }
            }
        } catch (err) {
            setError('Failed to connect to the backend. Is the Python server running?');
            console.error(err);
        } finally{
            setIsLoading(false);
        }
    };
    const handleSetup = (setupType, payload)=>{
        let apiCall;
        switch(setupType){
            case 'random':
                apiCall = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("".concat(API_BASE_URL, "/api/setup_random"), {
                        params: {
                            algorithm: selectedAlgorithm,
                            ai_depth: aiDepth
                        }
                    });
                break;
            case 'file':
                const formData = new FormData();
                formData.append('file', payload);
                apiCall = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("".concat(API_BASE_URL, "/api/setup_from_file?algorithm=").concat(selectedAlgorithm, "&ai_depth=").concat(aiDepth), formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                break;
        }
        setAnalysisInfo(null);
        handleApiCall(apiCall);
    };
    const onPieceDrop = (sourceSquare, targetSquare)=>{
        if (isLoading || game && game.turn !== 'black') return false;
        const start = squareToCoords(sourceSquare);
        const end = squareToCoords(targetSquare);
        const apiCall = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("".concat(API_BASE_URL, "/api/player_move"), {
                start_row: start.row,
                start_col: start.col,
                end_row: end.row,
                end_col: end.col
            });
        handleApiCall(apiCall);
        return true;
    };
    const handleAiMove = ()=>{
        const apiCall = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("".concat(API_BASE_URL, "/api/ai_move"));
        handleApiCall(apiCall);
    };
    const handlePlayback = (command)=>{
        const apiCall = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("".concat(API_BASE_URL, "/api/playback"), {
                command
            });
        handleApiCall(apiCall);
    };
    const handleReset = ()=>{
        setGame(null);
        setAnalysisInfo(null);
        setError('');
    };
    // --- Render ---
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-grow lg:w-2/3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-4xl font-bold text-center mb-2",
                            children: "AI Magnus vs Gukesh"
                        }, void 0, false, {
                            fileName: "[project]/app/page.jsx",
                            lineNumber: 117,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-center text-gray-400 mb-4",
                            children: [
                                "You play as Gukesh (Black King). It is ",
                                game ? "".concat(game.turn, "'s turn.") : 'not started.'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.jsx",
                            lineNumber: 118,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative w-full max-w-[600px] mx-auto aspect-square",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chessboard$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Chessboard"], {
                                    position: game ? game.board_fen : "8/8/8/8/8/8/8/8 w - - 0 1",
                                    onPieceDrop: onPieceDrop,
                                    boardOrientation: "black",
                                    customBoardStyle: {
                                        borderRadius: '8px',
                                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
                                    },
                                    customDarkSquareStyle: {
                                        backgroundColor: '#779556'
                                    },
                                    customLightSquareStyle: {
                                        backgroundColor: '#EBECD0'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 120,
                                    columnNumber: 25
                                }, this),
                                isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold animate-pulse",
                                        children: "AI is thinking..."
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.jsx",
                                        lineNumber: 130,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 129,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.jsx",
                            lineNumber: 119,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 p-4 bg-gray-800 rounded-lg shadow-lg flex justify-center items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-bold mr-4",
                                    children: "Playback:"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 136,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handlePlayback('first'),
                                    disabled: !game || game.current_move_index === 0,
                                    className: "px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: "First"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 137,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handlePlayback('undo'),
                                    disabled: !game || game.current_move_index === 0,
                                    className: "px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: "Previous"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 138,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "w-24 text-center",
                                    children: game ? "Move ".concat(game.current_move_index, " / ").concat(game.history_count - 1) : 'N/A'
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 139,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handlePlayback('redo'),
                                    disabled: !game || game.current_move_index >= game.history_count - 1,
                                    className: "px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: "Next"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 140,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handlePlayback('last'),
                                    disabled: !game || game.current_move_index >= game.history_count - 1,
                                    className: "px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: "Last"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 141,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.jsx",
                            lineNumber: 135,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.jsx",
                    lineNumber: 116,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "lg:w-1/3 flex flex-col gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 bg-gray-800 rounded-lg shadow-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-2xl font-bold border-b border-gray-700 pb-2 mb-4",
                                    children: "Game Controls"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 149,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "algorithm",
                                                    className: "block text-sm font-medium text-gray-300 mb-1",
                                                    children: "Select Algorithm"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.jsx",
                                                    lineNumber: 152,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    id: "algorithm",
                                                    value: selectedAlgorithm,
                                                    onChange: (e)=>setSelectedAlgorithm(e.target.value),
                                                    className: "w-full p-2 bg-gray-700 rounded border border-gray-600 focus:ring-2 focus:ring-blue-500",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "minimax",
                                                            children: "Minimax"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.jsx",
                                                            lineNumber: 154,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "greedy",
                                                            children: "Greedy"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.jsx",
                                                            lineNumber: 155,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.jsx",
                                                    lineNumber: 153,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.jsx",
                                            lineNumber: 151,
                                            columnNumber: 29
                                        }, this),
                                        selectedAlgorithm === 'minimax' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "depth",
                                                    className: "block text-sm font-medium text-gray-300 mb-1",
                                                    children: [
                                                        "AI Depth (",
                                                        aiDepth,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.jsx",
                                                    lineNumber: 160,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "range",
                                                    id: "depth",
                                                    min: "2",
                                                    max: "8",
                                                    step: "1",
                                                    value: aiDepth,
                                                    onChange: (e)=>setAiDepth(parseInt(e.target.value)),
                                                    className: "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.jsx",
                                                    lineNumber: 161,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.jsx",
                                            lineNumber: 159,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>fileInputRef.current.click(),
                                                    className: "flex-1 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 font-semibold",
                                                    children: "Upload Board"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.jsx",
                                                    lineNumber: 165,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "file",
                                                    ref: fileInputRef,
                                                    onChange: (e)=>handleSetup('file', e.target.files[0]),
                                                    className: "hidden",
                                                    accept: ".txt"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.jsx",
                                                    lineNumber: 166,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleSetup('random'),
                                                    className: "flex-1 px-4 py-2 bg-green-600 rounded hover:bg-green-500 font-semibold",
                                                    children: "Randomize"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.jsx",
                                                    lineNumber: 167,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.jsx",
                                            lineNumber: 164,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleReset,
                                            className: "w-full px-4 py-2 bg-red-600 rounded hover:bg-red-500 font-semibold",
                                            children: "Reset"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.jsx",
                                            lineNumber: 169,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 150,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.jsx",
                            lineNumber: 148,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 bg-gray-800 rounded-lg shadow-lg flex-grow",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-2xl font-bold border-b border-gray-700 pb-2 mb-4",
                                    children: "Analysis"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 175,
                                    columnNumber: 25
                                }, this),
                                game && game.winner ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center text-3xl font-bold text-yellow-400",
                                    children: game.winner === 'draw' ? 'Draw!' : "".concat(game.winner.charAt(0).toUpperCase() + game.winner.slice(1), " Wins!")
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 177,
                                    columnNumber: 29
                                }, this) : analysisInfo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-bold text-gray-300",
                                                    children: "AI Move:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.jsx",
                                                    lineNumber: 182,
                                                    columnNumber: 36
                                                }, this),
                                                " ",
                                                analysisInfo.from,
                                                " to ",
                                                analysisInfo.to
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.jsx",
                                            lineNumber: 182,
                                            columnNumber: 33
                                        }, this),
                                        analysisInfo.mate_in && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-bold text-green-400 text-lg",
                                            children: [
                                                "Mate in ",
                                                analysisInfo.mate_in,
                                                " moves!"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.jsx",
                                            lineNumber: 183,
                                            columnNumber: 58
                                        }, this),
                                        analysisInfo.analysis && Object.entries(analysisInfo.analysis).map((param)=>{
                                            let [key, value] = param;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold text-gray-300",
                                                        children: [
                                                            key.replace(/_/g, ' ').replace(/\b\w/g, (l)=>l.toUpperCase()),
                                                            ":"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.jsx",
                                                        lineNumber: 185,
                                                        columnNumber: 51
                                                    }, this),
                                                    " ",
                                                    typeof value === 'number' ? value.toFixed(2) : value
                                                ]
                                            }, key, true, {
                                                fileName: "[project]/app/page.jsx",
                                                lineNumber: 185,
                                                columnNumber: 38
                                            }, this);
                                        })
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 181,
                                    columnNumber: 29
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-400",
                                    children: "No analysis yet. Make a move to begin."
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 189,
                                    columnNumber: 29
                                }, this),
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-4 text-red-400 bg-red-900 p-3 rounded",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 191,
                                    columnNumber: 36
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.jsx",
                            lineNumber: 174,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.jsx",
                    lineNumber: 146,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/page.jsx",
            lineNumber: 113,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/page.jsx",
        lineNumber: 112,
        columnNumber: 9
    }, this);
}
_s(Home, "OCgFf05o5dv20DSjya8hKVgtY8A=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=app_page_jsx_3d9e713e._.js.map