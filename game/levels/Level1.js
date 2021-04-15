define(['Level', 'Planet', 'UserControls', 'ships/Optimus', 'objects/Grid', 'objects/Stars', 'ai/SeekAndDestroy'], function () {
    return Game.extend(Game.Level, {

        scale: 0.75,

        constructor: function (config) {
            Game.Level.call(this, config);
        },

        initBattlefield: function () {

            var planet1 = new Game.Planet({
                world: this.world,
                position: new THREE.Vector3(0, 0, 0)
            });

            // create grid

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
        },

        initPlayers: function () {

            var controls = new Game.UserControls();

            this.opp = new Game.Optimus({
                position: new THREE.Vector3(700, 0, 1),
                world: this.world,
                mass: 100,
                //controls: controls,
                invertControls: true,
                rotation: Math.PI
            });

            this.ship = new Game.Spaceship({
                controls: controls,
                position: new THREE.Vector3(-400, 0, 1),
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