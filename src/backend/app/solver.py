import copy
import random
import math
from .board import Board
from .minimax import StaticEvaluator, MATE_SCORE, manhattan_distance
from .piece import Piece, Queen, King

class AISolver:
    def __init__(self, evaluator: StaticEvaluator, search_depth: int = 4):
        self.evaluator = evaluator
        self.search_depth = search_depth
        self.move_count = 0

    def order_moves(self, board: Board, legal_moves: dict[Piece, set[tuple]]):
        all_moves_flat = []
        for piece, moves in legal_moves.items():
            for move in moves:
                all_moves_flat.append((piece, move))

        def get_move_score(move_tuple):
            piece, move = move_tuple
            score = 0
            temp_board = copy.deepcopy(board)
            temp_piece = temp_board.get_piece(piece.row, piece.col)
            temp_board.make_move(temp_piece, move[0], move[1])
            if temp_board.is_check(temp_board.to_move): score += 100
            if isinstance(piece, Queen):
                dist_before = manhattan_distance((piece.row, piece.col), (board.black_king.row, board.black_king.col))
                dist_after = manhattan_distance((move[0], move[1]), (board.black_king.row, board.black_king.col))
                if dist_after < dist_before: score += 10
            return score
        return sorted(all_moves_flat, key=get_move_score, reverse=True)

    def find_best_move(self, board: Board) -> tuple[tuple[Piece, tuple[int, int]], int, dict] | None:
        self.move_count = 0
        best_move = None
        is_maximizing = board.to_move == 'white'
        best_value = -float('inf') if is_maximizing else float('inf')
        legal_moves = board.get_all_legal_moves(board.to_move)
        if not legal_moves:
            return None
        sorted_moves = self.order_moves(board, legal_moves)
        for piece, move in sorted_moves:
            temp_board = copy.deepcopy(board)
            piece_on_temp_board = temp_board.get_piece(piece.row, piece.col)
            temp_board.make_move(piece_on_temp_board, move[0], move[1])
            board_value = self.minimax(
                temp_board, self.search_depth - 1, -float('inf'), float('inf'),
                is_maximizing_player=(temp_board.to_move == 'white'),
                history=set(board.move_history)
            )
            if is_maximizing:
                if board_value > best_value:
                    best_value = board_value
                    best_move = (piece, move)
            else:
                if board_value < best_value:
                    best_value = board_value
                    best_move = (piece, move)
        
        analysis = {
            "evaluation": best_value,
            "nodes_visited": self.move_count,
            "search_depth": self.search_depth
        }
        return best_move, best_value, analysis

    def minimax(self, board: Board, depth: int, alpha: float, beta: float, is_maximizing_player: bool, history: set):
        self.move_count += 1
        current_fen = board.to_fen()
        if current_fen in history: return 0
        if board.is_checkmate(board.to_move): return -MATE_SCORE - depth if is_maximizing_player else MATE_SCORE + depth
        if board.is_stalemate(board.to_move): return 0
        if depth == 0: return self.evaluator.evaluate(board)
        legal_moves = board.get_all_legal_moves(board.to_move)
        sorted_moves = self.order_moves(board, legal_moves)
        new_history = history.copy()
        new_history.add(current_fen)
        if is_maximizing_player:
            max_eval = -float('inf')
            for piece, move in sorted_moves:
                temp_board = copy.deepcopy(board)
                piece_on_temp_board = temp_board.get_piece(piece.row, piece.col)
                temp_board.make_move(piece_on_temp_board, move[0], move[1])
                eval_score = self.minimax(temp_board, depth - 1, alpha, beta, False, new_history)
                max_eval = max(max_eval, eval_score)
                alpha = max(alpha, eval_score)
                if beta <= alpha: break
            return max_eval
        else:
            min_eval = float('inf')
            for piece, move in sorted_moves:
                temp_board = copy.deepcopy(board)
                piece_on_temp_board = temp_board.get_piece(piece.row, piece.col)
                temp_board.make_move(piece_on_temp_board, move[0], move[1])
                eval_score = self.minimax(temp_board, depth - 1, alpha, beta, True, new_history)
                min_eval = min(min_eval, eval_score)
                beta = min(beta, eval_score)
                if beta <= alpha: break
            return min_eval


