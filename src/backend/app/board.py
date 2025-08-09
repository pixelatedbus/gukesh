import copy
import random
from .piece import Piece, King, Pawn, Queen

class Board:
    def __init__(self):
        self.grid = [[None for _ in range(8)] for _ in range(8)]
        self.to_move = 'black'
        self.white_king: King = None
        self.white_piece: Piece = None
        self.black_king: King = None
        self.move_history = []

    @classmethod
    def from_text(cls, text_input: str):
        board = cls()
        lines = text_input.strip().split('\n')
        if len(lines) != 3:
            raise ValueError("Input must have exactly three lines.")
        
        wk_pos, wp_pos, bk_pos = lines
        board.place_piece(King('white', *board._notation_to_coords(wk_pos)))
        board.place_piece(Pawn('white', *board._notation_to_coords(wp_pos)))
        board.place_piece(King('black', *board._notation_to_coords(bk_pos)))
        board.move_history.append(board.to_fen())
        return board

    @classmethod
    def from_random(cls):
        board = cls()
        while True:
            # Generate random coordinates for all pieces
            all_coords = random.sample(range(64), 3)
            wk_coords = (all_coords[0] // 8, all_coords[0] % 8)
            bk_coords = (all_coords[1] // 8, all_coords[1] % 8)
            # Ensure pawn is not on the first or last rank
            pawn_coords = (random.randint(1, 6), random.randint(0, 7))

            # Check if kings are not adjacent
            if abs(wk_coords[0] - bk_coords[0]) > 1 or abs(wk_coords[1] - bk_coords[1]) > 1:
                break # Valid position found
        
        board.place_piece(King('white', *wk_coords))
        board.place_piece(Pawn('white', *pawn_coords))
        board.place_piece(King('black', *bk_coords))
        board.move_history.append(board.to_fen())
        return board

    def place_piece(self, piece: Piece):
        self.grid[piece.row][piece.col] = piece
        if isinstance(piece, King):
            if piece.color == 'white':
                self.white_king = piece
            else:
                self.black_king = piece
        else:
            self.white_piece = piece

    def get_piece(self, row: int, col: int) -> Piece | None:
        return self.grid[row][col]

    def make_move(self, piece: Piece, new_row: int, new_col: int):
        old_row, old_col = piece.row, piece.col
        self.grid[old_row][old_col] = None
        if self.get_piece(new_row, new_col) is not None:
            self.white_piece = None
        self.grid[new_row][new_col] = piece
        piece.row, piece.col = new_row, new_col
        if isinstance(piece, Pawn) and piece.row == 0:
            promoted_queen = Queen('white', new_row, new_col)
            self.grid[new_row][new_col] = promoted_queen
            self.white_piece = promoted_queen
        self.to_move = 'white' if self.to_move == 'black' else 'black'
        self.move_history.append(self.to_fen())

    def get_all_attacked_squares(self, by_color: str) -> set[tuple]:
        attacked_squares = set()
        for r in range(8):
            for c in range(8):
                piece = self.get_piece(r, c)
                if piece and piece.color == by_color:
                    if isinstance(piece, King):
                        for dr in [-1, 0, 1]:
                            for dc in [-1, 0, 1]:
                                if dr == 0 and dc == 0: continue
                                attacked_squares.add((piece.row + dr, piece.col + dc))
                    elif isinstance(piece, Pawn):
                        attacked_squares.update(piece.generate_attack_moves())
                    elif isinstance(piece, Queen):
                        attacked_squares.update(piece.generate_attack_squares(self))
                    else:
                        attacked_squares.update(piece.generate_possible_moves(self))
        return attacked_squares

    def get_legal_moves_for_piece(self, piece: Piece) -> set[tuple]:
        possible_moves = piece.generate_possible_moves(self)
        legal_moves = set()

        for move in possible_moves:
            target_row, target_col = move
            start_row, start_col = piece.row, piece.col
            
            piece_on_target_square = self.grid[target_row][target_col]
            original_white_piece_ref = self.white_piece
            
            self.grid[target_row][target_col] = piece
            self.grid[start_row][start_col] = None
            piece.row, piece.col = target_row, target_col
            
            if piece_on_target_square and piece_on_target_square.color == 'white':
                self.white_piece = None

            if not self.is_check(piece.color):
                legal_moves.add(move)
                
            self.grid[start_row][start_col] = piece
            self.grid[target_row][target_col] = piece_on_target_square
            piece.row, piece.col = start_row, start_col
            self.white_piece = original_white_piece_ref

        return legal_moves

    def get_all_legal_moves(self, for_color: str) -> dict[Piece, set[tuple]]:
        all_moves = {}
        for r in range(8):
            for c in range(8):
                piece = self.get_piece(r,c)
                if piece and piece.color == for_color:
                    moves = self.get_legal_moves_for_piece(piece)
                    if moves:
                        all_moves[piece] = moves
        return all_moves
    
    def is_check(self, color: str) -> bool:
        king = self.white_king if color == 'white' else self.black_king
        opponent_color = 'black' if color == 'white' else 'white'
        attacked_squares = self.get_all_attacked_squares(opponent_color)
        return (king.row, king.col) in attacked_squares

    def is_checkmate(self, color: str) -> bool:
        return self.is_check(color) and not self.get_all_legal_moves(color)

    def is_stalemate(self, color: str) -> bool:
        return not self.is_check(color) and not self.get_all_legal_moves(color)
    
    def undo_move(self):
        """BONUS 4: Reverts the board to the previous state."""
        if len(self.move_history) > 1:
            self.move_history.pop()
            last_fen = self.move_history[-1]
            self.load_from_fen(last_fen)
            self.to_move = 'white' if self.to_move == 'black' else 'black'
            return True
        return False

    def to_fen(self) -> str:
        fen = ""
        for r in range(8):
            empty_count = 0
            for c in range(8):
                piece = self.grid[r][c]
                if piece:
                    if empty_count > 0: fen += str(empty_count)
                    empty_count = 0
                    p_char = piece.piece_type[0]
                    fen += p_char.upper() if piece.color == 'white' else p_char.lower()
                else:
                    empty_count += 1
            if empty_count > 0: fen += str(empty_count)
            if r < 7: fen += '/'
        return fen

    def load_from_fen(self, fen: str):
        self.grid = [[None for _ in range(8)] for _ in range(8)]
        rows = fen.split('/')
        for r, row_str in enumerate(rows):
            c = 0
            for char in row_str:
                if char.isdigit():
                    c += int(char)
                else:
                    color = 'white' if char.isupper() else 'black'
                    ptype = char.lower()
                    piece = None
                    if ptype == 'k': piece = King(color, r, c)
                    elif ptype == 'p': piece = Pawn(color, r, c)
                    elif ptype == 'q': piece = Queen(color, r, c)
                    if piece: self.place_piece(piece)
                    c += 1

    def _notation_to_coords(self, alg_notation: str) -> tuple[int, int]:
        col = ord(alg_notation[0]) - ord('a')
        row = 8 - int(alg_notation[1])
        return row, col
