define(['Game'], function () {
	Game.EightBall = Game.extend(Game.SpriteObject, {

		internalSpeed: 600,
		lifetime: 15,
		mass: 200,
		hitTarget: true,
		hitSource: true,
		hitRadius: 20,
		isEightBall: true,
		hitDamage: 50,

		constructor: function (config) {
			config = config || {};
			Game.apply(config, {
				sprite: {
					texture: 'textures/8-Ball.png',
					scale: 37
				}
			});
			Game.SpriteObject.call(this, config);
			var orientationVec = this.getOrientationVec();
			this.velocity = orientationVec.clone().multiplyScalar(this.internalSpeed);
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

			this.rotation += 10 * dt;

			var gravityShift = this.world.calculateGravitationalVelocity(dt, this.position);

			this.velocity.z = 0;
			this.velocity.addSelf(gravityShift);

			this.position.addSelf(this.velocity.clone().multiplyScalar(dt));

			var wb = this.world.bounds;

			if (wb) {
				if (this.position.x < wb.left && this.velocity.x < 0)
					this.velocity.x *= -1;
				else if (this.position.x > wb.right && this.velocity.x > 0)
					this.velocity.x *= -1;

				if (this.position.y < wb.top && this.velocity.y < 0)
					this.velocity.y *= -1;
				else if (this.position.y > wb.bottom && this.velocity.y > 0)
					this.velocity.y *= -1;
			}

			this.updateSprite();
		},

		//	onSpawn: function () {
		//		this.spawnTime = this.world.time;		
		//	},

		onHit: function (target, info) {
			if (target.isEightBall) {
				if (this.index < target.index) {
					//elastic impact
					var dist = this.position.clone().subSelf(target.position).normalize();
					var massTotal = (target.mass + this.mass) / 2; // bouncing factor
					var relativeVelocity = target.velocity.clone().subSelf(this.velocity);
					var impactSpeed = dist.dot(relativeVelocity);
					if (impactSpeed > 0) {
						this.velocity.addSelf(dist.clone().multiplyScalar(impactSpeed * target.mass / massTotal));
						target.velocity.addSelf(dist.multiplyScalar(-impactSpeed * this.mass / massTotal));
					}
				}
				return;
			}

			if (target.hitTarget) {

				if (target.multiplayer)
					this.emitDeath = true;

				this.die();
			}
		}
	});
});