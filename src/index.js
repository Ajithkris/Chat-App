const express = require("express");
const path = require('path');
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage } = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,"../public");

app.use(express.static(publicDirectoryPath));

let count = 0;

// server (emit) -> client (receive) -- countUpdated
// client (emit) -> server (receive) -- increment

io.on("connection", (socket) => {
    console.log("New Websocket connectin");

    socket.emit("message",generateMessage("welcome!"))
    socket.broadcast.emit("message",generateMessage("New user has joined!"))

    socket.on("sendMessage",(message,callback)=>{
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback("Profanity is not allowed!")
        }

        io.emit("message",generateMessage(message))
        callback()
    })

    socket.on("sendLocation", (coords, callback) => {
        io.emit("message", `http://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })

    socket.on("disconnect",()=>{
        io.emit("message",generateMessage("A user has a left!"))
    })

    // socket.emit("countUpdated",count)

    // socket.on("increment", ()=>{
    //     count++
    //     // socket.emit("countUpdated", count)    ======>>> single user
    //     io.emit("countUpdated", count)   // mult like group--chat
    // })
})

server.listen(port,()=>{
    console.log("server is up on port"+ port);
})