var express = require("express"),
  http = require("http");

var app = express();
var server = http.createServer(app);
//var server = app;
var io = require("socket.io")(server);
var bodyParser = require("body-parser");

server.listen(process.env.PORT || 81);
//io.set("log level", 1);

app.get("/", function (req, res) {
  res.redirect("game.html");
});

//app.use(express.methodOverride());
app.use(bodyParser.json());
//app.use('/lib', express.static(__dirname + '/lib'));
app.use("/", express.static(__dirname + "/"));
// app.use(
//   express.errorHandler({
//     dumpExceptions: true,
//     showStack: true,
//   })
// );
//app.use(app.router);
//});

var ids = {};

function getId() {
  var id;
  do {
    id = _generateId();
  } while (ids[id]);
  ids[id] = true;
  return id;
}

function _generateId() {
  return (
    "0000" + ((Math.random() * Math.pow(36, 4)) << 0).toString(36)
  ).substr(-4);
}

io.sockets.on("connection", function (socket) {
  socket.pid = getId();

  socket.on("join", function (data) {
    socket.room = data.room || 1;

    socket.join(socket.room);
    console.log("Player " + socket.pid + " joined the room " + data.room + ".");

    socket.emit("pid", {
      pid: socket.pid,
    });

    //add other players in the room
    var players = io.sockets.adapter.rooms.get(socket.room);

    for (let id of players) {
      let player = io.sockets.sockets.get(id);
      console.log(player);
      if (player.pid != socket.pid)
        socket.emit("player-join", {
          pid: player.pid,
        });
    }

    //notify others about the new player
    socket.broadcast.to(socket.room).emit("player-join", {
      pid: socket.pid,
    });
  });

  socket.on("data", function (data) {
    socket.broadcast.to(socket.room).volatile.emit("data", data);
    //if (data.fr)
    //    console.log(data);
  });

  socket.on("disconnect", function () {
    console.log("Player " + socket.pid + " disconnected.");
    socket.broadcast.to(socket.room).emit("player-disconnected", {
      pid: socket.pid,
    });
  });

  socket.on("ping", function (data) {
    socket.emit("ping", data);
  });
});
