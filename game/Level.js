define(['World', 'hud/HUD', 'items/All'], function () {

	Game.Level = Game.extend({}, {

		width: 2000,

		constructor: function (config) {
			Game.apply(this, config);
		},

		initialize: function () {


			this.initBoundaries();
			this.initHUD();

			//THREE           
			this.initScene();
			this.initCamera();
			this.initRenderer();

			//GAME
			this.initWorld();
			this.initBattlefield();
			this.initPlayers();

			if (this.ship)
				this.ship.hud = this.hud;
		},

		initScene: function () {
			this.scene = new THREE.Scene();
		},

		initHUD: function () {
			this.hud = new Game.HUD({
				container: this.container
			});
		},

		initBoundaries: function () {

			Game.scaleFactor = this.container.clientWidth / this.width;

			var windowHalfX = this.container.clientWidth / 2 / Game.scaleFactor;
			var windowHalfY = this.container.clientHeight / 2 / Game.scaleFactor;
			this.bounds = {
				left: -windowHalfX,
				right: windowHalfX,
				top: -windowHalfY,
				bottom: windowHalfY
			}
		},

		initWorld: function () {

			// create world
			this.world = new Game.World({
				scene: this.scene,
				bounds: this.bounds
			});
		},

		initBattlefield: function () {

		},

		initPlayers: function () {

		},

		initCamera: function () {
			this.camera = new THREE.OrthographicCamera(
                this.bounds.left, this.bounds.right,
                this.bounds.top, this.bounds.bottom,
				-100, 100);
			this.scene.add(this.camera);
		},

		initRenderer: function () {
			// renderer
			var renderer = new THREE.WebGLRenderer();
			renderer.setClearColorHex(0x000000, 1);
			renderer.setSize(this.container.clientWidth, this.container.clientHeight);
			container.appendChild(renderer.domElement);

			this.renderer = renderer;
		},

		render: function () {
			this.renderer.render(this.scene, this.camera);
		},

		advance: function () {
			this.world.advance();
		},

		resize: function () {
			Game.scaleFactor = this.container.clientWidth / this.width;
			this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
			if (this.world)
				this.world.rescale();
		},

		initItemAppearance: function (options) {
			if (!options)
				return;

			var me = this;

			var total = 0; 
			for (var type in this.world.itemTypes) {
				total += (options[type] || 0);
			};

			var itemLimits = [];
			var currentLimit = 0;

			var i = 0;
			for (var type in this.world.itemTypes) {
				itemLimits[i] = {
					type: type,
					limit: currentLimit + (options[type] || 0) / total
				};
				currentLimit = itemLimits[i++].limit;
			};

			this.itemLimits = itemLimits;

			if (options.interval) {
				setInterval(function () {
					me.createItem();
				}, options.interval);
			}
		},

		createItem: function () {
			var il = this.itemLimits;
			if (!il)
				return;

			var x = Math.random() * (this.bounds.right - this.bounds.left) + this.bounds.left;
			var y = Math.random() * (this.bounds.bottom - this.bounds.top) + this.bounds.top;
			var position = new THREE.Vector3(x, y, 0);
			var r = Math.random();

			var type;
			for (var i = 0; i < this.itemLimits.length; i++) {
				if (r < this.itemLimits[i].limit) {
					type = this.itemLimits[i].type;
					break;
				}
			}

			if (type) {
				this.world.createItem([type, x, y, 'new'], true);
			}
		}
	});
});
