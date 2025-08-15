import sys
import time
import math
from .board import Board
from .piece import King, Pawn, Queen
from .minimax import StaticEvaluator, MATE_SCORE
from .solver import AISolver
from .greedy import GreedySolver

class Game:
    def __init__(self):
        self.board: Board | None = None
        self.solver = None
        self.current_move_index: int = 0

    def initialize_solver(self, algorithm: str, ai_depth: int):
        if algorithm == 'greedy':
            self.solver = GreedySolver()
        else:
            self.solver = AISolver(StaticEvaluator(), search_depth=ai_depth)

    def setup_game_from_positions(self, white_king_pos: str, white_pawn_pos: str, black_king_pos: str, ai_depth: int = 5, algorithm: str = 'minimax'):
        try:
            self.board = Board.from_text(f"{white_king_pos}\n{white_pawn_pos}\n{black_king_pos}")
            self.board.to_move = 'black'
            self.initialize_solver(algorithm, ai_depth)
            self.current_move_index = 0
            return self.get_game_state()
        except (ValueError, IndexError) as e:
            return {"error": f"Invalid setup position: {e}"}

    def setup_game_from_text(self, text_content: str, ai_depth: int = 5, algorithm: str = 'minimax'):
        try:
            self.board = Board.from_text(text_content)
            self.board.to_move = 'black'
            self.initialize_solver(algorithm, ai_depth)
            self.current_move_index = 0
            return self.get_game_state()
        except (ValueError, IndexError) as e:
            return {"error": f"Invalid file content: {e}"}

    def setup_game_random(self, ai_depth: int = 5, algorithm: str = 'minimax'):
        self.board = Board.from_random()
        self.board.to_move = 'black'
        self.initialize_solver(algorithm, ai_depth)
        self.current_move_index = 0
        return self.get_game_state()

    def get_game_state(self):
        if not self.board: return {"error": "Game not set up."}
        legal_moves_dict = self.board.get_all_legal_moves(self.board.to_move)
        serializable_moves = {}
        for piece, moves in legal_moves_dict.items():
            piece_pos_key = f"{piece.row},{piece.col}"
            serializable_moves[piece_pos_key] = list(moves)
        return {
            "board_fen": self.board.to_fen(), "turn": self.board.to_move,
            "legal_moves": serializable_moves, "is_check": self.board.is_check(self.board.to_move),
            "is_checkmate": self.board.is_checkmate(self.board.to_move),
            "is_stalemate": self.board.is_stalemate(self.board.to_move),
            "winner": self.get_winner(), "history_count": len(self.board.move_history),
            "current_move_index": self.current_move_index
        }
    def handle_player_move(self, start_coords: tuple, end_coords: tuple):
        if not self.board or not self.solver: return {"error": "Game not set up."}
        if self.board.to_move != 'black': return {"error": "It's not the player's turn."}
        if self.current_move_index < len(self.board.move_history) - 1:
            self.board.move_history = self.board.move_history[:self.current_move_index + 1]
        piece_to_move = self.board.get_piece(start_coords[0], start_coords[1])
        if not piece_to_move or piece_to_move.color != 'black': return {"error": "Invalid piece to move."}
        legal_moves = self.board.get_legal_moves_for_piece(piece_to_move)
        if end_coords not in legal_moves: return {"error": "Illegal move."}
        self.board.make_move(piece_to_move, end_coords[0], end_coords[1])
        self.current_move_index += 1
        return self.get_game_state()
    
    def request_ai_move(self):
        if not self.board or not self.solver: return {"error": "Game not set up."}
        if self.board.to_move != 'white': return {"error": "It's not the AI's turn."}
        if self.current_move_index < len(self.board.move_history) - 1:
            self.board.move_history = self.board.move_history[:self.current_move_index + 1]

        time_start = time.time()

        result = self.solver.find_best_move(self.board)
        if not result: return self.get_game_state()
        (piece_to_move, dest_coords), eval_score, analysis_data = result
        if isinstance(piece_to_move, King):
            from_row, from_col = self.board.white_king.row, self.board.white_king.col
        elif isinstance(piece_to_move, Pawn) or isinstance(piece_to_move, Queen):
            from_row, from_col = self.board.white_piece.row, self.board.white_piece.col
        self.board.make_move(piece_to_move, dest_coords[0], dest_coords[1])
        self.current_move_index += 1
        response = self.get_game_state()

        time_end = time.time()
        analysis_data['thinking_time'] = time_end - time_start

        response['ai_move'] = {
            "from": self.coords_to_notation(from_row, from_col),
            "to": self.coords_to_notation(dest_coords[0], dest_coords[1]),
            "evaluation": eval_score, "mate_in": self.calculate_mate_in(eval_score),
            "analysis": analysis_data
        }
        return response
    def handle_playback(self, command: str):
        if not self.board: return {"error": "Game not set up."}
        if command == 'undo' and self.current_move_index > 0: self.current_move_index -= 2
        elif command == 'redo' and self.current_move_index < len(self.board.move_history) - 2: self.current_move_index += 2
        elif command == 'first': self.current_move_index = 0
        elif command == 'last': self.current_move_index = len(self.board.move_history) - 1
        fen_to_load = self.board.move_history[self.current_move_index]
        self.board.load_from_fen(fen_to_load)
        self.board.to_move = 'black' if (self.current_move_index % 2) == 0 else 'white'
        return self.get_game_state()
    def get_winner(self):
        if not self.board.white_piece: return 'draw'
        if self.board.is_checkmate('white'): return 'black'
        if self.board.is_checkmate('black'): return 'white'
        if self.board.is_stalemate(self.board.to_move): return 'draw'
        return None
    def calculate_mate_in(self, eval_score):
        if isinstance(self.solver, AISolver) and eval_score >= MATE_SCORE:
            plies_to_mate = self.solver.search_depth - (eval_score - MATE_SCORE) + 1
            return math.ceil(plies_to_mate / 2)
        return None
    def notation_to_coords(self, alg_notation: str) -> tuple[int, int]:
        col = ord(alg_notation[0]) - ord('a')
        row = 8 - int(alg_notation[1])
        return row, col
    def coords_to_notation(self, row: int, col: int) -> str:
        col_char = chr(ord('a') + col)
        row_char = str(8 - row)
        return f"{col_char}{row_char}"
    
    def display_board(self):
        board_str = ""
        for r in range(8):
            for c in range(8):
                piece = self.board.get_piece(r, c)
                board_str += piece.piece_type if piece else "."
            board_str += "\n"
        print(board_str)