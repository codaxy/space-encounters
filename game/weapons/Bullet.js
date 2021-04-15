define(['Game'], function () {
    Game.Bullet = Game.extend(Game.SpriteObject, {

        maxSpeed: 2000,
        lifetime: 0.5,
        hitRadius: 2,
        hitSource: true,
        hitDamage: 2,

        constructor: function (config) {
            config = config || {};
            Game.apply(config, {
				rotationOffset: Math.PI / 2,
                sprite: {
                    map: Game.getTexture('textures/bullet_2.png'),
                    scale: 20,
                }
            });
            Game.SpriteObject.call(this, config);

            this.orientationVec = this.getOrientationVec();
            this.velocity = this.orientationVec.clone().multiplyScalar(this.maxSpeed);
            if (this.gunVelocity) {
                this.velocity.addSelf(this.gunVelocity);
                delete this.gunVelocity;
            }
        },

        advance: function (dt) {

            if (this.world.time - this.spawnTime > this.lifetime) {
                this.die();
                return;
            }

            var gravityShift = this.world.calculateGravitationalVelocity(dt, this.position);
            this.velocity.addSelf(gravityShift);

            this.position.addSelf(this.velocity.clone().multiplyScalar(dt));

            this.updateSprite();
        },

        //	onSpawn: function () {
        //		this.spawnTime = this.world.time;		
        //	},

        onHit: function (target, info) {
            this.die();
        }
    });
});
