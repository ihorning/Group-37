"use strict";

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

	game.add.existing(this);

}

Rocket.prototype = Object.create(Phaser.Sprite.prototype);
Rocket.prototype.constructor = Rocket;

Rocket.prototype.update = function() {
	if(Math.pow(Math.pow(this.x - this.destination.x, 2) + Math.pow(this.y - this.destination.y, 2), 0.5) < 20) {
		console.log("I made it!");
		this.character.scale.set(this.characterScale);
		this.character.EnterPlanet(this.destination);
		this.destroy();
	}

	var delta = game.time.elapsed / 1000;

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
	}	

	// Do the change
	this.orbitRad += radChange * delta;
	this.orbitAngle += angleChange * delta;

	var x0 = this.x;
	var y0 = this.y;

	this.x = game.world.centerX + (this.orbitRad * Math.cos(this.orbitAngle));
	this.y = game.world.centerY - (this.orbitRad * Math.sin(this.orbitAngle));

	var dx = x0 - this.x;
	var dy = y0 - this.y;

	this.angle = (180 * Math.atan2(dy, dx) / Math.PI) - 90;
}