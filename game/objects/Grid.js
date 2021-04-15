define(['Game'], function () {
    Game.SceneObjects = Game.apply(Game.SceneObjects || {}, {
        createGridGeometry: function (from, to, step) {
            
            var geometry = new THREE.Geometry();

            for (var i = from; i <= to; i += step) {

                geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(from, i, 0)));
                geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(to, i, 0)));

                geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(i, from, 0)));
                geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(i, to, 0)));
            }

            return geometry;
        },

        addCoordSys: function (scene) {                
            var xAxisMat = new THREE.LineBasicMaterial({ color: 0xFF0000, opacity: 0.5, linewidth: 1 });
			var yAxisMat = new THREE.LineBasicMaterial({ color: 0x00FF00, opacity: 0.5, linewidth: 1 });

            var xAxisGeo = new THREE.Geometry();
            xAxisGeo.vertices.push(new THREE.Vertex(new THREE.Vector3(0, 0, 0)));
            xAxisGeo.vertices.push(new THREE.Vertex(new THREE.Vector3(100, 0, 0)));

            var yAxisGeo = new THREE.Geometry();
            yAxisGeo.vertices.push(new THREE.Vertex(new THREE.Vector3(0, 0, 0)));
            yAxisGeo.vertices.push(new THREE.Vertex(new THREE.Vector3(0, 100, 0)));				

			scene.add(new THREE.Line(xAxisGeo, xAxisMat, THREE.LinePieces));
            scene.add(new THREE.Line(yAxisGeo, yAxisMat, THREE.LinePieces));				
        }
    });
});