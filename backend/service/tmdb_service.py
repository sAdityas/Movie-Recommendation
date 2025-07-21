import requests
from config import TMDB_API_KEY

def get_movie_by_imdb(imdb_id):
    url = f"https://api.themoviedb.org/3/find/{imdb_id}?api_key={TMDB_API_KEY}&external_source=imdb_id"
    data = requests.get(url).json()
    results = data.get('movie_results') or data.get('tv_results')
    return results[0] if results else None

def get_movie_by_tmdb(tmdb_id):
    url = f"https://api.themoviedb.org/3/movie/{tmdb_id}?api_key={TMDB_API_KEY}"
    data = requests.get(url).json()
    return data if data.get('id') else None
