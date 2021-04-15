define(['Game'], function () {
    Game.Launcher = Game.extend({}, {

        position: undefined, //
        rate: 10,
        lastFire: 0,
        hitSource: true,

        constructor: function (config) {
            Game.apply(this, config);

            if (!this.carrier)
                throw 'Launcher needs a carrier.';

            this.lastFire = this.carrier.world.time;

            if (this.trigger)
                this.trigger.add(this);

        },

        calculateFiringPosition: function () {
            return this.carrier.toGlobalCoordinates(this.position);
        },

        fire: function () {
            var time = this.carrier.world.time;
            if (time - this.lastFire > 1 / this.rate) {
                if (this.onFire(this.carrier, this.calculateFiringPosition()) !== false) {
                    this.lastFire = time;
                }
            }
        },

        onFire: function () {

        }
    });
});