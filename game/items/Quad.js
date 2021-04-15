define(['items/Item'], function () {
	Game.Quad = Game.extend(Game.Item, {

		constructor: function (config) {
			Game.apply(config, {
				sprite: {
					map: Game.getTexture('textures/quad.png'),
					scale: 40
				}
			});
			Game.Item.call(this, config);
		},

		onHit: function (target) {
			if (target.isShip) {
				target.resetQuad();

				if (target.multiplayer)
					this.emitDeath = true;

				this.die();
			}
		}
	});
});
