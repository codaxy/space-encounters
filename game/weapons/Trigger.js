define(['Game'], function () {
    Game.Trigger = Game.extend({}, {

        constructor: function (config) {
            Game.apply(this, config);

            this.weapons = [];
        },

        add: function (w) {
            this.weapons.push(w);
        },

        fire: function () {
            for (var i = 0; i < this.weapons.length; i++)
                this.weapons[i].fire();
        }
    });
});