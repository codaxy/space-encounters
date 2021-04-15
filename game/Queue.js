define(['Game'], function () {
	Game.Queue = Game.extend({}, {

		constructor: function (config) {
			this.queue = [];
			this.offset = 0;
		},

		getLength: function () {

			// return the length of the queue
			return (this.queue.length - this.offset);

		},

		empty: function () {
			return (this.queue.length == 0);
		},

		push: function (item) {
			this.queue.push(item);
		},

		pop: function () {

			// if the queue is empty, return undefined
			if (this.queue.length == 0) return undefined;

			// store the item at the front of the queue
			var item = this.queue[this.offset];

			// increment the offset and remove the free space if necessary
			if (++this.offset * 2 >= this.queue.length) {
				this.queue = this.queue.slice(this.offset);
				this.offset = 0;
			}

			// return the dequeued item
			return item;

		},

		peek: function () {

			// return the item at the front of the queue
			return (this.queue.length > 0 ? this.queue[this.offset] : undefined);

		}
	});
});