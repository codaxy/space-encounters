define(['Object'], function () {
    Game.SpriteObject = Game.extend(Game.Object, {

        spriteRotationOffset: 0,

		uvTiles: new THREE.Vector2(1, 1),

		frameUV: [],
		totalFrames: 1,

		isAnimating: false,

		defaultAnimation: { 
			fps: 60,
			loop: true,
			pingPong: false,
			scope: window,
			onFinish: function() { },
			elapsed: 0,
			frame: 0,
			frameIndex: 0,
			direction: 1
		},

		animation: {},

		constructor: function (config) {

			config = config || {};

			if (config.sprite) {
                this.sprite = this.createSprite(config.sprite)
				config.actor = this.sprite;
                delete config.sprite;
            }

            Game.Object.apply(this, arguments);

			this.frameUV = [];

			this.sprite.uvScale.set(1 / this.uvTiles.x, 1 / this.uvTiles.y);
			var uTiles = this.uvTiles.x, vTiles = this.uvTiles.y;

			for (var i = 0; i < vTiles; i++) {
				for (var j = 0; j < uTiles; j++) {
					this.frameUV.push(new THREE.Vector2(j / uTiles, i / vTiles));
				}
			}

			this.totalFrames = uTiles * vTiles;
        },

		animate: function(config) {
			this.animation = Game.applyIf(config || {}, this.defaultAnimation);
			this.isAnimating = true;
		},

        createSprite: function (spriteConfig) {
            Game.applyIf(spriteConfig, {
                alignment: THREE.SpriteAlignment.center,
                useScreenCoordinates: false,
                affectedByDistance: true,
                scaleByViewport: true,
                mergeWith3D: false
            });

            if (spriteConfig.texture) {
                spriteConfig.map = Game.getTexture(spriteConfig.texture);
                delete spriteConfig.texture;
            }
            
            sprite = new THREE.Sprite(spriteConfig);
            var s = sprite.rawScale = spriteConfig.scale || 1;
            sprite.scale.set(s, s, s).multiplyScalar(Game.scaleFactor / 100);
            sprite.rotationOffset = spriteConfig.rotationOffset;
            return sprite;
        },

		updateAnimation: function(dt) {
			if (this.isAnimating) {
				var anim = this.animation;

				anim.elapsed += dt;
				if (anim.elapsed * anim.fps > anim.frame) {
					anim.frame++, anim.frameIndex += anim.direction;
					if (anim.frame >= this.totalFrames) {
						anim.frame = 0;
						anim.elapsed = 0;

						if (!anim.loop && !anim.pingPong) {
							anim.frameIndex = 0;
							this.endAnimation();
						}
						else {
							if (anim.pingPong) {
								if (anim.direction < 0 && !anim.loop) {
									this.endAnimation();
								}
								else {
									anim.direction *= -1;
									anim.frameIndex += anim.direction;
								}
							}
							else if (anim.loop) {
								anim.frameIndex = 0;
							}
						}						
					}
					else {
						this.sprite.uvOffset = this.frameUV[anim.frameIndex];
					}
				}
			}
		},

		endAnimation: function() {
			this.isAnimating = false;
			if (typeof this.animation.onFinish == 'function') {
				this.animation.onFinish.apply(this.animation.scope || window, []);
			}
		},

		// Backward compatibility
		updateSprite: function() {
			Game.Object.prototype.advance.apply(this, arguments);
		},

        advance: function (dt) {
			Game.Object.prototype.advance.apply(this, arguments);
			this.updateAnimation(dt);
        },

        onSpawn: function (world) {
            if (this.sprite)
                this.world.scene.add(this.sprite);
        },

        onDie: function () {
            if (this.sprite)
                this.world.scene.remove(this.sprite);            
        },

        rescale: function () {
            if (this.sprite)
                this.rescaleSprite(this.sprite);
        },

		rescaleSprite: function(sprite) {
            var s = sprite.rawScale || 1;
            sprite.scale.set(s, s, s).multiplyScalar(Game.scaleFactor / 100);
		}
    });
});

