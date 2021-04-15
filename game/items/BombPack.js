define(['items/Item'], function () {
	Game.BombPack = Game.extend(Game.Item, {

		constructor: function (config) {
			Game.apply(config, {
				sprite: {
					map: Game.getTexture('textures/bomb.png'),
					scale: 30
				}
			});
			Game.Item.call(this, config);
		},

		onHit: function (target) {

			if (target.isShip) {
				target.bombAmmo += 10;

				if (target.multiplayer)
					this.emitDeath = true;

				this.die();
			}
		}
	});
});