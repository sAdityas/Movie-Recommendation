from flask import Blueprint, jsonify
import requests
from config import TMDB_API_KEY

now_playing_route = Blueprint("now_playing", __name__)
image_base = "https://image.tmdb.org/t/p/w500"

prices = [299,399,499,599,250,150,600,200]

@now_playing_route.route("/nowPlaying", methods=["GET"])
def now_playing():
    base_url = "https://api.themoviedb.org/3/discover/movie"
    hindiURL = f"{base_url}?api_key={TMDB_API_KEY}&region=IN&with_original_language=hi&with_release_type=2"
    englishURL = f"{base_url}?api_key={TMDB_API_KEY}&region=IN&with_original_language=en&with_release_type=2"

    def process(movies):

        return [{
            "id": m.get("id"),
            "title": m.get("title"),
            "overview": m.get("overview"),
            "release_date": m.get("release_date"),
            "language": (
            'hindi' if m.get('original_language') == 'hi' else
            'english' if m.get('original_language') == 'en' else
            m.get('original_language')
            ),
            "poster_path": f"{image_base}{m.get('poster_path')}" if m.get('poster_path') else None,
            "vote_average" : m.get('vote_average',0.0)

        } for m in movies[:10]]

    hindi_movies = requests.get(hindiURL).json().get('results', [])
    english_movies = requests.get(englishURL).json().get('results', [])
    combined = process(hindi_movies) + process(english_movies)

    return jsonify({'now_playing': combined})


