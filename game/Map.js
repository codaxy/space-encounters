define(['Game'], function () {
	Game.Map = Game.extend({}, {

		constructor: function (config) {

			Game.apply(this, config);

			if (!this.indexProperty)
				throw 'Collection index property not defined.';

			this.items = {};
		},

		add: function (item) {
			if (!item)
				return;
			var v = item[this.indexProperty];
			if (v)
				this.items[v] = item;
		},

		remove: function (item) {
			if (!item)
				return;
			var v = item[this.indexProperty];
			if (v)
				this.items[v] = undefined;
		},

		getByKey: function (key) {
			var item = this.items[key];
			return item;
		},

		removeByKey: function (key) {
			var item = this.getByKey(key);
			if (item)
				this.remove(item);
		}

	});
});