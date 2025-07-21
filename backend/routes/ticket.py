from models.database import Ticket
from flask import Flask, request, jsonify, Blueprint

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
    time = data.get('Time')
    title = data.get('title')

    print(seats,time,title)
    return jsonify({
        "seats": seats
    })