from models import db
import random

class Ticket(db.Model):
    __tablename__ = 'ticket'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    bookingId = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    time = db.Column(db.String(255), nullable=False)
    seats = db.Column(db.PickleType, nullable=False)

    def to_dict(self):
        return  {
            "id" : self.id,
            "title" : self.title,
            "time" : self.time,
            "seats" : self.seats
        }
        
    
