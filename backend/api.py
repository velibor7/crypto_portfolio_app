import config
from flask import request, Response, jsonify
# from flask_sqlalchemy import SQLAlchemy
# from flask_socketio import SocketIO
# from flask_socketio import send, emit
# from flask_sse import sse
# from flask_cors import cross_origin
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import (create_access_token, \
                                get_jwt, \
                                get_jwt_identity, \
                                unset_jwt_cookies, \
                                jwt_required, \
                                JWTManager)

from models import *
from cmp import calculate_all_portfolio_values

from flask_cors import cross_origin

from werkzeug.serving import WSGIRequestHandler


jwt = JWTManager(app)

scheduler = BackgroundScheduler(timezone="Europe/Belgrade")
scheduler.add_job(  func=calculate_all_portfolio_values, 
                    trigger='interval', 
                    seconds=10)
scheduler.start()

# todo: nije optimalan nacin da se radi
@app.route("/stream/<int:uid>", methods=["POST", "GET"])
@cross_origin()
def stream(uid):
    # if not uid:
        # # todo not implemented
        # # 503 - Service Unavailable - server is not ready to handle the req
        # return {"msg": "UID not provided"}, 503
    def eventStream():
        print(f"connected uid: {uid}")
        while True:
            if config.updated_flag == 1:
                data = Investment.get_all_by_user_id(uid)
                print(f"yielding new data now | time: {datetime.now()}")
                config.updated_flag = 0
                yield f"data: {data}\n\n"
    return Response(eventStream(), mimetype='application/event-stream', headers={"Connection": "Keep-Alive"})

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
        return response # no valid jwt, just return original res

@app.route('/token', methods=["POST"])
def create_token():
    # changed to username instead of email for testing purposes
    username = request.json.get("username", None)
    print(username)
    password = request.json.get("password", None)
    print(password)

    if (username or password) is None:
        return {"msg": "Username or password cant be none"}, 401

    try:
        user = User.get_instance_by_username(username)
        print(user)
        print(user.id)
    except AttributeError:
        return {"msg": "Cant find user with that username"}, 401

    if not user.verify_password(password):
        return {"msg": "Password is not valid"}, 401
    # if username != "test" or password != "test":
        # return {"msg": "Wrong email or password"}, 401

    access_token = create_access_token(identity=username)
    response = {"access_token": access_token, "user_id": user.id}
    return response

@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

#todo delete this 
@app.route('/auth_test')
@jwt_required()
def auth_test():
    response_body = {
        "name": "Idk",
        "about" :"This is smth about me"
    }

    return response_body

#! routes
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
    app.run(debug=False)