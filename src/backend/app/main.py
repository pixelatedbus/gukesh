from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal
from .game import Game
import os

app = FastAPI()

allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
origins = [origin.strip() for origin in allowed_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["GET", "POST", "OPTIONS"],
)

game = Game()

class SetupRequest(BaseModel):
    white_king_pos: str
    white_pawn_pos: str
    black_king_pos: str
    ai_depth: int = 5
    algorithm: Literal['minimax', 'greedy'] = 'minimax'

class FileSetupRequest(BaseModel):
    ai_depth: int = 5
    algorithm: Literal['minimax', 'greedy'] = 'minimax'

class MoveRequest(BaseModel):
    start_row: int
    start_col: int
    end_row: int
    end_col: int

class PlaybackRequest(BaseModel):
    command: str

# --- API Endpoints ---
@app.post("/api/setup")
def setup_game_endpoint(req: SetupRequest):
    return game.setup_game_from_positions(
        req.white_king_pos, req.white_pawn_pos, req.black_king_pos, 
        req.ai_depth, req.algorithm
    )

@app.post("/api/setup_from_file")
async def setup_from_file_endpoint(file: UploadFile = File(...), ai_depth: int = 5, algorithm: str = 'minimax'):
    text_content = await file.read()
    return game.setup_game_from_text(text_content.decode("utf-8"), ai_depth, algorithm)

@app.get("/api/setup_random")
def setup_random_endpoint(ai_depth: int = 5, algorithm: str = 'minimax'):
    return game.setup_game_random(ai_depth, algorithm)

@app.get("/api/state")
def get_state_endpoint():
    return game.get_game_state()

@app.post("/api/player_move")
def player_move_endpoint(req: MoveRequest):
    start_coords = (req.start_row, req.start_col)
    end_coords = (req.end_row, req.end_col)
    return game.handle_player_move(start_coords, end_coords)

@app.get("/api/ai_move")
def ai_move_endpoint():
    return game.request_ai_move()

@app.post("/api/playback")
def playback_endpoint(req: PlaybackRequest):
    return game.handle_playback(req.command)
