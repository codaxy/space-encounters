define(['items/Item'], function () {
    Game.DirectPack = Game.extend(Game.Item, {

        constructor: function (config) {
            Game.apply(config, {
                sprite: {
                    map: Game.getTexture('textures/rocket.png'),
                    scale: 300
                }
            });
            Game.Item.call(this, config);
        },

        onHit: function (target) {

            if (target.isShip) {
            	target.directAmmo += 100;

            	if (target.multiplayer)
            		this.emitDeath = true;

                this.die();
            }
        }
    });
});