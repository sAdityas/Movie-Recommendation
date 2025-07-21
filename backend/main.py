from flask import Flask
from flask_cors import CORS

from models import db

from routes.ticket import tkt
from routes.get_movie import get_movie_route
from routes.recommend import recommend_route
from routes.now_playing import now_playing_route

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///main.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)


app.register_blueprint(get_movie_route)
app.register_blueprint(recommend_route)
app.register_blueprint(now_playing_route)
app.register_blueprint(tkt, url_prefix='/tkt')


@app.before_request
def create_tables():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
