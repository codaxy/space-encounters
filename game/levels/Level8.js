define(['Level', 'Planet', 'UserControls', 'ships/Optimus', 'objects/Grid', 'objects/Stars', 'ai/SeekAndDestroy', 'multi/Multiplayer'], function () {
    return Game.extend(Game.Level, {

        width: 2000,

        constructor: function (config) {
            Game.Level.call(this, config);
        },

        initBattlefield: function () {
            var stars = new Game.Stars({
                world: this.world,
                scene: this.scene
            });

            //			var planet1 = new Game.Planet({
            //				world: this.world,
            //				position: new THREE.Vector3(000, 0, 0),
            //				gravity: -3000
            //			});

            //var planet2 = new Game.Planet({
            //	world: this.world,
            //	position: new THREE.Vector3(300, 0, 0),
            //	gravity: 3000
            //});

            this.initItemAppearance({
                interval: 10 * 1000,
                health: 20,
                homing: 20,
                direct: 20,
                bomb: 20,
                eightBall: 20,
				shield: 20,
				quad: 10
            });
        },

        initPlayers: function () {

            var me = this;

            var controls = new Game.UserControls();

            this.ship = new Game.Spaceship({
                controls: controls,
                position: new THREE.Vector3(1000 * (Math.random() - 0.5), 1000 * (Math.random() - 0.5), 1),
                world: this.world,
                multiplayer: true
            });

            Game.Multiplayer.init(this.ship);

            Game.Multiplayer.join = function (data) {
                var networkPlayer = new Game.Spaceship(Game.apply({
                    position: new THREE.Vector3(300, 0, 1),
                    world: me.world,
                    texture: 'textures/spaceship1-green.png'
                }, data));

                var ai = new Game.NetworkDriver({
                    ship: networkPlayer
                });

                return networkPlayer;
            }
        }
    });
});
