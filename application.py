#!/usr/bin/env python
import os

from flask import Flask ,render_template ,jsonify ,request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


groups=[]
wanted_grp = None


@app.route("/")
def index():

    return render_template("index.html")

@app.route("/Home")
def main_page():

    return render_template("home.html")

@app.route("/groups/<string:room>",methods=["GET","POST"])
def refresh_page(room):
    number = None
    for i in range(len(groups)):
        if groups[i]["group_name"] == room :
             number = i
    return jsonify(groups[number])

@app.route("/groups_remove/<string:rmv>")
def remove_group(rmv):
    numb=None
    for i in range(len(groups)):
        if groups[i]["group_name"] == rmv :
            numb=i
    del(groups[numb])
    return f"Group {rmv} removed"



@socketio.on("start page")
def appear_page():
    emit('done groups',groups, broadcast=True)


@socketio.on("add groups")
def groups_edit(name):
    group_name = str(name["group_name"])
    group = {"group_name":group_name,
             "msgs":[]}
    status = None
    for i in range(len(groups)):
        if groups[i]["group_name"] == group_name :
            status = True

    if status != True:
        groups.append(group)

    emit('done groups',groups, broadcast=True)




@socketio.on('open chat')
def chat(room):
    print(room)
    room_needed = str(room["name"])

    for i in range(len(groups)) :
        if groups[i]["group_name"] == room_needed :
            wanted_grp= i

    grp=groups[wanted_grp]
    print(grp)
    emit("add chat",grp ,broadcast=False)


@socketio.on("instert msgs")
def insert_msgs(msg):
    message = str(msg["msg_send"])
    speaker = str(msg["speaker"])
    group = str(msg["group"])
    msg_full = {"speaker" : speaker,"message":message}
    #print(message)

    for i in range(len(groups)) :

        if groups[i]["group_name"]== group :
            while len(groups[i]["msgs"]) >= 50 :
                groups[i]["msgs"].remove(groups[i]["msgs"][0])
            groups[i]["msgs"].append(msg_full)
            wanted_grp = i

    grp = groups[wanted_grp]
    #print(grp)
    emit("add chat",grp,broadcast=False)

app.run(debug=True)

# search l. value in html
