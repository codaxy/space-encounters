define('objects/Stars', ['Object'], function () {
    Game.Stars = Game.extend(Game.Object, {
        density: 50, //number of stars per 100x100 square
        constructor: function (config) {
            Game.Object.call(this, config);
            
            if (!this.world)
                throw 'Stars need a world.';
            if (!this.scene)
                throw 'Stars need a scene.';

            this.addStars(1, 0.7 * this.density, 0.3 * Game.scaleFactor); //far
            this.addStars(1.5, 0.29 * this.density, 0.4 * Game.scaleFactor); //near
            this.addStars(3, 0.01 * this.density, 0.5 * Game.scaleFactor); //very near
        },

        addStars: function (size, density, opacity) {
            
            var w = this.world;
            var width = w.bounds.right - w.bounds.left;
            var height = w.bounds.right - w.bounds.left;
            var count = width / 100 * height / 100 * density;

            var COLORS = 10;            
            var colors = [];
            for (var i = 0; i < COLORS; i++) {
                var c = new THREE.Color(0xFFFFFF);
                c.setRGB((1 + i) / COLORS * opacity, (1 + i) / COLORS * opacity, 0.8 * (1 + i) / COLORS * opacity);
                colors.push(c);
            }

            var geometry = new THREE.Geometry();            
            for (var i = 0; i < count; i++) {
                var x = Math.random() * width + w.bounds.left;
                var y = Math.random() * height + w.bounds.top;
                var v = new THREE.Vertex(new THREE.Vector3(x, y, -99));
                geometry.vertices.push(v);
                geometry.colors.push(colors[i % COLORS]);
            }

            var material = new THREE.ParticleBasicMaterial({
                size: size,
                depthTest: false,
                transparent: true,
                opacity: 1,
                sizeAttenuation: false,
                vertexColors: THREE.VertexColors
            });

            var stars = new THREE.ParticleSystem(geometry, material);
            this.scene.add(stars);
        }
    });
});