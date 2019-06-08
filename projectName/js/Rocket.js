"use strict";

// Define some constants
var LOG_BASE = 2; // What base should the logarithm function use.
var LOG_BASE_FACTOR = 1 / Math.log(LOG_BASE); // Get the factor to multiply natural logarithm by to translate to desired base.
var SHAPE = 0.8; // "Shape" value. Along with the base, this determines the intensity of the curve.

// Constructor
// game: the game
// sourcePlanet: the World this is coming from
// destinationPlanet: the World this is going to
// character: the Character riding this rocket
// speed: about how fast (pixel/second) the rocket should move
// key: texture atlas
// frame: frame of rocket in atlas
function Rocket(game, sourcePlanet, destinationPlanet, character, speed, key, frame) {
	
	// Call Phaser.Sprite constructor
	Phaser.Sprite.call(this, game, 53, 0, key, frame, 0);

	// Set anchor to at the center/near bottom of the rocket
	this.anchor.x = 0.5;
	this.anchor.y = 0.75;
	// Scale down the rocket
	this.scale.set(0.15);

	// Save the rocket's origin and put it there.
	this.source = sourcePlanet;
	this.x = sourcePlanet.x;
	this.y = sourcePlanet.y;

	// Save the rocket's origin in polar coordinates
	this.originRad = sourcePlanet.orbitRad;
	this.originAngle = sourcePlanet.orbitAngle;
	// Set the current polar coordinates to the origin
	this.orbitRad = this.originRad;
	this.orbitAngle = this.originAngle;

	// Save the rocket's destination
	this.destination = destinationPlanet;

	// Save the Character riding the rocket
	this.character = character;
	// Save the character's original scale
	this.characterScale = this.character.scale.x;
	// Set the character's scale to keep the same world size
	this.character.scale.set(this.character.scale.x / this.scale.x);

	// Save the desired speed
	this.speed = speed;

	// Add this to the world
	game.world.add(this);
	// Move this down a few levels in the render order so the foreground goes above
	// Not sure why, but sending game.foreground to the top of game.world does not actually send it to the top.
	game.world.moveDown(this);
	game.world.moveDown(this);
	game.world.moveDown(this);
	game.world.moveDown(this);

	// Calculate the first values for creating the curve
	var x0 = this.source.orbitAngle; // Origin theta
	var y0 = this.source.orbitRad; // Origin radius
	var x1 = this.destination.orbitAngle; // Terminal theta
	var y1 = this.destination.orbitRad; // Terminal radius

	// Save the origin theta and radius
	// These will stay the same throughout flight
	this.x0 = this.source.orbitAngle;
	this.y0 = this.source.orbitRad;

	// Make the first curve using initial values
	this.curve = new RocketCurve(x0, x1, y0, y1, SHAPE, LOG_BASE);
	// Save the direction this rocket is going in so it doesn't switch partway through
	this.clockwise = this.curve.reverse;
	this.orbitAngle = this.curve.x0;
	
}

// Set the prototype to a copy of Phaser.Sprite's prototype
Rocket.prototype = Object.create(Phaser.Sprite.prototype);
// Define the constructor
Rocket.prototype.constructor = Rocket;

// Define the Rocket's update function
Rocket.prototype.update = function() {

	// Change character age and happiness according to radius
	var ageChange = game.universalTime * ((this.orbitRad / 400) / 0.66) * game.time.elapsed / 1000;
	this.character.life -= ageChange;
	this.character.happiness += ageChange * (5 - Math.abs((100 - this.character.life) - this.character.home.currentTime));
	// Update the character's ahead/behind number, efficiency, and age on their profile
	this.character.UpdateAheadBehind();
	this.character.info.happiness.text = "Efficiency: " + Math.floor(this.character.happiness) + "%";
	this.character.info.age.text = Math.floor(20 + (100 - this.character.life)*.6) + " YEARS OLD";

	// If the character has somehow died,
	if(!this.character.alive) {
		// Destroy this
		this.destroy();
		// Allow others to go to the destination planet again
		this.destination.pendingArrival = false;
	}

	// Hide the profile if clicking anywhere but the character
	if(game.input.activePointer.leftButton.isDown){
		if(this.character.clicked == false){
			this.character.hideProfile();
		}
		else{
			this.character.showProfile();
		}
	}

	// If distance to the destination is less than 20 pixels...
	if(Math.pow(Math.pow(this.x - this.destination.x, 2) + Math.pow(this.y - this.destination.y, 2), 0.5) < 20) {
		// Put the character on the planet and get it ready to be interacted with again
		this.character.input.enableDrag();
		this.character.scale.set(this.characterScale);
		this.character.EnterPlanet(this.destination);
		// Destroy this rocket
		this.destroy();
	}

	// Save the delta time
	var delta = game.universalTime * game.time.elapsed / 1000;

	// Get the new values for this frame's curve
	// The destination will change because the destination is moving, but the origin stays the same
	var x0 = this.x0;
	var y0 = this.y0;
	var x1 = this.destination.orbitAngle;
	var y1 = this.destination.orbitRad;

	// Make a new curve for this frame
	this.curve = new RocketCurve(x0, x1, y0, y1, SHAPE, LOG_BASE, this.clockwise);

	// Estimate the change in theta required to keep constant speed using the derivative of the curve
	var deltaX = Math.pow(Math.pow(this.speed * delta, 2) / (1 + Math.pow(this.curve.derivative(this.orbitRad), 2)), 0.5);
	// Divide by radius because polar
	delta = deltaX / this.orbitRad;


	// Get the new polar coordinates...
	if(!this.curve.reverse) {
		this.orbitAngle += 2 * delta;
	} else {
		this.orbitAngle -= 2 * delta;
	}
	// Don't go past the destination theta
	if(this.orbitAngle > this.curve.x1 && !this.curve.reverse) {
		this.orbitAngle = this.curve.x1;
	} else if(this.orbitAngle < this.curve.x1 && this.curve.reverse) {
		this.orbitAngle = this.curve.x1;
	}
	// Get the new radius based on the new theta
	this.orbitRad = this.curve.y(this.orbitAngle);

	// Get the current x and y coordinates
	var x0 = this.x;
	var y0 = this.y;

	// Change the current x and y coordinates based on the new polar coordinates
	this.x = game.world.centerX + (this.orbitRad * Math.cos(this.orbitAngle));
	this.y = game.world.centerY - (this.orbitRad * Math.sin(this.orbitAngle));

	// Get the change of x and y coordinates this frame
	var dx = x0 - this.x;
	var dy = y0 - this.y;
	// Set the angle according to the change
	this.angle = (180 * Math.atan2(dy, dx) / Math.PI) - 90;
}