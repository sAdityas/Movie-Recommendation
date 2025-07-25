from models import db


class User(db.Model):

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    firstname = db.Column(db.String(255), nullable=False)
    lastname = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    passwd = db.Column(db.String(255), nullable=False)

    tickets = db.relationship('Ticket',back_populates='user',cascade='all,delete-orphan')
