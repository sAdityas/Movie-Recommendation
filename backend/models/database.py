from models import db
import random

class Ticket(db.Model):
    __tablename__ = 'ticket'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    bookingId = db.Column(db.String(255), nullable=False)
    userid = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    time = db.Column(db.String(255), nullable=False)
    seats = db.Column(db.PickleType, nullable=False)
    price = db.Column(db.Integer,nullable=False)

    user = db.relationship('User',back_populates='tickets')

    def to_dict(self):
        return  {
            "id" : self.id,
            "title" : self.title,
            "time" : self.time,
            "seats" : self.seats,
            "userid" : self.userid,
            'price' : self.price,
            'bookingId' : self.bookingId
        }
        
    
