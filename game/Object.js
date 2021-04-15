define(['Game'], function () {

	// Z-index ordering fix (TODO: remove this upon three.js upgrade)
	var zPosition = 1.0;

    Game.Object = Game.extend({ prototype: {} }, {
		actor: null, // THREE.Object3D, or its subclass:
		
		parent: null,

        constructor: function (config) {
            var me = this;

			this.position = new THREE.Vector3(0, 0, zPosition);
			this.rotation = 0;
			this.velocity = new THREE.Vector3(0, 0, 0);

			zPosition += 0.1;

            Game.apply(this, config);

            if (this.world)
                this.spawn(this.world);
        },

        advance: function (dt) {
			if (this.actor) {
				var rotOffset = this.rotationOffset || 0;
				if (this.parent) {
					rotOffset += this.parent.rotation + (this.parent.rotationOffset || 0);
				}

                this.actor.position = this.position;
				if (this.actor instanceof THREE.Sprite) {
	                this.actor.rotation = -(this.rotation + rotOffset); // sprite rotation uses opposite logic (rotation around z-axis) which is difficult to follow
				}
				else // Three.Object3D 
					this.actor.rotation.set(0, 0, (this.rotation + rotOffset));
			}
        },

        onSpawn: function () { },

        spawn: function (world) {
            var me = this;
            world.add(me);
            me.onSpawn();
        },

        onDie: function () { },

        die: function () {
            if (this.world) {
                this.onDie();
                this.world.remove(this);                
            }
        },

        hitRadius: 0,

        onHit: function (hitInfo) {

        },

        pointAt: function (position) {
            var r = position.clone().subSelf(this.position);
            this.rotation = Math.atan2(r.y, r.x);
        },

        rescale: function () {
        },
		
        getOrientationVec: function (delta) {
            var angle = this.rotation + (delta || 0);
            return new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
        },

        getOrientationVelocity: function () {
            var v = this.getOrientationVec();
            return v.multiplyScalar(v.dot(this.velocity));
        },

        toGlobalCoordinates: function (v) {
            var sin = Math.sin(this.rotation);
            var cos = Math.cos(this.rotation);
            var res = new THREE.Vector3(v.x * cos - v.y * sin, v.x * sin + v.y * cos, v.z);
            res.addSelf(this.position);
            return res;
        }
    });
});


