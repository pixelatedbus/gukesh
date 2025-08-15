from abc import ABC, abstractmethod

class Piece(ABC):
    def __init__(self, color, piece_type, row, col):
        self.color = color
        self.piece_type = piece_type
        self.row = row
        self.col = col

    def __repr__(self):
        return f"{self.color[0]}{self.piece_type[0]}"

    @abstractmethod
    def generate_possible_moves(self, board: 'Board') -> set[tuple]:
        pass

class King(Piece):
    def __init__(self, color, row, col):
        super().__init__(color, "king", row, col)

    def generate_possible_moves(self, board_instance: 'Board') -> set[tuple]:
        possible_moves = set()
        directions = [
            (-1, -1), (-1, 0), (-1, 1), (0, -1),
            (0, 1), (1, -1), (1, 0), (1, 1)
        ]
        for dr, dc in directions:
            new_row, new_col = self.row + dr, self.col + dc
            if 0 <= new_row < 8 and 0 <= new_col < 8:
                target_piece = board_instance.get_piece(new_row, new_col)
                if target_piece is None or target_piece.color != self.color:
                    possible_moves.add((new_row, new_col))
        return possible_moves

class Pawn(Piece):
    def __init__(self, color, row, col):
        super().__init__(color, "pawn", row, col)

    def generate_possible_moves(self, board_instance: 'Board') -> set[tuple]:
        possible_moves = set()
        direction = -1
        one_step_row, one_step_col = self.row + direction, self.col
        if 0 <= one_step_row < 8 and board_instance.get_piece(one_step_row, one_step_col) is None:
            possible_moves.add((one_step_row, one_step_col))
            if self.row == 6:
                two_steps_row = self.row + 2 * direction
                if board_instance.get_piece(two_steps_row, self.col) is None:
                    possible_moves.add((two_steps_row, self.col))
        return possible_moves

    def generate_attack_moves(self) -> set[tuple]:
        attack_moves = set()
        direction = -1
        attack_cols = [self.col - 1, self.col + 1]
        for attack_col in attack_cols:
            if 0 <= attack_col < 8:
                attack_moves.add((self.row + direction, attack_col))
        return attack_moves

class Queen(Piece):
    def __init__(self, color, row, col):
        super().__init__(color, "queen", row, col)

    def generate_possible_moves(self, board_instance: 'Board') -> set[tuple]:
        possible_moves = set()
        directions = [
            (-1, -1), (-1, 0), (-1, 1), (0, -1),
            (0, 1), (1, -1), (1, 0), (1, 1)
        ]
        for dr, dc in directions:
            for i in range(1, 8):
                new_row, new_col = self.row + i * dr, self.col + i * dc
                if not (0 <= new_row < 8 and 0 <= new_col < 8):
                    break
                target = board_instance.get_piece(new_row, new_col)
                if target is None:
                    possible_moves.add((new_row, new_col))
                elif target.color != self.color:
                    possible_moves.add((new_row, new_col))
                    break
                else:
                    break
        return possible_moves

    def generate_attack_squares(self, board_instance: 'Board') -> set[tuple]:
        attack_squares = set()
        directions = [
            (-1, -1), (-1, 0), (-1, 1), (0, -1),
            (0, 1), (1, -1), (1, 0), (1, 1)
        ]
        for dr, dc in directions:
            for i in range(1, 8):
                new_row, new_col = self.row + i * dr, self.col + i * dc
                if not (0 <= new_row < 8 and 0 <= new_col < 8):
                    break
                
                attack_squares.add((new_row, new_col))
                
                # The attack ray stops only when it hits ANY piece (friend or foe).
                target = board_instance.get_piece(new_row, new_col)
                if target is not None:
                    break
        return attack_squares