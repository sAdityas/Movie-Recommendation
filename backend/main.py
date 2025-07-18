from flask import Flask, request, jsonify
from dotenv import load_dotenv
import requests, os
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

load_dotenv()
TMDB_API_KEY = os.getenv("IMDB_API_KEY")
app = Flask(__name__)
CORS(app)




def fetch_movies(pages = 10):
    movies = []
    for page in range(1, pages + 1):
        url = f"https://api.themoviedb.org/3/discover/movie?api_key={TMDB_API_KEY}&sort_by=popularity.desc&page={page}"
        res = requests.get(url)
        data = res.json()

        for movie in data.get("results", []):
            movies.append({
                "title": movie.get("title"),
                "overview": movie.get("overview", ""),
                "id": movie.get("id"),
                "genre_ids": movie.get("genre_ids", [])
            })
    return pd.DataFrame(movies)

def build_recommender(data):
    tfidf = TfidfVectorizer(stop_words='english')
    data['overview'] = data['overview'].fillna('')
    tfidf_matrix = tfidf.fit_transform(data['overview'])
    cosine_sim = cosine_similarity(tfidf_matrix,tfidf_matrix)
    return cosine_sim

def recommend(title,data,cosine_sim,top_n=5):
    try:
        idx = data[data['title'].str.lower() == title.lower()].index[0]
    except IndexError:
        return []
    
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    top_indices = [i[0] for i in sim_scores[1:top_n+1]]
    return data['title'].iloc[top_indices].tolist()




movie_df = fetch_movies(pages=10)
cosine_sim = build_recommender(movie_df)
@app.route('/', methods=['GET'])
def get_movie_by_imdb():
    imdb_id = request.args.get('imdb_id')
    if not imdb_id:
        return jsonify({"error": "No IMDB ID Found."})

    url = f"https://api.themoviedb.org/3/find/{imdb_id}?api_key={TMDB_API_KEY}&external_source=imdb_id"
    response = requests.get(url)
    data = response.json()

    movie = None
    if data.get('movie_results'):
        movie = data['movie_results'][0]
    elif data.get('tv_results'):
        movie = data['tv_results'][0]

    if not movie:
        return jsonify({"error": "Movie or TV Show Not Found"}), 400
    else:
        return jsonify({
            'raw_data' : data,
            'title': movie.get('title') or movie.get('name', 'N/A'),
            'original_title': movie.get('original_title') or movie.get('original_name', 'N/A'),
            'overview': movie.get('overview', 'N/A'),
            'release_date': movie.get('release_date') or movie.get('first_air_date', 'N/A'),
            'genre_ids': movie.get('genre_ids', []),
            'poster_path': movie.get('poster_path', ''),
            'backdrop_path': movie.get('backdrop_path', ''),
            'tmdb_id': movie.get('id'),
            'original_language': movie.get('original_language', 'N/A'),
            'popularity': movie.get('popularity', 0.0),
            'vote_count': movie.get('vote_count', 0),
            'vote_average': movie.get('vote_average', 0.0),
            'video': movie.get('video', False),
            'adult': movie.get('adult', False)
        })
    


@app.route('/recommend', methods=['GET'])
def recommend_api():
    imdb_id = request.args.get('id')
    if not imdb_id:
        return jsonify({'error': 'Missing IMDb ID'}), 400

    # Step 1: Get movie title from TMDB using IMDb ID
    url = f"https://api.themoviedb.org/3/find/{imdb_id}?api_key={TMDB_API_KEY}&external_source=imdb_id"
    response = requests.get(url)
    data = response.json()

    movie = None
    if data.get('movie_results'):
        movie = data['movie_results'][0]
    elif data.get('tv_results'):
        movie = data['tv_results'][0]

    if not movie:
        return jsonify({"error": "Movie or TV Show Not Found"}), 404

    # Step 2: Use title for recommendation
    title = movie.get('title') or movie.get('name')
    if not title:
        return jsonify({"error": "Title not found from IMDb ID"}), 404

    recs = recommend(title, movie_df, cosine_sim)
    if not recs:
        return jsonify({'error': 'No similar movies found'}), 404
    
    recommendations = []

    for rec_title in recs:
        search_url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={rec_title}"
        search_response = requests.get(search_url).json()
        results =  search_response.get('results',[])
        if results:
            recommendations.append(results[0])

    print(recommendations )
    return jsonify({
        'input_title': title,
        'recommendations': recommendations
    }), 200



@app.route('/nowPlaying', methods=["GET"])
def nowPlaying():
    base_url = "https://api.themoviedb.org/3/discover/movie"
    image_base = "https://image.tmdb.org/t/p/w500"

    # Hindi and English URLs
    hindiURL = f"{base_url}?api_key={TMDB_API_KEY}&region=IN&with_original_language=hi&with_release_type=2"
    englishURL = f"{base_url}?api_key={TMDB_API_KEY}&region=IN&with_original_language=en&with_release_type=2"

    # Get responses
    hindi_movies = requests.get(hindiURL).json().get('results', [])
    english_movies = requests.get(englishURL).json().get('results', [])

    details = []

    def process_movie_list(movie_list):
        return [
            {
                "id": m.get("id"),
                "title": m.get("title"),
                "overview": m.get("overview"),
                "poster_path": f"{image_base}{m.get('poster_path')}" if m.get('poster_path') else None,
                "release_date": m.get("release_date"),
                "vote_average": m.get("vote_average"),
                "language": m.get("original_language")
            }
            for m in movie_list[:10]
        ]

    details.extend(process_movie_list(hindi_movies))
    details.extend(process_movie_list(english_movies))

    if not details:
        return jsonify({"error": "No movies found"}), 404

    return jsonify({"now_playing": details})


    

if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0")