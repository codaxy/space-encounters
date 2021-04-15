define(['three/Three'], function () {
    if (window.Game)
        return;
    window.Game = {
        apply: function (a, b) {
            if (!a || !b)
                return a;
            for (var p in b)
                a[p] = b[p];
            return a;
        },

        applyIf: function (a, b) {
            if (!a || !b)
                return a;
            for (var p in b)
                if (a[p] === undefined)
                    a[p] = b[p];
            return a;
        },

        clone: function (a) {
            return Game.apply({}, a);
        },

        extend: function (base, override) {

            var constructor = function () {
                var c = override.constructor || base.constructor;
                c.apply(this, arguments);
                return this;
            }
            constructor.prototype = Game.apply(Game.clone(base.prototype), override);
            return constructor;
        },

        textures: {},

        getTexture: function (path) {
            var t = Game.textures[path];
            if (t)
                return t;
            var map = THREE.ImageUtils.loadTexture(path);
            return Game.textures[path] = map;
        },

        scaleFactor: 1,

        guidBase: null,
        guidOffset: 0,

        newGuid: function () {
            if (!Game.World.guidBase)
                return null;
            return Game.World.guidBase + (++Game.World.guidOffset);
        }
    };
});