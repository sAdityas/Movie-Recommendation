from models.users import User
from models import db
from flask import Flask, request, jsonify, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash

user = Blueprint('user', __name__)

@user.route('/')
def fetchAll():
    users = User.query.all()
    return jsonify({
        'user': [user.to_dict() for user in users]
    })

@user.route('/create', methods=["POST"])
def create():
    data = request.get_json()
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    email = data.get('email')
    passwd = data.get('passwd')

    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        return jsonify({"error": "User Already Exists with this Email Id"}), 400

    hashed_password = generate_password_hash(passwd)

    new_user = User(
        firstname=firstname,
        lastname=lastname,
        email=email,
        passwd=hashed_password,
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify({'success': "User Created Successfully"}), 200


@user.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    passwd = data.get('passwd')
    print('Got Password: ',passwd)
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({'error': 'Email Id Invalid'}), 404

    if check_password_hash(user.passwd, passwd):
        print(user.id)
        return jsonify({'success': 'Login Successful', 'id' : f"{user.id}"}), 200
    else:
        return jsonify({'error': 'Wrong Password Entered'}), 401


