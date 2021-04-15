define(['Game'], function() {
    Game.HUD = Game.extend({}, {

        constructor: function (config) {
            Game.apply(this, config);

            if (!this.container)
                throw 'Stats require a container';

            this.render();
        },

        render: function() {
            if (!this.rendered) {
                this.rendered = true;

                this.values = {};
                this.elements = {};

                var hud, en, lat, dir;
                
                hud = document.createElement('div');
                hud.setAttribute("id", "hud");

                var enDiv = document.createElement('div');
                enDiv.innerHTML = "Energy: ";
                en = document.createElement('span');
                en.setAttribute("class", "value");
                en.innerHTML = "1000";
                enDiv.appendChild(en);
                hud.appendChild(enDiv);
                this.elements['energy'] = en;

                var latDiv = document.createElement('div');
                latDiv.innerHTML = "Latency: ";
                lat = document.createElement('span');
                lat.setAttribute("class", "value");
                lat.innerHTML = "-";
                latDiv.appendChild(lat);
                hud.appendChild(latDiv);
                this.elements['latency'] = lat;

                this.createWeaponDisplay(hud, 'directAmmo', "textures/rocket.png");
                this.createWeaponDisplay(hud, 'homingAmmo', "textures/rocket.png");
                this.createWeaponDisplay(hud, 'bombAmmo', "textures/bomb.png");
                this.createWeaponDisplay(hud, 'eightBallAmmo', "textures/8-ball.png");
                this.container.appendChild(hud);                
            }
        },

        createWeaponDisplay: function (hud, name, sprite) {
            var div, value;
            var div = document.createElement('div');
            div.innerHTML = '<img src="' + sprite + '" style="height:10px" /> ';
            value = document.createElement('span');
            value.setAttribute("class", "value");
            div.appendChild(value);
            hud.appendChild(div);
            this.elements[name] = value;
        },

        update: function (data) {
            if (!data)
                return;

            for (var p in data) {
                var v = this.values[p];
                var nv = data[p];
                if (nv != v) {
                    this.values[p] = nv;
                    var el = this.elements[p];
                    if (el)
                        el.innerHTML = nv.toFixed(0);
                }
            }
        }

    });
});