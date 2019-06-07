"use strict";

var LOG_BASE = 2;
var LOG_BASE_FACTOR = 1 / Math.log(LOG_BASE);
var SHAPE = 0.8;


function Rocket(game, sourcePlanet, destinationPlanet, character, speed, key, frame) {
	// Call Phaser.Sprite constructor
	Phaser.Sprite.call(this, game, 53, 0, key, frame, 0);

	this.anchor.x = 0.5;
	this.anchor.y = 0.75;
	this.scale.set(0.15);

	this.source = sourcePlanet;
	this.x = sourcePlanet.x;
	this.y = sourcePlanet.y;

	this.originRad = sourcePlanet.orbitRad;
	this.originAngle = sourcePlanet.orbitAngle;

	this.orbitRad = this.originRad;
	this.orbitAngle = this.originAngle;

	this.destination = destinationPlanet;

	this.character = character;
	this.characterScale = this.character.scale.x;
	this.character.scale.set(this.character.scale.x / this.scale.x);

	this.speed = speed;

	this.timer = game.time.create(false);
	this.timer.start();

	game.world.add(this);
	game.world.moveDown(this);
	game.world.moveDown(this);
	game.world.moveDown(this);
	game.world.moveDown(this);

	/*
	// Get the angle of the source
	var x0 = this.source.orbitAngle;
	while(x0 < 0) {
		x0 += Math.PI * 2;
	}
	x0 = x0 % (Math.PI * 2);

	// Get the radius of the source
	var y0 = this.source.orbitRad;

	// Get the angle of the destination
	var x1 = this.destination.orbitAngle;
	while(x1 < 0) {
		x1 += Math.PI * 2;
	}
	x1 = x1 % (Math.PI * 2);
	while(x1 < x0) {
		x1 += Math.PI * 2;
	}

	// Get the radius of the destination
	var y1 = destinationPlanet.orbitRad;
	*/

	var x0 = this.source.orbitAngle;
	var y0 = this.source.orbitRad;
	var x1 = this.destination.orbitAngle;
	var y1 = this.destination.orbitRad;

	this.x0 = this.source.orbitAngle;
	this.y0 = this.source.orbitRad;

	//console.log(x0+" "+x1+" "+y0+" "+y1);

	this.curve = new RocketCurve(x0, x1, y0, y1, SHAPE, LOG_BASE);
	this.clockwise = this.curve.reverse;
	//console.log(this.clockwise);
	this.orbitAngle = this.curve.x0;
	

}

Rocket.prototype = Object.create(Phaser.Sprite.prototype);
Rocket.prototype.constructor = Rocket;

Rocket.prototype.update = function() {

	this.character.UpdateAheadBehind();

	if(!this.character.alive) {
		this.destroy();
		this.destination.pendingArrival = false;
	}

	if(game.input.activePointer.leftButton.isDown){
		if(this.character.clicked == false){
			//console.log("hide1");
			this.character.hideProfile();
		}
		else{
			this.character.showProfile();
		}
	}

	if(Math.pow(Math.pow(this.x - this.destination.x, 2) + Math.pow(this.y - this.destination.y, 2), 0.5) < 20) {
		this.character.input.enableDrag();
		this.character.scale.set(this.characterScale);
		this.character.EnterPlanet(this.destination);
		this.destroy();
	}

	var delta = game.universalTime * game.time.elapsed / 1000;

	/*
	// Get the orbitAngle of destination in [0, 2*PI)
	var destinationAngle = this.destination.orbitAngle;
	while(destinationAngle < 0) {
		destinationAngle += Math.PI * 2;
	}
	destinationAngle = destinationAngle % (Math.PI * 2);

	// Put the orbitAngle of this in [0, 2*PI)
	while(this.orbitAngle < 0) {
		this.orbitAngle += Math.PI * 2;
	}
	this.orbitAngle = this.orbitAngle % (Math.PI * 2);

	if(destinationAngle < this.orbitAngle) {
		destinationAngle += 2 * Math.PI;
	}

	// Determine clockwise/counter clockwise
	var clockwise = false;
	if(destinationAngle - this.orbitAngle > Math.PI) {
		clockwise = true;
	}

	// Calculate the importance of angle/orbit at this point
	var angleProportion;
	if(!clockwise) {
		angleProportion = (destinationAngle - this.orbitAngle) / (2 * Math.PI);
	} else {
		angleProportion = (this.orbitAngle - destinationAngle + (2 * Math.PI)) / (2 * Math.PI);
	}

	// Find the rate of change of the orbitRad. This does not yet factor the time since last frame.
	// This should be a fraction of the distance from the current orbitRad to the destination orbitRad.
	// The fraction is (1 - angleProportion)^10, which means the radChange is less when the angle is further, more when the angle is closer
	var radChange = this.speed * ((this.destination.orbitRad - this.orbitRad) / 45) * Math.pow(1 - angleProportion, 10);
	// Cap the radChange by the speed of the rocket
	if(Math.abs(radChange) > this.speed) {
		if(radChange > 0) {
			radChange = this.speed;
		} else {
			radChange = -this.speed;
		}
	}

	// Find the rate of change of the orbitAngle. This does not yet factor the time since last frame.
	// This is based on the found radChange so that the rocket's total motion is according to its speed
	var angleChange = (this.speed - Math.abs(radChange)) / this.orbitRad;

	// Multiply the angleChange by -1 if going clockwise
	if(clockwise) {
		angleChange *= -1;
	}	*/



	//var x0 = this.source.orbitAngle;
	//var y0 = this.source.orbitRad;
	var x0 = this.x0;
	var y0 = this.y0;
	var x1 = this.destination.orbitAngle;
	var y1 = this.destination.orbitRad;

	//console.log(x0+" "+x1+" "+y0+" "+y1);

	this.curve = new RocketCurve(x0, x1, y0, y1, SHAPE, LOG_BASE, this.clockwise);

	//console.log(this.curve.yPrime(this.orbitAngle));
	var deltaX = Math.pow(Math.pow(this.speed * delta, 2) / (1 + Math.pow(this.curve.derivative(this.orbitRad), 2)), 0.5);
	//console.log(deltaX);
	delta = deltaX / this.orbitRad;

	// Do the change
	//this.orbitRad += radChange * delta;
	//this.orbitAngle += angleChange * delta;
	if(!this.curve.reverse) {
		this.orbitAngle += 2 * delta;
	} else {
		this.orbitAngle -= 2 * delta;
	}
	if(this.orbitAngle > this.curve.x1 && !this.curve.reverse) {
		this.orbitAngle = this.curve.x1;
	} else if(this.orbitAngle < this.curve.x1 && this.curve.reverse) {
		this.orbitAngle = this.curve.x1;
	}
	this.orbitRad = this.curve.y(this.orbitAngle);

	var x0 = this.x;
	var y0 = this.y;

	this.x = game.world.centerX + (this.orbitRad * Math.cos(this.orbitAngle));
	this.y = game.world.centerY - (this.orbitRad * Math.sin(this.orbitAngle));

	var dx = x0 - this.x;
	var dy = y0 - this.y;

	this.angle = (180 * Math.atan2(dy, dx) / Math.PI) - 90;
}