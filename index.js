var express =  require("express")
var app = express();
app.use(express.static("public"))

var sever = require("http").Server(app)
var io = require("socket.io")(sever)
sever.listen(process.env.PORT || 5002)
const redis = require("redis")
const client = redis.createClient()

const listUser =  []
var store = require('store')

store.set("history", {})
io.on("connection", function(socket){
    
    socket.on("create or join", room => {
        const myRoom = io.sockets.adapter.rooms.get(room)
        socket.join(room)
        socket.emit("joined", room)
    })

    socket.on("ready", room => {
        //socket.broadcast.to(room).emit("ready")
        console.log(room);
        socket.to(room).emit("ready")
    })

    // store.set('user', { id: socket.id })
    // console.log(store.get('user'));
   // client.rpush("tinnhan", `"user_1": "noidung"`)
   // console.log(client.lrange("tinhan", 0, -1));
    // socket.on("user-login", function(data){
    //     if(listUser.includes(data)){
    //         socket.emit("login-fail")
    //     }else{
    //         listUser.push(data)
    //         socket.usreName = data
    //         socket.emit("you-login-sucess", data)
    //         io.sockets.emit("list-user-online", listUser)
    //         client.lrange("history", 0, -1, (err, data) => {
    //             data.map( x => {
    //                 const myData = x.split(":")
    //                 const userName = myData[0]
    //                 const content = myData[1]
        
    //                 socket.emit("display-history-message", {
    //                     userName : userName,
    //                     content: content
    //                 })
    //             })
    //         })
    //     }
    // })

    socket.on("anybody-typinging", function(){
        socket.broadcast.emit('someone-typing', socket.usreName + " đang nhập !");
        console.log("co nguoi dang nhap");
    })
    
    socket.on("anybody-stop-typinging", function(){
        socket.broadcast.emit('someone-stop-styping');
    })

    socket.on("anybody-send-message", (data) => {
      io.sockets.emit("send-message-to-room", data);
    })
})

console.log("Connect ---");
