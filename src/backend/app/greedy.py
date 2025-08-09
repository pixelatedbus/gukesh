# greedy.py
import copy
import random
from .board import Board
from .piece import Piece, Queen, King, Pawn
from .minimax import manhattan_distance

class GreedySolver:
    
    def find_best_move(self, board: Board) -> tuple[tuple[Piece, tuple[int, int]], int, dict] | None:
        legal_moves = board.get_all_legal_moves(board.to_move)
        if not legal_moves:
            return None

        move, reason = self._find_checkmate_move(board, legal_moves)
        if move:
            return move, 10000, {"decision_rule": reason}

        move, reason = self._find_queen_boxing_move(board, legal_moves)
        if move:
            return move, 50, {"decision_rule": reason}

        move, reason = self._find_pawn_defense_move(board, legal_moves)
        if move:
            return move, 20, {"decision_rule": reason}

        move, reason = self._find_safe_pawn_push_move(board, legal_moves)
        if move:
            return move, 10, {"decision_rule": reason}

        move, reason = self._find_safe_checking_move(board, legal_moves)
        if move:
            return move, 5, {"decision_rule": reason}

        move, reason = self._find_king_restriction_move(board, legal_moves)
        if move:
            return move, 4, {"decision_rule": reason}

        move, reason = self._find_random_move(legal_moves)
        return move, 0, {"decision_rule": reason}

    def _find_checkmate_move(self, board, legal_moves):
        for piece, moves in legal_moves.items():
            for move in moves:
                temp_board = copy.deepcopy(board)
                temp_piece = temp_board.get_piece(piece.row, piece.col)
                temp_board.make_move(temp_piece, move[0], move[1])
                if temp_board.is_checkmate(temp_board.to_move):
                    return (piece, move), "Forced Checkmate"
        return None, None

    def _find_queen_boxing_move(self, board, legal_moves):
        if not isinstance(board.white_piece, Queen):
            return None, None

        bk_pos = (board.black_king.row, board.black_king.col)
        queen_moves = legal_moves.get(board.white_piece, set())

        for move in queen_moves:
            # Check if the move destination is a knight's move away from the black king
            row_dist = abs(move[0] - bk_pos[0])
            col_dist = abs(move[1] - bk_pos[1])
            if (row_dist == 2 and col_dist == 1) or (row_dist == 1 and col_dist == 2):
                return (board.white_piece, move), "Queen Boxing Technique"
        return None, None

    def _find_pawn_defense_move(self, board, legal_moves):
        if not isinstance(board.white_piece, Pawn):
            return None, None

        pawn_pos = (board.white_piece.row, board.white_piece.col)
        attacked_by_black = board.get_all_attacked_squares('black')

        if pawn_pos in attacked_by_black:
            king_moves = legal_moves.get(board.white_king, set())
            for move in king_moves:
                if abs(move[0] - pawn_pos[0]) <= 1 and abs(move[1] - pawn_pos[1]) <= 1:
                    return (board.white_king, move), "Defend Pawn with King"
        return None, None

    def _find_safe_pawn_push_move(self, board, legal_moves):
        best_pawn_move = None
        best_row = 8 
        attacked_by_black = board.get_all_attacked_squares('black')

        for piece, moves in legal_moves.items():
            if isinstance(piece, Pawn):
                for move in moves:
                    if move not in attacked_by_black:
                        if move[0] < best_row:
                            best_row = move[0]
                            best_pawn_move = (piece, move)
        
        if best_pawn_move:
            return best_pawn_move, "Safely Advance Pawn"
        return None, None

    def _find_safe_checking_move(self, board, legal_moves):
        for piece, moves in legal_moves.items():
            for move in moves:
                temp_board = copy.deepcopy(board)
                temp_piece = temp_board.get_piece(piece.row, piece.col)
                temp_board.make_move(temp_piece, move[0], move[1])
                if temp_board.is_check(temp_board.to_move):
                    # Check if the opponent can just capture the checking piece
                    opponent_moves = temp_board.get_all_legal_moves(temp_board.to_move)
                    can_be_captured = False
                    for opp_piece, opp_moves in opponent_moves.items():
                        if (move[0], move[1]) in opp_moves:
                            can_be_captured = True
                            break
                    if not can_be_captured:
                        return (piece, move), "Deliver Safe Check"
        return None, None

    def _find_king_restriction_move(self, board, legal_moves):
        best_move = None
        min_opponent_moves = float('inf')

        for piece, moves in legal_moves.items():
            for move in moves:
                temp_board = copy.deepcopy(board)
                temp_piece = temp_board.get_piece(piece.row, piece.col)
                temp_board.make_move(temp_piece, move[0], move[1])
                
                opponent_king_moves = temp_board.get_legal_moves_for_piece(temp_board.black_king)
                num_moves = len(opponent_king_moves)
                
                if num_moves < min_opponent_moves:
                    min_opponent_moves = num_moves
                    best_move = (piece, move)
        
        if best_move:
            return best_move, "Restrict Enemy King"
        return None, None
        
    def _find_random_move(self, legal_moves):
        random_piece = random.choice(list(legal_moves.keys()))
        random_move = random.choice(list(legal_moves[random_piece]))
        return (random_piece, random_move), "Fallback to Random Move"
