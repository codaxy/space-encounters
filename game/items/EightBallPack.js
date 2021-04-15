define(['items/Item'], function () {
    Game.EightBallPack = Game.extend(Game.Item, {

        constructor: function (config) {
            Game.apply(config, {
                sprite: {
                    map: Game.getTexture('textures/8-ball.png'),
                    scale: 50
                }
            });
            Game.Item.call(this, config);
        },

        onHit: function (target) {

            if (target.isShip) {
            	target.eightBallAmmo += 20;

            	if (target.multiplayer)
            		this.emitDeath = true;

                this.die();
            }
        }
    });
});