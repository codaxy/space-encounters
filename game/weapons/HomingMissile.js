define(['Game'], function () {
    Game.HomingMissile = Game.extend(Game.SpriteObject, {

        turnSpeed: 10,
        maxVelocity: 500,
        lifetime: 10,
        hitRadius: 5,
        hitSource: true,
        hitDamage: 5,
        trackRadius: 800,

        constructor: function (config) {
            config = config || {};

            Game.apply(config, {
                rotationOffset: Math.PI / 2,
                sprite: {
                    map: Game.getTexture('textures/rocket.png'),
                    scale: 80
                }
            });

            Game.SpriteObject.apply(this, arguments);
        },

        advance: function (dt) {

            if (this.world.time - this.spawnTime > this.lifetime) {
                this.die();
                return;
            }

            var rocketOrientationVec = this.getOrientationVec();

            if (this.target && this.target.world) {

                var shipRocketVec = this.target.position.clone().subSelf(this.position);

                if (shipRocketVec.lengthManhattan() < this.trackRadius) {
                    var cross = shipRocketVec.crossSelf(rocketOrientationVec);
                    if (cross.z < 0)
                        this.rotation += this.turnSpeed * dt;
                    else
                        this.rotation -= this.turnSpeed * dt;
                }
            }

            var velocity = rocketOrientationVec.multiplyScalar(this.maxVelocity);

            var gravityShift = this.world.calculateGravitationalVelocity(dt, this.position);
            velocity.addSelf(gravityShift);

            this.position.addSelf(velocity.multiplyScalar(dt));

            this.updateSprite();
        },

        //    onSpawn: function () {
        //    	this.spawnTime = this.world.time;		
        //    },

        onHit: function (target, info) {            
            this.die();
        }
    });
});


