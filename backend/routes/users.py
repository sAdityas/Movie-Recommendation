from models.users import User
from models import db
from flask import Flask, request, jsonify, Blueprint

user = Blueprint('user',__name__)

@user.route('/')
def fetchAll():
    users = User.query.all()
    return jsonify({
        'user' : user.to_dict for user in users
    })

@user.route('/create', methods={"POST"})
def create():
    data = request.get_json()
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    email = data.get('email')
    passwd = data.get('passwd')

    users = User.query.filter_by(email = email).first()

    if users.email == email:
        return jsonify({
            "error" : "User Already Exists with this Email Id"
        }) , 400
    new_user = User(
        firstname = firstname,
        lastname = lastname,
        email = email,
        passwd = passwd,
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify({
        'success' : "User Created Successfully"
    }) , 200


@user.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    passwd = data.get('passwd')

    print("USer", email, 'password', passwd)
    users = User.query.filter_by(email=email).first()

    if users.email == email and users.passwd != passwd:
        return jsonify({
            'error' : 'Wrong Password Entered'
        }), 500
    elif users.email != email:
        return jsonify({
            'error': 'Email Id Invalid'
        }), 500
    elif users.email != email and users.passwd != passwd:
        return jsonify({
            'error' : 'Invalid Credentials'
        }), 500
    
    return jsonify({
        'success' : 'Login Successful'
    }),200

