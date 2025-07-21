from flask import Blueprint, request, jsonify
from service.tmdb_service import get_movie_by_imdb, get_movie_by_tmdb

get_movie_route = Blueprint('get_movie', __name__)

@get_movie_route.route("/", methods=["GET"])
def get_movie():
    imdb_id = request.args.get('imdb_id')
    tmdb_id = request.args.get('tmdb_id')

    movie = get_movie_by_imdb(imdb_id) if imdb_id else get_movie_by_tmdb(tmdb_id)

    if not movie:
        return jsonify({"error": "Movie or TV Show Not Found"}), 400

    return jsonify({
        'title': movie.get('title') or movie.get('name'),
        'overview': movie.get('overview', 'N/A'),
        'release_date': movie.get('release_date') or movie.get('first_air_date'),
        'genre_ids': movie.get('genre_ids', []),
        'poster_path': movie.get('poster_path', ''),
        'backdrop_path': movie.get('backdrop_path', ''),
        'tmdb_id': movie.get('id'),
        'imdb_id': movie.get('imdb_id'),
        'language': movie.get('original_language', 'N/A'),
        'popularity': movie.get('popularity', 0.0),
        'vote_average': movie.get('vote_average', 0.0),
        'adult': movie.get('adult', False)
    })
