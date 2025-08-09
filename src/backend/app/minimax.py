from .board import Board
from .piece import Queen

# Constants remain the same
MATE_SCORE = 10000
QUEEN_BONUS = 9000
PAWN_PROGRESSION_MULTIPLIER = 10
KING_DISTANCE_PENALTY = 5
OPPONENT_KING_DISTANCE_BONUS = 10
KING_CONTROL_BONUS = 50
OPPONENT_MOVE_RESTRICTION_PENALTY = 10
FORCE_KING_TO_EDGE_MULTIPLIER = 20
COORDINATED_ATTACK_PENALTY = 20
SHRINKING_BOX_BONUS = 2

def manhattan_distance(p1_coords, p2_coords):
    return abs(p1_coords[0] - p2_coords[0]) + abs(p1_coords[1] - p2_coords[1])

class StaticEvaluator:
    def evaluate(self, board: Board):
        if isinstance(board.white_piece, Queen):
            return QUEEN_BONUS + self.evaluate_kq_vs_k(board)
        elif not board.white_piece:
            return -MATE_SCORE
        else:
            return self.evaluate_kp_vs_k(board)

    def evaluate_kp_vs_k(self, board: Board):
        score = 0
        wk, wp, bk = board.white_king, board.white_piece, board.black_king
        score += (7 - wp.row) ** 2 * PAWN_PROGRESSION_MULTIPLIER
        score -= manhattan_distance((wk.row, wk.col), (wp.row, wp.col)) * KING_DISTANCE_PENALTY
        score += manhattan_distance((bk.row, bk.col), (wp.row, wp.col)) * OPPONENT_KING_DISTANCE_BONUS
        score -= manhattan_distance((wk.row, wk.col), (bk.row, bk.col)) * COORDINATED_ATTACK_PENALTY
        promotion_path_col = wp.col
        for r in range(wp.row - 1, 0, -1):
            if (wk.row, wk.col) == (r, promotion_path_col):
                score += KING_CONTROL_BONUS
                break
        score -= len(board.get_legal_moves_for_piece(bk)) * OPPONENT_MOVE_RESTRICTION_PENALTY
        return score

    def evaluate_kq_vs_k(self, board: Board):
        score = 0
        wk, wq, bk = board.white_king, board.white_piece, board.black_king
        center_dist_row = abs(bk.row - 3.5)
        center_dist_col = abs(bk.col - 3.5)
        score += (center_dist_row + center_dist_col) * FORCE_KING_TO_EDGE_MULTIPLIER
        score -= manhattan_distance((wk.row, wk.col), (bk.row, bk.col)) * COORDINATED_ATTACK_PENALTY
        score -= manhattan_distance((wq.row, wq.col), (bk.row, bk.col)) * (COORDINATED_ATTACK_PENALTY / 2)
        box_area = (7 - abs(wq.row - bk.row)) * (7 - abs(wq.col - bk.col))
        score -= box_area * SHRINKING_BOX_BONUS
        score -= len(board.get_legal_moves_for_piece(bk)) * OPPONENT_MOVE_RESTRICTION_PENALTY * 2
        return score
