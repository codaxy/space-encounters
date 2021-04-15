define(['Level', 'Planet', 'UserControls', 'ships/Optimus', 'objects/Grid', 'objects/Stars'], function () {
    return Game.extend(Game.Level, {

        scale: 1,

        constructor: function (config) {
            Game.Level.call(this, config);
        },

        initBattlefield: function () {

            var minorGridMat = new THREE.LineBasicMaterial({ color: 0x333333, opacity: 0.1, linewidth: 1 });
            var majorGridMat = new THREE.LineBasicMaterial({ color: 0x666666, opacity: 0.1, linewidth: 1 });

            var minorGridGeo = Game.SceneObjects.createGridGeometry(-500, 500, 10);
            var majorGridGeo = Game.SceneObjects.createGridGeometry(-500, 500, 100);

            this.scene.add(new THREE.Line(minorGridGeo, minorGridMat, THREE.LinePieces));
            this.scene.add(new THREE.Line(majorGridGeo, majorGridMat, THREE.LinePieces));

            Game.SceneObjects.addCoordSys(this.scene);

            var stars = new Game.Stars({
                world: this.world,
                scene: this.scene
            });

            var x = 0;
            var y = 0;
            var r = this.addBall(x, y).hitRadius;
            for (var i = 1; i < 5; i++) {
                x += 2 * r * Math.cos(Math.PI / 6);
                y -= r;
                for (var j = 0; j < i + 1; j++) {
                    this.addBall(x, y + 2 * r * j);
                }
            }
        },

        addBall: function (x, y) {
            return ball = new Game.EightBall({
                position: new THREE.Vector3(x, y, 0),
                world: this.world,
                internalSpeed: 0,
                rotation: 2 * Math.random() * Math.PI                
            });
        },

        initPlayers: function () {

            var controls = new Game.UserControls();

            //            this.opp = new Game.Optimus({
            //                position: new THREE.Vector3(700, 0, 1),
            //                world: this.world,
            //                mass: 100,
            //                //controls: controls,
            //                invertControls: true,
            //                rotation: Math.PI
            //            });

            this.ship = new Game.Spaceship({
                controls: controls,
                position: new THREE.Vector3(-300, 0, 1),
                world: this.world,
                opponent: this.opp
            });

            //this.opp.opponent = this.ship;
        }
    });
});