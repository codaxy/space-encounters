define(['items/Item'], function () {
    Game.HomingPack = Game.extend(Game.Item, {

        constructor: function (config) {
            Game.apply(config, {
                sprite: {
                    map: Game.getTexture('textures/rocket.png'),
                    scale: 300,
                    rotationOffset: -Math.PI / 2
                }
            });
            Game.Item.call(this, config);
        },

        onHit: function (target) {

            if (target.isShip) {
            	target.homingAmmo += 50;

            	if (target.multiplayer)
            		this.emitDeath = true;

                this.die();
            }
        }
    });
});