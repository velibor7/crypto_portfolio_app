from flask import Flask, request, Response, jsonify, g
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from flask_socketio import send, emit
from flask_sse import sse
from flask_cors import cross_origin
# from flask_httpauth import HTTPBasicAuth
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager


from models import *
from cmp import *


jwt = JWTManager(app)

#!scheduler - works
# scheduler = BackgroundScheduler()
# scheduler.add_job(  func=calculate_all_portfolio_values, 
                    # trigger='interval', 
                    # seconds=60)
# scheduler.start()

@socketio.on("connect", namespace="/home")
def frontend_connection():
    print("Client is Connected")
    socketio.emit("connect", {"hello": "world"})

@socketio.on("disconnect", namespace="/home")
def frontend_disconnection():
    print("Client is Disconnected")

# @socketio.on("newdata", namespace="/home")
def send_updates():
    socketio.emit("newdata", {'msg': str(datetime.now())}, namespace='/home', broadcast=True)
    # print("i am executed now " + str(datetime.now()))

# scheduler = BackgroundScheduler()
# scheduler.add_job(  func=send_updates, 
                    # trigger='interval', 
                    # seconds=5)
# scheduler.start()

# probacu bez namespace




#! AUTH

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
        return response
    except (RuntimeError, KeyError):
        # no valid jwt, just return original res
        return response


@app.route('/token', methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email != "test" or password != "test":
        return {"msg": "Wrong email or password"}, 401

    access_token = create_access_token(identity=email)
    response = {"access_token": access_token}
    return response

@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

@app.route('/auth_test')
@jwt_required()
def auth_test():
    response_body = {
        "name": "Idk",
        "about" :"This is smth about me"
    }

    return response_body

#! ROUTES

@app.route('/users', methods=['POST'])
def new_user():
    name = request.json.get('name')
    username = request.json.get('username')
    password = request.json.get('password')

    if username is None or password is None:
        abort(400)
    if User.query.filter_by(username=username).first():
        abort(400)
    
    user = User(name=name, username=username)
    user.hash_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'username': user.username}), 201 #, {'Location': url_for('get_user', id=user.id, _external=True)}

@app.route('/investments', methods=['POST'])
def add_investment():
    request_data = request.get_json()
    Investment.add_investment(request_data['name'], 
                        request_data['short_name_handle'],
                        request_data['price'], 
                        request_data['amount'],
                        request_data['user_id'])
    response = Response("Investment added", 201, mimetype="application/json")
    return response

@app.route('/investments/user/<int:id>', methods=['GET'])
def get_investments_by_user(id):
    return jsonify({'investments': Investment.get_all_investments_by_user(id)})

@app.route('/investments/<int:id>', methods=['GET'])
def get_investment_by_id(id):
    response = Investment.get_investment_by_id(id)
    return jsonify(response)

@app.route('/investments/<int:id>', methods=['PUT'])
def update_investment(id):
    request_data = request.get_json()
    Investment.update_investment(id, 
                        request_data['name'], 
                        request_data['short_name_handle'],
                        request_data['price'],
                        request_data['amount']
    )
    response = Response("Investment updated", status=200, mimetype='application/json')
    return response

@app.route('/investments/<int:id>', methods=['DELETE'])
def remove_investment(id):
    Investment.delete_investment(id)
    reponse = Response("Investment deleted", status=200, mimetype='application/json')
    return reponse

if __name__ == '__main__':
    # app.run(debug=True)
    send_updates()
    socketio.run(app, debug=True)