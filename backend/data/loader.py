import requests
import pandas as pd
from config import TMDB_API_KEY

def fetch_movies(pages=10):
    movies = []
    for page in range(1, pages + 1):
        url = f"https://api.themoviedb.org/3/discover/movie?api_key={TMDB_API_KEY}&sort_by=popularity.desc&page={page}"
        response = requests.get(url)
        data = response.json()
        for movie in data.get("results", []):
            movies.append({
                "title": movie.get("title"),
                "overview": movie.get("overview", ""),
                "id": movie.get("id"),
                "genre_ids": movie.get("genre_ids", [])
            })
    return pd.DataFrame(movies)


