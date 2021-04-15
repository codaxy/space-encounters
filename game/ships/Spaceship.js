define(['CompoundObject', 'weapons/All', 'multi/ArrayEncoder'], function () {
	Game.Spaceship = Game.extend(Game.CompoundObject, {
		turnSpeed: 2.8,
		hitTarget: true,
		hitSource: true,
		hitRadius: 30,
		maxSpeed: 520,
		acceleration: 14,
		mass: 100,
		texture: 'textures/spaceship1.png',
		rotationSpeed: 0,
		sideThrusters: true,
		stabilityControl: true,
		quickTurn: true,
		energy: 1000,

		isShip: true,

		directAmmo: 200,
		homingAmmo: 100,
		bombAmmo: 10,
		eightBallAmmo: 20,

		shieldEnergy: 0,
		shieldTimer: null,

		quadEnabled: false,

		shipState: 'normal', // ['normal', 'exploding', 'dead']
		thrustState: 'off', // ['on', 'off']

		constructor: function (config) {

			config = config || {};

			Game.applyIf(config, {
				rotationOffset: -Math.PI / 2
			});

			var ship = this.ship = new Game.SpriteObject({
				position: new THREE.Vector3(0, 0, 1),
				sprite: {
					texture: config.texture || this.texture,
					scale: 60,
				}
			});
			Game.CompoundObject.apply(this, arguments);

			this.initWeapons();

			this.encoder = new Game.ArrayEncoder();

			var shield = this.shield = new Game.SpriteObject({
				sprite: {
					texture: 'textures/shield-mask.png',
					scale: 100
				}
			});

			var quad = this.quad = new Game.SpriteObject({
				sprite: {
					texture: 'textures/quad-mask.png',
					scale: 70
				}
			});

			var explosion = this.explosion = new Game.SpriteObject({
				uvTiles: new THREE.Vector2(16, 1),
				sprite: {
					texture: 'textures/explosion.png',
					scale: 10
				}
			});

			var thrust = this.thrust = new Game.SpriteObject({
				uvTiles: new THREE.Vector2(1, 8),
				position: new THREE.Vector3(0, -40, 1),
				sprite: {
					texture: 'textures/thrust.png',
					scale: 60
				}
			});

			shield.sprite.visible = false;	
			explosion.sprite.visible = false;
			thrust.sprite.visible = false;
			quad.sprite.visible = false;

			thrust.animate({
				fps: 60,
				loop: true
			});

			this.add('ship', ship);
			this.add('shield', shield);
			this.add('quad', quad);
			this.add('explosion', explosion); 
			this.add('thrust', thrust);
		},

		initWeapons: function () {

			this.eightBallLauncher = new Game.Launcher({
				carrier: this,
				position: new THREE.Vector3(50, 0, 0),
				rate: 3,
				onFire: function (ship, firePosition) {
					ship.fireEightBall(firePosition);
					return true;
				}
			});

			this.homingTrigger = new Game.Trigger();

			this.homingLauncher1 = new Game.Launcher({
				carrier: this,
				position: new THREE.Vector3(-5, 30, 0),
				rate: 4,
				angle: Math.PI / 4,
				trigger: this.homingTrigger,
				onFire: function (ship, firePosition) {
					ship.fireHomingMissile(firePosition, this.angle);
					return true;
				}
			});

			this.homingLauncher2 = new Game.Launcher({
				carrier: this,
				position: new THREE.Vector3(-5, -30, 0),
				rate: 4,
				angle: -Math.PI / 4,
				trigger: this.homingTrigger,
				onFire: function (ship, firePosition) {
					ship.fireHomingMissile(firePosition, this.angle);
					return true;
				}
			});

			this.homingLauncher3 = new Game.Launcher({
				carrier: this,
				position: new THREE.Vector3(-5, 30, 0),
				rate: 4,
				angle: Math.PI / 8,
				trigger: this.homingTrigger,
				onFire: function (ship, firePosition) {
					ship.fireHomingMissile(firePosition, this.angle);
					return true;
				}
			});

			this.homingLauncher4 = new Game.Launcher({
				carrier: this,
				position: new THREE.Vector3(-5, -30, 0),
				rate: 4,
				angle: Math.PI,
				angle: -Math.PI / 8,
				trigger: this.homingTrigger,
				onFire: function (ship, firePosition) {
					ship.fireHomingMissile(firePosition, this.angle);
					return true;
				}
			});

			this.gunTrigger = new Game.Trigger();

			this.gunLauncher1 = new Game.Launcher({
				carrier: this,
				position: new THREE.Vector3(10, 15, 0),
				rate: 20,
				trigger: this.gunTrigger,
				onFire: function (ship, firePosition) {
					ship.fireGun(firePosition);
					return true;
				}
			});

			this.gunLauncher2 = new Game.Launcher({
				carrier: this,
				position: new THREE.Vector3(10, -15, 0),
				rate: 20,
				trigger: this.gunTrigger,
				onFire: function (ship, firePosition) {
					ship.fireGun(firePosition);
					return true;
				}
			});

			this.gunLauncher3 = new Game.Launcher({
				carrier: this,
				position: new THREE.Vector3(15, 0, 0),
				rate: 20,
				trigger: this.gunTrigger,
				onFire: function (ship, firePosition) {
					ship.fireGun(firePosition);
					return true;
				}
			});

			this.directTrigger = new Game.Trigger();

			this.directLauncher1 = new Game.Launcher({
				carrier: this,
				position: new THREE.Vector3(25, 5, 0),
				rate: 10,
				trigger: this.directTrigger,
				onFire: function (ship, firePosition) {
					ship.fireDirectMissile(firePosition);
					return true;
				}
			});

			this.directLauncher2 = new Game.Launcher({
				carrier: this,
				position: new THREE.Vector3(25, -5, 0),
				rate: 10,
				trigger: this.directTrigger,
				onFire: function (ship, firePosition) {
					ship.fireDirectMissile(firePosition);
					return true;
				}
			});

			this.directLauncher3 = new Game.Launcher({
				carrier: this,
				position: new THREE.Vector3(-5, -30, 0),
				rate: 10,
				trigger: this.directTrigger,
				onFire: function (ship, firePosition) {
					ship.fireDirectMissile(firePosition);
					return true;
				}
			});

			this.directLauncher4 = new Game.Launcher({
				carrier: this,
				position: new THREE.Vector3(-5, 30, 0),
				rate: 10,
				trigger: this.directTrigger,
				onFire: function (ship, firePosition) {
					ship.fireDirectMissile(firePosition);
					return true;
				}
			});

			this.bombLauncher = new Game.Launcher({
				carrier: this,
				position: new THREE.Vector3(0, 0, 0),
				rate: 5,
				onFire: function (ship, firePosition) {
					ship.fireBomb(firePosition);
					return true;
				}
			});
		},

		advance: function (dt) {
			switch (this.shipState) {
				case 'normal':
					this.advanceShip(dt);
					break;

				case 'exploding':
					this.explosion.advance(dt);
					break;
			}
		},

		advanceShip: function(dt) {

			if (this.driver)
				this.driver.advance(dt);

			if (!this.world) //died in the meantime
				return;

			if (this.controls) {

				//                var rotationStopTime = 0.3;
				//                if (Math.abs(this.rotationSpeed) > 0.1)
				//                    this.rotationSpeed *= Math.max(0, rotationStopTime - dt) / rotationStopTime;

				//if (this.controls.up)
				this.rotationSpeed = 0;

				var turnFactor = 1;
				if (this.quickTurn && !this.controls.up)
					turnFactor = 2;

				if (this.controls.left)
					this.rotationSpeed = -(this.invertControls ? -1 : 1) * this.turnSpeed * turnFactor;

				if (this.controls.right)
					this.rotationSpeed = (this.invertControls ? -1 : 1) * this.turnSpeed * turnFactor;

				if (this.controls.up) {
					var velDelta = this.getOrientationVec();
					velDelta.multiplyScalar(this.acceleration);
					this.velocity.addSelf(velDelta);

					if (this.sideThrusters) {
						var thrustersAngle = 0;
						if (this.controls.left)
							thrustersAngle -= Math.PI / 2;
						if (this.controls.right)
							thrustersAngle += Math.PI / 2;
						if (thrustersAngle != 0)
							this.velocity.addSelf(this.getOrientationVec(thrustersAngle).multiplyScalar(this.acceleration));
					}

					if (this.stabilityControl) {
						var vec = this.velocity.clone().subSelf(this.getOrientationVelocity());
						this.velocity.addSelf(vec.multiplyScalar(-Math.min(1, dt / 0.5)));
					}

					// Show thrust:
					this.updateThrustState('on');
				}
				else {
					this.updateThrustState('off');
				}

				if (this.controls.down) {
					this.velocity.multiplyScalar(0.9);
				}

				if (this.controls.key[83])
					this.eightBallLauncher.fire();

				if (this.controls.key[87])
					this.directTrigger.fire();


				if (this.controls.key[69])
					this.homingTrigger.fire();

				if (this.controls.key[65])
					this.bombLauncher.fire();

				if (this.controls.key[81])
					this.gunTrigger.fire();
			}

			this.rotation += this.rotationSpeed * dt;

			if (!this.world) {
				var x = 2 + 2; //how did we get here
			}

			var gravityShift = this.world.calculateGravitationalVelocity(dt, this.position);
			this.velocity.addSelf(gravityShift);
			this.velocity.z = 0;

			if (this.velocity.lengthSq() > this.maxSpeed * this.maxSpeed)
				this.velocity.setLength(this.maxSpeed);

			//this.spaceRing(dt);

			var translate = this.velocity.clone().multiplyScalar(dt);

			this.position.addSelf(translate);

			this.otherSideReappear();

			this.reportPosition();

			this.updateHud();

			Game.CompoundObject.prototype.advance.apply(this, arguments);
		},

		updateThrustState: function(state) {
			if (state != this.thrustState) {
				this.thrustState = state;
				this.send({
					thrust: state
				});

				this.thrust.sprite.visible = (state == 'on');
			}
		},

		otherSideReappear: function () {
			var wb = this.world.bounds;

			if (wb) {
				if (this.position.x < wb.left)
					this.position.x += wb.right - wb.left;
				else if (this.position.x > wb.right)
					this.position.x -= wb.right - wb.left;


				if (this.position.y < wb.top)
					this.position.y += wb.bottom - wb.top;
				else if (this.position.y > wb.bottom)
					this.position.y -= wb.bottom - wb.top;
			}
		},

		spaceRing: function (dt) {
			var wb = this.world.bounds;
			var factor = 3000 * dt;
			var border = 100;

			if (wb) {
				if (this.position.x < wb.left + border)
					this.velocity.x += factor;
				else if (this.position.x > wb.right - border)
					this.velocity.x -= factor;


				if (this.position.y < wb.top + border)
					this.velocity.y += factor;
				else if (this.position.y > wb.bottom - border)
					this.velocity.y -= factor;
			}
		},

		onHit: function (target, info) {
			if (target) {

				if (target.hitDamage && !this.networkDriver) {
					if (this.shieldEnergy > 0) 
						return;

					this.energy -= target.hitDamage * (target.multiplier || 0);
					if (this.energy <= 0)
						this.energy = 0;
					this.updateHud({ energy: this.energy });
					if (this.energy <= 0) {
						this.send({
							terminated: true
						});
						this.die();
						return;
					}
				}

				if (target.isPlanet) {
					this.position.x = (Math.random() - 0.5) * 2000;
					this.position.y = (Math.random() - 0.5) * 2000;
					this.velocity = new THREE.Vector3(0, 0, 0);
				}

				//elastic impact
				if (target.mass && target.velocity && !info.processed) {
					info.processed = true;
					var dist = this.position.clone().subSelf(target.position).normalize();
					var massTotal = (target.mass + this.mass) / 2; // bouncing factor
					var relativeVelocity = target.velocity.clone().subSelf(this.velocity);
					var impactSpeed = dist.dot(relativeVelocity);
					if (impactSpeed > 0) {
						this.velocity.addSelf(dist.clone().multiplyScalar(impactSpeed * target.mass / massTotal));
						target.velocity.addSelf(dist.multiplyScalar(-impactSpeed * this.mass / massTotal));
					}
				}
			}
		},

		fireEightBall: function (firePosition) {

			if (this.eightBallAmmo <= 0)
				return;

			--this.eightBallAmmo;

			this.encoder.clear();
			this.encoder.writeNumber(this.rotation, 2); //rotation
			this.encoder.writeXY(firePosition, 0); //position
			this.encoder.writeXY(this.getOrientationVelocity(), 0); //gunVelocity
			this.encoder.write(Game.newGuid()); //guid
			this.fire({
				eightBall: this.encoder.toArray()
			});
		},

		fireHomingMissile: function (firePosition, angle) {

			var opp = this.opponent;

			if (!opp && this.multiplayer && Game.Multiplayer) {
				//find nearest enemy
				opp = Game.Multiplayer.findNearestPlayer(this.position);
			}

			if (this.homingAmmo <= 0)
				return;

			--this.homingAmmo;

			this.encoder.clear();
			this.encoder.writeNumber(this.rotation + (angle || 0), 2); //rotation
			this.encoder.writeXY(firePosition, 0); //position
			this.encoder.write(opp ? opp.pid : null); //targetId

			this.fire({
				homing: this.encoder.toArray()
			});
		},

		fireDirectMissile: function (firePosition) {

			if (this.directAmmo <= 0)
				return;

			--this.directAmmo;

			this.encoder.clear();
			this.encoder.writeNumber(this.rotation, 2); //rotation
			this.encoder.writeXY(firePosition, 0); //position
			this.encoder.writeXY(this.velocity, 0);
			this.fire({
				dir: this.encoder.toArray()
			});
		},

		fireBomb: function (firePosition) {

			if (this.bombAmmo <= 0)
				return;

			--this.bombAmmo;

			this.encoder.clear();
			this.encoder.writeXY(firePosition, 0); //position    
			this.encoder.write(Game.newGuid()); //guid        
			this.fire({ bomb: this.encoder.toArray() }, { native: true });
		},

		fireGun: function (firePosition) {
			this.encoder.clear();
			this.encoder.writeNumber(this.rotation, 2); //rotation
			this.encoder.writeXY(firePosition, 0); //position
			this.encoder.writeXY(this.velocity, 0);
			this.fire({
				gun: this.encoder.toArray()
			});
		},

		fire: function (data, options) {
			options = options || {};
			var multiplier = this.quadEnabled ? 4.0 : 1.0;

			this.send({
				fr: data
			});

			if (data.gun) {

				this.encoder.load(data.gun);
				var rotation = this.encoder.readNumber(); //rotation
				var position = this.encoder.readXY(); //position
				var velocity = this.encoder.readXY(); //velocity

				new Game.Bullet({
					skipTarget: this,
					world: this.world,
					rotation: rotation,
					position: position,
					multiplier: multiplier,
					velocity: velocity
				});
			}

			if (data.dir) {

				this.encoder.load(data.dir);
				var rotation = this.encoder.readNumber(); //rotation
				var position = this.encoder.readXY(); //position
				var velocity = this.encoder.readXY(); //velocity

				new Game.DirectMissile({
					skipTarget: this,
					world: this.world,
					rotation: rotation,
					position: position,
					multiplier: multiplier,
					velocity: velocity
				});
			}

			if (data.bomb) {
				this.encoder.load(data.bomb);
				var position = this.encoder.readXY(); //position
				var guid = this.encoder.read();
				new Game.Bomb({
					world: this.world,
					skipTarget: this,
					position: position,
					multiplier: multiplier,
					guid: guid
				});
			}

			if (data.eightBall) {
				this.encoder.load(data.eightBall);
				var rotation = this.encoder.readNumber(); //rotation
				var position = this.encoder.readXY(); //position
				var gunVel = this.encoder.readXY(); //gunVelocity
				var guid = this.encoder.read();
				var ball = new Game.EightBall({
					world: this.world,
					rotation: rotation,
					position: position,
					multiplier: multiplier,
					gunVelocity: gunVel,
					guid: guid
				});
				var dv = this.getOrientationVec().multiplyScalar(-1 * 100 * ball.mass / this.mass);
				this.velocity.addSelf(dv);
			}

			if (data.homing) {
				this.encoder.load(data.homing);
				var rotation = this.encoder.readNumber(); //rotation
				var position = this.encoder.readXY(); //position
				var targetId = this.encoder.read(); //targetId

				var opp = this.opponent;
				if (!opp && targetId)
					opp = Game.Multiplayer.players[targetId];

				new Game.HomingMissile({
					world: this.world,
					target: opp,
					targetId: targetId,
					position: position,
					rotation: rotation,
					multiplier: multiplier,
					skipTarget: this
				});
			}
		},

		getNetworkData: function () {
			return {
				prv: [
                    Math.round(100 * this.rotation) / 100,
                    Math.round(this.position.x),
                    Math.round(this.position.y),
                    Math.round(this.velocity.x),
                    Math.round(this.velocity.y)
                ]
			};
		},

		restoreNetworkData: function (data) {
			this.rotation = data.prv[0];
			this.position = new THREE.Vector3(data.prv[1], data.prv[2], this.position.z);
			this.velocity = new THREE.Vector3(data.prv[3], data.prv[4], 0);
		},

		reportPosition: function () {
			if (!this.lastReportTime || this.world.time - this.lastReportTime > 1 / 30) {
				this.lastReportTime = this.world.time;
				this.send(this.getNetworkData());
			}
		},

		send: function (data) {
			if (this.multiplayer && Game.Multiplayer && data && this.pid) {				
				Game.Multiplayer.sendData(data);
			}
		},

		recieve: function (data) {
			if (data.prv) {
				this.restoreNetworkData(data);
			}

			if (data.fr) {
				Game.Multiplayer.restoreVectors(data.fr);
				this.fire(data.fr);
			}

			if (data.terminated) {
				this.die();
			}

			if (data.thrust) {
				this.thrust.sprite.visible = (data.thrust == 'on');
			}

			if (this.world)
				this.world.recieve(data);
		},

		resetShield: function() {
			this.shieldEnergy = 100;

			if (this.shieldTimer) // Already running
				return;

			this.setShieldVisible(true);

			var me = this;
			this.shieldTimer = setInterval(function() {
				me.shieldEnergy -= 10;
				if (me.shieldEnergy <= 0) {
					clearInterval(me.shieldTimer);
					me.shieldTimer = null,
					me.setShieldVisible(false);
				}
			}, 1000);
		},

		setShieldVisible: function(visible) {
			this.shield.sprite.visible = visible;
		},

		resetQuad: function() {
			if (this.quadEnabled)
				return;

			this.quadEnabled = true;

			this.setQuadVisible(true);

			var me = this;
			setTimeout(function() {
				me.setQuadVisible(false);
				me.quadEnabled = false;
			}, 10000);
		},

		setQuadVisible: function(visible) {
			this.quad.sprite.visible = visible;
		},

		updateHud: function (data) {
			if (this.hud) {

				if (!data)
					data = {
						energy: this.energy,
						directAmmo: this.directAmmo,
						homingAmmo: this.homingAmmo,
						bombAmmo: this.bombAmmo,
						eightBallAmmo: this.eightBallAmmo
					};

				this.hud.update(data);
			}
		},

		die: function() {
			if (this.shipState == 'exploding')
				return;

			this.explode();
		},

		explode: function() {
			var me = this;
			me.shipState = 'exploding';
			me.ship.sprite.visible = false;
			me.thrust.sprite.visible = false;
			me.quad.sprite.visible = false;
			me.explosion.sprite.visible = true;
			me.explosion.animate({ 
				fps: 30,
				loop: false,
				pingPong: false,
				scope: me,
				onFinish: function() {
					me.shipState = 'dead';
					Game.CompoundObject.prototype.die.apply(me, arguments);
				}
			});
		}
	});
});
