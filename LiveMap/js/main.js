(function() {
    var game = undefined;
    var kid_sprite = undefined;
    var mapPositions = [];
    var guides = [];
    var initPaket = undefined;

    /* Socket.IO */
    var socket = io('http://192.168.234.101:3000');

    socket.on('disconnect', function(data) {
        console.error('Connection loss:'+data);
    });

    socket.on('connect', function() {
        if(socket.connected == true) {
            console.log('connected');
        } else {
            console.log('failed');
        }
    });

    socket.on('initPaket', function(data) {
        console.log('received initPaket');
        initGame(data);
    });

    socket.on('notification', function(notification) {
        console.log('received notification');
        var idx = getExistingGuideIndex(notification);
        if(idx == -1) {
            var guide = new Guide(game, notification.Guide, notification.Position);
            if(guide != undefined) {
                console.log('new guide entered the system');
                guide.walkTo(notification.Position);
                guides.push(guide);
            }
        } else {
            console.log('guide update');
            guides[idx].walkTo(notification.Position);
        }
    });

    socket.on('guideEntered', function(data) {
        console.log('guide entered: ' + data.Guide);
    });

    socket.on('guideLeft', function(data) {
        console.log('guide left: ' + data.Guide)
    });

    function initGame(data) {
        if(game == undefined) {
            console.log('create new Phaser-Window');
            game = new Phaser.Game(800, 600, Phaser.AUTO, 'map_container');
            game.state.add('MapState', MapState);
        } else {
            kid_sprite = undefined;
            mapPositions = [];
            guides = [];
            initPaket = undefined;
        }

        initPaket = data;

        game.state.start('MapState');
    }

    var MapState = {

        preload: function() {
            console.log('phaser::preload');
            this.game.load.image('background', initPaket.Map);
            this.game.load.spritesheet('kid_sprite', 'assets\\sprites\\kid.png', 64, 50);
        },

        create: function() {
            console.log('phaser::create');

            game.time.advancedTiming = true;
            this.background = this.game.add.sprite(0, 0, 'background');
            this.background.width = 800;
            this.background.height = 600;

            initPaket.Points.map(function(point) {
                var mapPosition = new MapPosition(game, point.X, point.Y, point._id);
                mapPositions.push(mapPosition);
            });
        },

        update: function () {
            DT = this.time.physicsElapsedMS * 0.001;

            guides.map(function(guide) {
                guide.update();
            });

            mapPositions.map(function(mapPosition) {
                mapPosition.update();
            });
        }

    }

    var MapPosition = function(game, x, y, id) {
        var mapPosition =  game.add.graphics();
        mapPosition.id = id;
        mapPosition.X = x;
        mapPosition.Y = y;
        mapPosition.CurrentGuides = 0;

        mapPosition.beginFill(0xFFFFFF, 1);
        mapPosition.drawRoundedRect(x - 25, y - 25, 50, 50, 10);

        mapPosition.guideCountText = game.add.text(x, y+3, mapPosition.CurrentGuides, { fill: "#FFFFFF", font: '28px Arial', align: "center", weight: 'bold' });
        mapPosition.guideCountText.anchor.set(0.5);

        mapPosition.update = function() {
            this.guideCountText.setText(this.CurrentGuides);

            if(this.CurrentGuides >= 2) {
                this.clear();
                mapPosition.beginFill(0xF4511E, 1);
                mapPosition.drawRoundedRect(x - 25, y - 25, 50, 50, 10);
            } else {
                this.clear();
                mapPosition.beginFill(0x66BB6A, 1);
                mapPosition.drawRoundedRect(x - 25, y - 25, 50, 50, 10);
            }
        }

        return mapPosition;
    }

    var Guide = function(game, data) {


            var labelWidth = 100;
            var labelHeight = 30;
            var labelCorner = 10;

            var guide = game.add.sprite(0, 0, 'kid_sprite');
            guide.animations.add('right', [0,1,2,3,4,5,6,7,8], 10, true);
            guide.animations.add('left', [9,10,11,12,13,15,16,17,18], 10, true);

            console.log('name: ' + data.name);
            nameText = game.add.text(guide.width / 2, -labelHeight / 2, data.name, { fill: "#FFFFFF", font: '22px Arial', align: "center", weight: 'bold' });
            nameText.anchor.set(0.5);

            var nameLabel = game.add.graphics();
            nameLabel.beginFill(0x2962FF, 1);
            nameLabel.drawRoundedRect(guide.width / 2 - labelWidth / 2,  -labelHeight, labelWidth, labelHeight, labelCorner);

            nameLabel.addChild(nameText);
            guide.addChild(nameLabel);

            guide.speed = 75;
            guide.guideID = data.id;
            guide.name = data.name;
            guide.isWalking = false;
            guide.walkToPositionIndex = undefined;

            guide.walk = function(direction) {
                guide.animations.play(direction);
            }

            guide.walkTo = function(positionID) {
                if(this.timer != undefined) {
                    console.log('stopping timer');
                    game.time.events.remove(this.timer);
                }

                this.timer = game.time.events.add(Phaser.Timer.MINUTES * 10, this.destroyGuide, this);

                var idx = findMapPositionByIDIndex(positionID);

                if(idx != undefined) {
                    if(this.walkToPositionIndex != undefined && this.walkToPositionIndex != -1) {
                        mapPositions[this.walkToPositionIndex].CurrentGuides = mapPositions[this.walkToPositionIndex].CurrentGuides - 1;
                    }

                    this.walkToPositionIndex = idx;
                    mapPositions[idx].CurrentGuides = mapPositions[idx].CurrentGuides + 1;
                    this.isWalking = true;

                    if(mapPositions[idx].X > this.x) {
                        guide.walk('right');
                    }
                    else {
                        guide.walk('left');
                    }
                }
            }

            guide.update = function() {
                if(this.isWalking == true) {
                    guide.alpha = 1;

                    var position = mapPositions[this.walkToPositionIndex];
                    var distance = game.math.distance(position.X, position.Y, this.x, this.y);

                    if(distance < 1) {
                        this.isWalking = false;
                        guide.animations.stop(null, true);
                    }

                    var direction = {
                        x: (position.X - this.x) / distance,
                        y: (position.Y - this.y) / distance
                    }

                    this.x += direction.x * this.speed * DT;
                    this.y += direction.y * this.speed * DT;
                } else {
                    guide.alpha = 0;
                }
            }

            guide.destroyGuide = function() {

                if(this.walkToPositionIndex != undefined && this.walkToPositionIndex != -1) {
                    mapPositions[this.walkToPositionIndex].CurrentGuides = mapPositions[this.walkToPositionIndex].CurrentGuides - 1;
                }

                var idx = getGuideIndex(this);

                if(idx != -1) {
                    guides.splice(idx, 1);
                }

                this.destroy();
            }

            return guide;
    }

    function findMapPositionByIDIndex(positionID) {
        return mapPositions.findIndex(function(position) {
             return position.id == positionID;
         });
    }

    function getExistingGuideIndex(notification) {
        return guides.findIndex(function(guide) {
            return guide.guideID == notification.Guide.id;
        });
    }

    function getGuideIndex(g) {
        return guides.findIndex(function(guide) {
            return guide.guideID == g.guideID;
        });
    }
})();