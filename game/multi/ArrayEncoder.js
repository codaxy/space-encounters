define(['Game'], function() {
    Game.ArrayEncoder = Game.extend({}, {     
        
        scale: [1, 10, 100, 1000, 10000],

        constructor: function(config) {
            Game.apply(this, config);
        },

        clear: function() {
            this.data = [];
        },

        write: function(number) {
            this.data.push(number);
        },

        writeNumber: function(number, precision) {
            
            if (precision != undefined) 
                number = Math.round(number * this.scale[precision]) / this.scale[precision];
            
            this.data.push(number);
        },

        writeXY: function(vec, precision) {
            this.writeNumber(vec.x, precision);
            this.writeNumber(vec.y, precision);
        },

        writeXYZ: function(vec, precision) {
            this.writeNumber(vec.x, precision);
            this.writeNumber(vec.y, precision);
            this.writeNumber(vec.z, precision);
        },

        toArray: function() { return this.data;},

        readIndex: 0,

        load: function(data) {
            this.data = data;
            this.readIndex = 0;
        },

        read: function () {
            return this.data[this.readIndex++];
        },

        readNumber: function() {
            return this.data[this.readIndex++];
        },

        readXY: function(z) {
            
            var x = this.readNumber();
            var y = this.readNumber();
            if (z==undefined)
                z = 0;
            return new THREE.Vector3(x, y, z);
        },

        readXYZ: function() {            
            var x = this.readNumber();
            var y = this.readNumber();
            var z = this.readNumber();
            return new THREE.Vector3(x, y, z);
        }
    });
});