from flask import Blueprint, request, jsonify
import requests
from service.tmdb_service import get_movie_by_imdb
from service.recommender import build_recommender , recommend
from config import TMDB_API_KEY

recommend_route = Blueprint("recommend", __name__)

import data.loader as loader
movie_df = loader.fetch_movies(pages=10)
tfidf_matrix, cosine_sim = build_recommender(movie_df)


@recommend_route.route("/recommend", methods=["GET"])
def get_recommendations():
    imdb_id = request.args.get("id")
    if not imdb_id:
        return jsonify({'error': 'Missing IMDb ID'}), 400

    movie = get_movie_by_imdb(imdb_id)
    if not movie:
        return jsonify({'error': 'Movie not found'}), 404

    title = movie.get('title') or movie.get('name')
    if not title:
        return jsonify({'error': 'No title found'}), 404

    recs = recommend(title, movie_df, cosine_sim)
    detailed_recs = []
    for rec_title in recs:
        search_url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={rec_title}"
        search_response = requests.get(search_url).json()
        results = search_response.get('results', [])
        if results:
            detailed_recs.append(results[0])    # or shape this data as you like
    return jsonify({
        'input_title': title,
        'recommendations': detailed_recs
    })


