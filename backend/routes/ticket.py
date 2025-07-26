from models.database import Ticket, db
from flask import request, jsonify, Blueprint

tkt = Blueprint('tkt',__name__)

@tkt.route('/')
def main_route():
    tickets = Ticket.query.all()
    return jsonify({
        "data": [ticket.to_dict() for ticket in tickets]
    })


@tkt.route('/add', methods=["POST"])
def add_route():
    data = request.get_json()
    seats = data.get('seats')
    time = data.get('time')
    title = data.get('title')
    bookingId = data.get('bookingId')
    price = data.get('price')
    userid = data.get('userid')

    tkt = Ticket(
        title=title,
        time=time,
        seats=seats,
        bookingId = bookingId,
        userid = userid,
        price = price,
    )
    db.session.add(tkt)
    db.session.commit()
    print(seats,time,title,bookingId,price,userid)
    return jsonify({
        "seats": seats,
        "price" : price
    })


@tkt.route("/seat", methods=["POST"])
def get_seat():
    data = request.get_json()
    title = data.get('title')
    time = data.get('time')

    if not title or not time:
        return jsonify({"error": "Missing title or time"}), 400

    # Filter tickets by title and time
    tickets = Ticket.query.filter_by(title=title, time=time).all()

    all_seats = []
    for ticket in tickets:
        if ticket.seats:
            all_seats.extend(ticket.seats)  # PickleType field is already a list

    print("Disabled seats for", title, "at", time, "=>", all_seats)

    return jsonify({
        'seats': all_seats
    })



@tkt.route('/finalize/<int:userid>', methods=['GET'])
def finalize(userid):    # Query all tickets for user_id
    tickets = Ticket.query.filter_by(userid=userid).all()

    if not tickets:
        return jsonify({"error": "No tickets found for user"}), 404

    # Convert list of tickets to list of dicts
    tickets_data = [ticket.to_dict() for ticket in tickets]

    return jsonify({
        "data": tickets_data
    })



