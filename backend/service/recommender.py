from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def build_recommender(data):
    tfidf = TfidfVectorizer(stop_words='english')
    data['overview'] = data['overview'].fillna('')
    tfidf_matrix = tfidf.fit_transform(data['overview'])
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    return tfidf_matrix, cosine_sim

def recommend(title, data, cosine_sim, top_n=5):
    try:
        idx_list = data[data['title'].str.lower().str.strip() == title.lower().strip()].index
        if len(idx_list) == 0:
            # Try partial match as fallback
            idx_list = data[data['title'].str.lower().str.contains(title.lower().strip())].index

        if len(idx_list) == 0:
            return []
        idx = idx_list[0]

            
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        top_indices = [i[0] for i in sim_scores[1:top_n + 1]]
        return data['title'].iloc[top_indices].tolist()
    except IndexError:
        return []
