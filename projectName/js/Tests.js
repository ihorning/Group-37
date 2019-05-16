"use strict";

var RocketTest = function(game) {};
RocketTest.prototype = {
	preload: function() {
		game.load.atlas('spaceatlas', 'assets/img/spaceatlas.png', 'assets/img/spaceatlas.json');
		game.load.atlas("barAtlas", "assets/img/barAtlas.png", "assets/img/barAtlas.json");
	},
	create: function() {

		this.blackHole = this.add.sprite(game.width/2, game.height/2, 'spaceatlas', 'BlackHole');
		this.blackHole.anchor.setTo(0.5);

		this.orbit1 = this.add.sprite(game.width/2, game.height/2, 'spaceatlas', 'Orbit');
		this.orbit1.anchor.setTo(0.5);
		this.orbit1.scale.setTo(0.33);
		this.orbit2 = this.add.sprite(game.width/2, game.height/2, 'spaceatlas', 'Orbit');
		this.orbit2.anchor.setTo(0.5);
		this.orbit2.scale.setTo(0.5);
		this.orbit3 = this.add.sprite(game.width/2, game.height/2, 'spaceatlas', 'Orbit');
		this.orbit3.anchor.setTo(0.5);
		this.orbit3.scale.setTo(0.66);
		this.orbit4 = this.add.sprite(game.width/2, game.height/2, 'spaceatlas', 'Orbit');
		this.orbit4.anchor.setTo(0.5);
		this.orbit4.scale.setTo(0.83);
		this.orbit5 = this.add.sprite(game.width/2, game.height/2, 'spaceatlas', 'Orbit');
		this.orbit5.anchor.setTo(0.5);

		this.orbitBaseSize = this.orbit5.width / 2;
		console.log(this.orbitBaseSize);

		this.reallySlow = new World(game, 0.33 * 450, 1 * Math.PI, 4, 'spaceatlas', 'ReallySlowPlanet', 0.5);
		this.slow = new World(game, 0.5 * 450, 0.123523 * Math.PI, 5, 'spaceatlas', 'SlowPlanet', 0.75);
		this.medium = new World(game, 0.66 * 450, 1.897 * Math.PI, 3, 'spaceatlas', 'MediumPlanet', 1);
		this.fast = new World(game, 0.83 * 450, 1.23432 * Math.PI, 5, 'spaceatlas', 'FastPlanet', 1.25);
		this.reallyFast = new World(game, 1.0 * 450, 1.554 * Math.PI, 2, 'spaceatlas', 'ReallyFastPlanet', 1.75);

		this.planetList = [this.reallySlow, this.slow, this.medium, this.fast, this.reallyFast];

		/*this.planetList[0].radius = this.orbit1.scale.x * this.orbitBaseSize;
		this.planetList[1].radius = this.orbit2.scale.x * this.orbitBaseSize;
		this.planetList[2].radius = this.orbit3.scale.x * this.orbitBaseSize;
		this.planetList[3].radius = this.orbit4.scale.x * this.orbitBaseSize;
		this.planetList[4].radius = this.orbit5.scale.x * this.orbitBaseSize;

		for(var i = 0; i < this.planetList.length; i++) {
			this.planetList[i].orbitAngle = Math.random() * 2 * Math.PI;
			this.planetList[i].speed = (Math.PI * Math.random() / this.planetList[i].radius);
			if(Math.random() > 0.5) {
				this.planetList[i].speed *= -1;
			}
		}

		this.rocket = game.add.sprite(game.world.centerX, game.world.centerY, "barAtlas", "WorkProgress");
		this.rocket.speed = 100;
		this.rocket.planet = this.reallySlow;
		this.rocket.orbitAngle = this.reallySlow.orbitAngle;
		this.rocket.radius = this.reallySlow.radius;
		this.rocket.direction = true;

		this.rocket.anchor.set(0.5);*/

		this.rocket1 = new Rocket(game, this.reallySlow, this.reallyFast, 100, "barAtlas", "WorkProgress");
		this.rocket2 = new Rocket(game, this.fast, this.slow, 100, "barAtlas", "WorkProgress");
		this.rocket3 = new Rocket(game, this.fast, this.reallySlow, 100, "barAtlas", "WorkProgress");

	},
	update: function() {
		var delta = game.time.elapsed / 1000;

		/*for(var i = 0; i < this.planetList.length; i++) {
			this.planetList[i].orbitAngle += delta * this.planetList[i].speed;
			while(this.planetList[i].orbitAngle < 0) {
				this.planetList[i].orbitAngle += 2 * Math.PI;
			}
			this.planetList[i].x = game.world.centerX + (this.planetList[i].radius * Math.cos(this.planetList[i].orbitAngle));
			this.planetList[i].y = game.world.centerY - (this.planetList[i].radius * Math.sin(this.planetList[i].orbitAngle));
		}
		if(Math.pow(Math.pow(this.rocket.x - this.rocket.planet.x, 2) + Math.pow(this.rocket.y - this.rocket.planet.y, 2), 0.5) < 10) {
			this.rocket.planet.tint = 0xffffff;
			var choice = Math.round(Math.random() * 4);
			this.rocket.planet = this.planetList[choice];
			this.rocket.planet.tint = 0xaaaaaa;
		} else {

			var destinationAngle = this.rocket.planet.orbitAngle;
			while(destinationAngle < 0) {
				destinationAngle += Math.PI * 2;
			}
			destinationAngle = destinationAngle % (Math.PI * 2);
			while(this.rocket.orbitAngle < 0) {
				this.rocket.orbitAngle += Math.PI * 2;
			}
			this.rocket.orbitAngle = this.rocket.orbitAngle % (Math.PI * 2);
			if(destinationAngle < this.rocket.orbitAngle) {
				destinationAngle += 2 * Math.PI;
			}

			if(destinationAngle - this.rocket.orbitAngle > Math.PI) {
				this.rocket.direction = false;
			} else {
				this.rocket.direction = true;
			}

			var angleProportion = 0;
			if(this.rocket.direction) {
				angleProportion = (destinationAngle - this.rocket.orbitAngle) / (2 * Math.PI);
			} else {
				angleProportion = (this.rocket.orbitAngle - destinationAngle + (2 * Math.PI)) / (2 * Math.PI);
			}
			//console.log(destinationAngle+" "+this.rocket.orbitAngle);
			//console.log(angleProportion);

			var radChange = this.rocket.speed * ((this.rocket.planet.radius - this.rocket.radius) / (0.1 * this.orbitBaseSize)) * Math.pow(1 - (angleProportion), 10);
			if(Math.abs(radChange) > this.rocket.speed) {
				radChange = (radChange / Math.abs(radChange)) * this.rocket.speed;
			}
			//var angleChange = ((this.rocket.speed * delta) - radChange);
			var angleChange = (this.rocket.speed - Math.abs(radChange));
			//console.log(radChange + angleChange);
			angleChange = angleChange / this.rocket.radius;
			if(!this.rocket.direction) {
				angleChange *= -1;
			}
			//console.log(angleChange);
			this.rocket.radius += radChange * delta;
			this.rocket.orbitAngle += angleChange * delta;
		}
		this.rocket.x = game.world.centerX + (this.rocket.radius * Math.cos(this.rocket.orbitAngle));
		this.rocket.y = game.world.centerY - (this.rocket.radius * Math.sin(this.rocket.orbitAngle));*/
	}
}