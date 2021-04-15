define(['items/Item'], function () {
    Game.HealthPack = Game.extend(Game.Item, {

        constructor: function (config) {
            Game.apply(config, {
                sprite: {
                    map: Game.getTexture('textures/health.png'),
                    scale: 120,
                    rotationOffset: -Math.PI / 2
                }
            });
            Game.Item.call(this, config);
        },

        onHit: function (target) {

            if (target.isShip) {
            	target.energy += 100;

            	if (target.multiplayer)
            		this.emitDeath = true;

                this.die();
            }
        }
    });
});