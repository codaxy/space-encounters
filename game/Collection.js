define(['Game'], function () {
    Game.Collection = Game.extend({}, {

        constructor: function (config) {
            
            Game.apply(this, config);
            
            if (!this.indexProperty)
                throw 'Collection index property not defined.';

            this.items = [];
            this.freeIndices = [];
        },

        add: function (item) {
            if (!item)
                return;

            var index = this.freeIndices.length ? this.freeIndices.pop() : this.items.length;
            this.items[index] = item;

            item[this.indexProperty] = index;
        },

        remove: function (item) {
            if (!item)
                return;
            var index = item[this.indexProperty];
            if (index !== undefined) {
                this.items[index] = undefined;
                delete item[this.indexProperty];
                this.freeIndices.push(index);
            }
        }
    });
});