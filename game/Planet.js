define(['SpriteObject'], function () {
	Game.Planet = Game.extend(Game.SpriteObject, {

		gravity: 500,
		gravityRadius: 50,
		hitRadius: 50,
		hitSource: true,
		hitTarget: true,
        hitDamage: 10000,

		isPlanet: true,

		constructor: function (config) {

			config = config || {};

			Game.apply(config, {
				sprite: {
					map: Game.getTexture('textures/alien-planet.png'),
					scale: 100
				}
			});

			Game.SpriteObject.apply(this, arguments);
		},

		advance: function (dt) {
			this.rotation += dt / 20;
			this.updateSprite();
		},

		calculateGravitationalVelocity: function (dt, position) {
			var distV = this.position.clone().subSelf(position);
			var l = distV.length() - this.gravityRadius - 10;
			if (l < 10)
				l = 10;
			distV.multiplyScalar(this.gravity * dt / l / (100 + l) * 100);
			return distV;
		}
	});
});

