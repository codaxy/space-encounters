define(['Object', 'SpriteObject'], function() {
	Game.CompoundObject = Game.extend(Game.Object, {
		
		sprites: {}, // Game.SpriteObject

		rim: null, // THREE.Object3D

		constructor: function(config) {
			config = config || {};
			Game.applyIf(config, {
                useScreenCoordinates: false,
                affectedByDistance: true,
                scaleByViewport: true,
                mergeWith3D: false
			});
			this.rim = new THREE.Object3D(config);

			config.actor = this.rim
			Game.Object.apply(this, arguments);

			this.sprites = {};

			if (config.sprites) {
				for (var key in config.sprites) {
					this.add(key, config.sprites[key]);
				}
			}
		},

		animate: function() {
			for (var key in this.sprites) {
				this.sprites[key].animate();
			}
		},

		updateAnimation: function(dt) {
			for (var key in this.sprites) {
				this.sprites[key].updateAnimation(dt);
			}
		},

		advance: function(dt) {
			for (var key in this.sprites) {
				this.sprites[key].advance(dt);
			}
			Game.Object.prototype.advance.apply(this, arguments);
		},

		onSpawn: function() {
			if (this.rim) {
				this.world.scene.add(this.rim);
			}
		},

		onDie: function() {
			if (this.rim) {
				this.world.scene.remove(this.rim);
			}
		},

		rescale: function() {
			for (var key in this.sprites) {
				this.sprites[key].rescale();
			}
		},

		add: function(name, sprite) {
			this.sprites[name] = sprite;
			if (this.rim)
				this.rim.add(sprite.sprite);

			sprite.parent = this;
		}
	});
});
