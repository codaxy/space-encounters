define(['ships/Spaceship'], function () {
    Game.Optimus = Game.extend(Game.Spaceship,
    {
        constructor: function (config) {
            config = Game.apply(config || {}, {
                sprite: {
                    texture: 'textures/transformer-head.png',
                    rotationOffset: -Math.PI / 2
                }
            });
            Game.Spaceship.call(this, config);
        }
    });
});