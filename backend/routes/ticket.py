from models.database import Ticket
from flask import Flask, request, jsonify, Blueprint
import random , string

tkt = Blueprint('tkt',__name__)

@tkt.route('/')
def main_route():
    ticket = Ticket.query.all()
    return jsonify({
        "data" : [tkt.to_dict() for tkt in ticket] 
    })

@tkt.route('/add', methods=["POST"])
def add_route():
    data = request.get_json()
    seats = data.get('seats')
    time = data.get('time')
    title = data.get('title')
    bookingId = data.get('bookingId')

    print(seats,time,title,bookingId)
    return jsonify({
        "seats": seats
    })