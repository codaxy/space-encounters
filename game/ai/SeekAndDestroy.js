define(['Game', 'weapons/Keys'], function () {
    Game.SeekAndDestroy = Game.extend({}, {

        safeDistance: 300,

        constructor: function (config) {
            Game.apply(this, config);
            if (!this.ship)
                throw 'AI needs a ship.';

            if (!this.ship.opponent)
                throw 'AI needs an opponent.';

            this.opponent = this.ship.opponent;

            this.controls = {
                key: {}
            };

            this.ship.controls = this.controls;
            this.ship.driver = this;
        },

        advance: function (dt) {

            var oppLive = this.opponent.world != null;

            var ahead = 0.3;

            var distanceVector = this.ship.position.clone().subSelf(this.opponent.position);
            var dist = distanceVector.length();

            if (dist < this.safeDistance)
                ahead = 0.2;

            var estimatedShipPosition = this.ship.position.clone().addSelf(this.ship.velocity.clone().multiplyScalar(ahead));
            var estimatedOpponentPosition = this.opponent.position.clone().addSelf(this.opponent.velocity.clone().multiplyScalar(ahead));

            var ROV = this.ship.getOrientationVec();
            var OSV = estimatedOpponentPosition.subSelf(estimatedShipPosition); // this.opponent.position.clone().subSelf(this.ship.position);



            var cross = OSV.normalize().crossSelf(ROV);
            this.controls.left = oppLive && cross.z < 0;
            this.controls.right = oppLive && !this.controls.left;

            this.controls.up = oppLive && dist > this.safeDistance;
            this.controls.down = oppLive && dist < this.safeDistance / 2;

            this.controls.key[Game.Keys.homingMissile] = dist < this.safeDistance && this.opponent.velocity.lengthSq() < Math.pow(300, 2);
            var gun = false;
            var direct = false;
            var eightBall = false;


            if (oppLive && Math.abs(cross.z) < 0.1) {
                eightBall = dist < 1 / 2 * this.safeDistance;;
                gun = !eightBall && dist < 2 * this.safeDistance;
                direct = dist < 1.5 * this.safeDistance;;
            }

            this.controls.key[Game.Keys.gun] = gun;
            this.controls.key[Game.Keys.directMissile] = direct;
            this.controls.key[Game.Keys.eightBall] = eightBall;

        }
    });
});