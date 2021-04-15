define(['Game', 'Collection', 'Map', 'multi/ArrayEncoder'], function () {
    Game.World = Game.extend({}, {

        id: 0,
        time: 0,

		itemTypes: {
			'health': 'Game.HealthPack', 
			'homing': 'Game.HomingPack',
			'bomb': 'Game.BombPack',
			'eightBall': 'Game.EightBallPack', 
			'direct': 'Game.DirectPack', 
			'shield': 'Game.Shield',
			'quad': 'Game.Quad'
		},

        constructor: function (config) {

            Game.apply(this, config);

            if (!this.scene)
                throw 'World requires a scene.';


            this.items = new Game.Collection({ indexProperty: 'index' });
            this.hitTargets = new Game.Collection({ indexProperty: '_htIndex' });
            this.hitSources = new Game.Collection({ indexProperty: '_hsIndex' });
            this.namedItems = new Game.Map({ indexProperty: 'guid' });

            this.planets = [];

            this.clock = new THREE.Clock();
            this.encoder = new Game.ArrayEncoder();
        },

        add: function (item) {

            var me = this;

            item.world = this;
            item.spawnTime = this.time;

            me.items.add(item);

            if (item.hitTarget)
                me.hitTargets.add(item);

            if (item.hitSource)
                me.hitSources.add(item);

            if (item.gravity > 0 || item.gravity < 0)
                me.planets.push(item);

            me.namedItems.add(item);
        },

        remove: function (item) {

            if (item.emitDeath && item.guid && Game.Multiplayer) {
                Game.Multiplayer.sendData({
                    rem: item.guid
                });
            }

            delete item.world;

            this.items.remove(item);
            this.hitTargets.remove(item);
            this.hitSources.remove(item);
            this.namedItems.remove(item);
        },

        advance: function () {

            var me = this;

            var dt = me.clock.getDelta();
            me.time += dt;

            for (var i = 0; i < me.items.items.length; i++)
                if (me.items.items[i])
                    me.items.items[i].advance(dt);

            //collision test
            var ht, hs;
            for (var s = 0; s < me.hitSources.items.length; s++) {
                if (hs = me.hitSources.items[s]) {
                    for (var h = 0; h < me.hitTargets.items.length; h++)
                        if ((ht = me.hitTargets.items[h]) && ht != hs && hs.skipTarget != ht) {
                            if (!hs.world)
                                continue; //dead                                                 
                            if (ht.hitSource && hs.hitTarget && ht.index < hs.index)
                                continue;
                            var distance = hs.position.distanceToSquared(ht.position);
                            var collision = distance < Math.pow(hs.hitRadius + ht.hitRadius, 2);
                            if (collision) {
                                var info = {};
                                ht.onHit(hs, info);
                                hs.onHit(ht, info);
                            }
                        }
                }
            }
        },

        calculateGravitationalVelocity: function (dt, position) {
            var res = new THREE.Vector3(0, 0, 0);
            for (var i = 0; i < this.planets.length; i++)
                res.addSelf(this.planets[i].calculateGravitationalVelocity(dt, position));
            return res;
        },

        rescale: function () {
            var me = this;
            for (var i = 0; i < me.items.items.length; i++)
                if (me.items.items[i])
                    me.items.items[i].rescale();
        },

        recieve: function (data) {
            if (!data)
                return;
            if (data.rem) {
                var item = this.namedItems.getByKey(data.rem);
                if (item)
                    item.die();
            }

            if (data.item) {
                this.createItem(data.item);
            }
        },

        createItem: function (data, notify) {
            this.encoder.load(data);
            var type = this.encoder.read();
            var position = this.encoder.readXY(); //position
            var guid = this.encoder.read();

            if (guid == 'new')
                data[3] = Game.newGuid();

            if (notify && Game.Multiplayer)
                Game.Multiplayer.sendData({
                    item: data
                });

			if (this.itemTypes[type]) {
				var c = eval(this.itemTypes[type]);
				new c({
					position: position,
					world: this,
					guid: guid
				});
			}
/*
            switch (type) {
                case "health":
                    new Game.HealthPack({
                        position: position,
                        world: this,
                        guid: guid
                    });
                    break;
                case "homing":
                    new Game.HomingPack({
                        position: position,
                        world: this,
                        guid: guid
                    });
                    break;
                case "bomb":
                    new Game.BombPack({
                        position: position,
                        world: this,
                        guid: guid
                    });
                    break;
                case "eightBall":
                    new Game.EightBallPack({
                        position: position,
                        world: this,
                        guid: guid
                    });
                    break;
                case "direct":
                    new Game.DirectPack({
                        position: position,
                        world: this,
                        guid: guid
                    });
                    break;

                case "shield":
                    new Game.Shield({
                        position: position,
                        world: this,
                        guid: guid
                    });
                    break;

				case "quad": 
					new Game.Quad({
						position: position,
						world: this,
						guid: guid
					});
					break;
            }
*/
        }
    });
});

