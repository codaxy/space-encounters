define(['Game'], function () {
    Game.UserControls = function (domElement) {

        this.domElement = (domElement !== undefined) ? domElement : document;
        this.key = {};
        var me = this;

        function processEvent(event, value) {
            switch (event.keyCode) {

                case 38: /*up*/
                    me.up = value;
                    event.preventDefault();
                    break;

                case 37: /*left*/
                    me.left = value;
                    event.preventDefault();
                    break;

                case 40: /*down*/
                    me.down = value;
                    event.preventDefault();
                    break;

                case 39: /*right*/
                    me.right = value;
                    event.preventDefault();
                    break;

                case 83: /*S*/
                case 65: /*A*/
                case 87: /*W*/
                case 68: /*D*/
                case 81: /*Q*/
                case 69: /*E*/
                case 82: /*R*/
                case 70: /*F*/
                    me.key[event.keyCode] = value;
                    event.preventDefault();
                    break;
            }
        };

        function onKeyDown(event) {
            processEvent(event, true);
        };

        function onKeyUp(event) {
            processEvent(event, false);
        };

        this.domElement.addEventListener('keydown', onKeyDown, false);
        this.domElement.addEventListener('keyup', onKeyUp, false);
    };
});
