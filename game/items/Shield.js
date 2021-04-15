
define(['items/Item'], function () {
	Game.Shield = Game.extend(Game.Item, {

		constructor: function (config) {
			Game.apply(config, {
				sprite: {
					map: Game.getTexture('textures/shield.png'),
					scale: 40
				}
			});
			Game.Item.call(this, config);
		},

		onHit: function (target) {

			if (target.isShip) {
				target.resetShield();

				if (target.multiplayer)
					this.emitDeath = true;

				this.die();
			}
		}
	});
});
