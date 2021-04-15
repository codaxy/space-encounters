define(['SpriteObject'], function () {
	Game.Bomb = Game.extend(Game.SpriteObject, {

		hitRadius: 12,
		hitSource: true,
		hitDamage: 100,
		mass: 400,
		fuelTime: 5,
		impact: 30000,

		constructor: function (config) {
			config = config || {};
			Game.apply(config, {
				sprite: {
					texture: 'textures/bomb.png',
					scale: 12
				}
			});
			Game.SpriteObject.call(this, config);
			this.velocity = new THREE.Vector3(0, 0, 0);
		},

		advance: function (dt) {

			if (this.world.time - this.spawnTime > this.fuelTime) {
				var gravityShift = this.world.calculateGravitationalVelocity(dt, this.position);
				this.velocity.addSelf(gravityShift);
				if (this.skipTarget)
					delete this.skipTarget;
			}

			this.rotation += 5 * dt;

			this.position.addSelf(this.velocity.clone().multiplyScalar(dt));

			this.updateSprite();
		},

		//	onSpawn: function () {
		//		this.spawnTime = this.world.time;		
		//	},

		onHit: function (target, info) {

			if (target && target.velocity && target.mass) {
				var velocity = this.impact / target.mass;
				var vec = target.position.clone().subSelf(this.position).normalize();
				target.velocity.addSelf(vec.multiplyScalar(velocity));
			}

			if (target.multiplayer)
				this.emitDeath = true;

			this.die();
		}
	});
});