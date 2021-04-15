define(["Game", "Queue", "../socket.io/socket.io.js"], function (_, __, io) {
  var socket = io.connect(window.location.origin);

  Game.Multiplayer = {
    players: {},
    pid: null,

    init: function (ship) {
      Game.Multiplayer.ship = ship;

      socket.emit("join", {
        room: 1,
      });

      socket.on("pid", function (data) {
        Game.Multiplayer.ship.pid = data.pid;
        Game.Multiplayer.players[data.pid] = Game.Multiplayer.ship;
        Game.Multiplayer.guidBase = Game.Multiplayer.pid = data.pid;
        console.log("Joined room as player with id " + data.pid);
      });

      socket.on("ping", function (data) {
        var now = new Date().valueOf();
        Game.Multiplayer.ship.updateHud({
          latency: now - data,
        });
      });

      setInterval(function () {
        socket.emit("ping", new Date().valueOf());
      }, 3 * 1000);
    },

    sendData: function (data) {
      if (!Game.Multiplayer.pid) return;
      data.pid = Game.Multiplayer.pid;
      socket.emit("data", data);
    },

    restoreVectors: function (data) {
      for (var vn in data) {
        var vd = data[vn];
        if (vd && typeof vd == "object") {
          if (vd.z !== undefined)
            //is vector
            data[vn] = new THREE.Vector3(vd.x, vd.y, vd.z);
          else Game.Multiplayer.restoreVectors(vd);
        }
      }
      return data;
    },

    findNearestPlayer: function (position) {
      var l = Math.pow(100000, 2);
      var res = null;
      for (var p in Game.Multiplayer.players) {
        var ship = Game.Multiplayer.players[p];
        if (!ship || ship == Game.Multiplayer.ship) continue;
        var d = ship.position.distanceToSquared(position);
        if (d < l) {
          res = ship;
          l = d;
        }
      }
      return res;
    },

    lastDataRecieved: {},
  };

  socket.on("data", function (data) {
    if (data && data.pid) {
      var q = Game.Multiplayer.lastDataRecieved[data.pid];
      if (!q)
        Game.Multiplayer.lastDataRecieved[data.pid] = q = new Game.Queue();
      q.push(data);
    }
  });

  socket.on("player-join", function (data) {
    console.log("Player " + data.pid + " joined.");
    if (Game.Multiplayer.join) {
      var p = Game.Multiplayer.join(data);
      p.pid = data.pid;
      Game.Multiplayer.players[data.pid] = p;
    }
  });

  socket.on("player-disconnected", function (data) {
    console.log("Player " + data.pid + " disconnected.");
    var player = Game.Multiplayer.players[data.pid];
    Game.Multiplayer.players[data.pid] = null;
    if (player) player.die();
  });

  Game.NetworkDriver = Game.extend(
    {},
    {
      constructor: function (config) {
        Game.apply(this, config);
        if (!this.ship) throw "AI needs a ship.";
        this.ship.driver = this;
        this.ship.networkDriver = true;
      },

      advance: function (dt) {
        var q = Game.Multiplayer.lastDataRecieved[this.ship.pid];
        if (!q) return;

        var ldr;
        while ((ldr = q.pop())) {
          if (!ldr) return;

          this.ship.recieve(ldr);
        }
      },
    }
  );
});
