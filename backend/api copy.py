from flask import Flask, request, Response, jsonify, g
from flask_sqlalchemy import SQLAlchemy
# from flask_socketio import SocketIO
from flask_socketio import send, emit
from flask_sse import sse
from flask_cors import cross_origin
# from flask_httpauth import HTTPBasicAuth
from apscheduler.schedulers.background import BackgroundScheduler
import datetime

from models import *
from cmp import *

# auth = HTTPBasicAuth()


#!scheduler - works
# scheduler = BackgroundScheduler()
# scheduler.add_job(  func=calculate_all_portfolio_values, 
                    # trigger='interval', 
                    # seconds=60)
# scheduler.start()

@socketio.on("connect", namespace="/home")
def frontend_connection():
    print("Client is Connected")
    # socketio.emit("connect", {"hello": "world"})

@socketio.on("disconnect", namespace="/home")
def frontend_disconnection():
    print("Client is Disconnected")

# @socketio.on("newdata", namespace="/home")
def send_updates():
    socketio.emit("newdata", {'msg': str(datetime.now())}, namespace='/home')
    # print("i am executed now " + str(datetime.now()))

# scheduler = BackgroundScheduler()
# scheduler.add_job(  func=send_updates, 
                    # trigger='interval', 
                    # seconds=20)
# scheduler.start()




"""
#! authentication
@app.route('/token')
@auth.login_required    
def get_auth_token():
    token = g.user.generate_auth_token()
    return jsonify({'token': token.decode('ascii')})

@auth.verify_password
def verify_pasword(username_or_token, password):
    user = User.verify_auth_token(username_or_token)
    if not User:
        user = User.query.filter_by(username=username_or_token).first()
        if not user or not user.verify_password(password):
            return False

    g.user = user 
    return True
"""



# @app.route("/stream", methods=['GET'])
# def stream():
    # print("push notif start", flush=True)
    # def eventStream():
        # while True:
            # today = datetime.now()
            # print(today, flush=True)

# scheduler = BackgroundScheduler()
# scheduler.add_job(  func=send_updates, 
                    # trigger='interval', 
                    # seconds=20)
# scheduler.start()

@app.route("/stream")
@cross_origin()
def stream():
    def eventStream():
        scheduler.start()
        #while True:
            # Poll data from the database
            # and see if there's a new message
            # messages = helper()
            # if len(messages) > len(previous_messages):
               # yield "data: {}\n\n".format(messages[len(messages)-1)])"
            # ret = "data: " + str(datetime.now())
            # print(ret)
            # yield ret
    
    return Response(eventStream(), mimetype="text/event-stream")



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
    socketio.run(app, debug=True)