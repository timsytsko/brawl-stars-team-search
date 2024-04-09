from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy
import random

import brawl_stars_api

app = Flask(__name__)
db_name = 'db.db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_name
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), nullable=False)
    password = db.Column(db.String(30), nullable=False)
    brawl_stars_tag = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return '<User %r>' % self.id

class Session(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    token = db.Column(db.String(30), nullable=False)

    def __repr__(self):
        return '<Session %r>' % self.id

@app.route('/register_user', methods=['POST'])
def register_user():
    def validate_password(password):
        if len(password) < 5 or len(password) > 25:
            return False
        return True
    def validate_username(username):
        if len(username) < 1 or len(username) > 25:
            return False
        return True
    def check_if_username_exists(username):
        users = User.query.filter_by(username=username).all()
        return len(users) > 0
    rec_data = request.json
    if rec_data['terms_of_service'] == False:
        data = {
            'error': 'terms of services not agreed'
        }
        return jsonify(data), 400
    if rec_data['password'] != rec_data['password_repetition']:
        data = {
            'error': 'passwords do not match'
        }
        return jsonify(data), 400
    if validate_password(rec_data['password']) == False:
        data = {
            'error': 'password does not meet the requirements'
        }
        return jsonify(data), 400
    if validate_username(rec_data['username']) == False:
        data = {
            'error': 'username does not meet the requirements'
        }
        return jsonify(data), 400
    if check_if_username_exists(rec_data['username']) == True:
        data = {
            'error': 'username exists'
        }
        return jsonify(data), 400
    if brawl_stars_api.validate_player_tag(rec_data['brawl_stars_tag']) == False:
        data = {
            'error': 'brawl stars tag is invalid'
        }
        return jsonify(data), 400
    user = User(username=rec_data['username'], password=rec_data['password'], brawl_stars_tag=rec_data['brawl_stars_tag'])
    db.session.add(user)
    db.session.commit()
    return jsonify({}), 200

@app.route('/login_user', methods=['POST'])
def login_user():
    def get_id_by_username(username):
        user = User.query.filter_by(username=username).first()
        if user is None:
            return None
        else:
            return user.id
    def check_if_username_exists(username):
        users = User.query.filter_by(username=username).all()
        return len(users) > 0
    def check_password(username, password):
        user = User.query.filter_by(username=username).first()
        return password == user.password
    def generate_token():
        res = ''
        for i in range(30):
            res += chr(random.randint(33, 125))
        return res
    rec_data = request.json
    if rec_data['terms_of_service'] == False:
        data = {
            'error': 'terms of services not agreed'
        }
        return jsonify(data), 400
    if not check_if_username_exists(rec_data['username']):
        data = {
            'error': 'username not found'
        }
        return jsonify(data), 400
    if not check_password(rec_data['username'], rec_data['password']):
        data = {
            'error': 'incorrect pasword'
        }
        return jsonify(data), 400
    user_id = get_id_by_username(rec_data['username'])
    sessions = Session.query.filter_by(user_id=user_id).all()
    if len(sessions) > 0:
        for session in sessions:
            db.session.delete(session)
        db.session.commit()
    token = generate_token()
    session = Session(user_id=user_id, token=token)
    db.session.add(session)
    db.session.commit()
    data = {
        'token': token,
        'user_id': user_id
    }
    return jsonify(data), 200

@app.route('/check_token', methods=['POST'])
def check_token():
    rec_data = request.json
    session = Session.query.filter_by(user_id=rec_data['user_id']).first()
    if session is None:
        return jsonify({}), 403
    if rec_data['token'] == session.token:
        user = User.query.filter_by(id=rec_data['user_id']).first()
        return jsonify({'username': user.username}), 200
    else:
        return jsonify({}), 403

@app.route('/get_user_stats', methods=['POST'])
def get_user_stats():
    rec_data = request.json
    def check_token_(user_id, token):
        session = Session.query.filter_by(user_id=user_id).first()
        if session is None:
            return False
        if token == session.token:
            return True
        else:
            return False
    if not check_token_(rec_data['user_id'], rec_data['token']):
        return jsonify({}), 403
    user = User.query.get(rec_data['user_id'])
    stats = brawl_stars_api.get_stats_by_tag(user.brawl_stars_tag)
    return jsonify(stats), 200

@app.route('/user/<username>/<brawler>')
def page_user_brawlers(username, brawler):
    return render_template('user-brawler.html')

@app.route('/user/<username>')
def page_user(username):
    return render_template('user.html')

@app.route("/login")
def page_login():
    return render_template('login.html')

@app.route("/signup")
def page_signup():
    return render_template('signup.html')

@app.route("/")
def page_home():
    return render_template('home.html')

if __name__ == '__main__':
    app.run(debug=True)