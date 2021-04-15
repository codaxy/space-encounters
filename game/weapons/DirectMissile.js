define(['Game'], function () {
    Game.DirectMissile = Game.extend(Game.SpriteObject, {

        maxSpeed: 800,
        lifetime: 1,
        hitRadius: 5,
        hitSource: true,
        hitDamage: 10,
        accelerationPeriod: 0.2,
        aimOn: false,

        constructor: function (config) {
            config = config || {};
            Game.apply(config, {
               	rotationOffset: Math.PI / 2,
                sprite: {
                    map: Game.getTexture('textures/rocket.png'),
                    scale: 80
                }
            });
            Game.SpriteObject.call(this, config);

            this.gunVelocity = this.gunVelocity || new THREE.Vector3(0, 0, 0);

            if (this.target && this.aimOn)
                this.pointAt(this.target.position.clone().addSelf(this.target.velocity.clone().subSelf(this.gunVelocity).multiplyScalar(Math.random())));

            this.orientationVec = this.getOrientationVec();
            this.velocity = this.orientationVec.clone().multiplyScalar(this.maxSpeed * 0.4);            
            this.velocity.addSelf(this.gunVelocity);
        },

        advance: function (dt) {

            if (this.world.time - this.spawnTime > this.lifetime) {
                this.die();
                return;
            }

            if (this.world.time - this.spawnTime < this.accelerationPeriod)
                this.velocity.addSelf(this.orientationVec.clone().multiplyScalar(this.maxSpeed / this.accelerationPeriod * dt));

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
