define(['SpriteObject'], function () {
    Game.Item = Game.extend(Game.SpriteObject, {

        hitSource: true,
        hitRadius: 30,
        lifetime: 19.5,

        constructor: function (config) {
            Game.SpriteObject.call(this, config);
        },

        advance: function (dt) {

            if (this.world.time - this.spawnTime > this.lifetime) {
                this.die();
                return;
            }

            this.rotation += dt / 2;
            this.updateSprite();
        },

        onHit: function () {
            this.die();
        }

    });
});