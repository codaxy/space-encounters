define(['Level', 'Planet', 'UserControls', 'ships/Optimus', 'objects/Grid', 'objects/Stars', 'ai/SeekAndDestroy'], function () {
    return Game.extend(Game.Level, {

        scale: 0.75,

        constructor: function (config) {
            Game.Level.call(this, config);
        },

        initBattlefield: function () {           

            var stars = new Game.Stars({
                world: this.world,
                scene: this.scene
            });

            this.initItemAppearance({
                interval: 5 * 1000,
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

            var controls = new Game.UserControls();

            this.opp = new Game.Optimus({
                position: new THREE.Vector3(700, 700, 1),
                world: this.world,
                mass: 100,
                //controls: controls,
                invertControls: true,
                rotation: Math.PI
            });

            this.ship = new Game.Spaceship({
                controls: controls,
                position: new THREE.Vector3(0, 0, 1),
                world: this.world,
                opponent: this.opp
            });

            this.opp.opponent = this.ship;

            var ai = new Game.SeekAndDestroy({
                ship: this.opp
            });
        }
    });
});
