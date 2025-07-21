import os
from dotenv import load_dotenv

load_dotenv()
TMDB_API_KEY = os.getenv("IMDB_API_KEY")
