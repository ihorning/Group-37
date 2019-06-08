"use strict";

// Define a path to draw a more precise circle than in the drawCircle function of graphics
var circlePath = [];
var circleDetail = 1000;
for(var i = 0; i < circleDetail; i++) {
	circlePath[circlePath.length] = new Phaser.Point(Math.cos(2 * Math.PI * i / (circleDetail - 1)), Math.sin(2 * Math.PI * i / (circleDetail - 1)));
}

// Constructor
// game: the game
// orbitRad: the initial distance to the black hole
// oribtAngle: the initial angle about the black hole
// orbitSpeed: how fast this will orbit the black hole
// key: texture atlas
// frame: frame of this World in atlas
//// timeMultiplier:
// name: the name of this planet
function World(game, orbitRad, orbitAngle, orbitSpeed, key, frame, timeMultiplier, name) {
	// Call Phaser.Sprite constructor
	Phaser.Sprite.call(this, game, -1000, -1000);

	// Set the anchor point to the center
	this.anchor.set(0.5);

	// Save the name
	this.name = name;

	// Save the orbit radius/angle/speed
	this.orbitRad = orbitRad;
	this.orbitAngle = orbitAngle;
	this.orbitSpeed = orbitSpeed;

	// Create a graphics object on the background that will show this World's orbit path/radius
	this.orbit = game.background.add(game.make.graphics());

	// Set the initial x and y coordinates based on orbit radius/angle
	this.x = game.world.centerX + (this.orbitRad * Math.cos(this.orbitAngle));
	this.y = game.world.centerY - (this.orbitRad * Math.sin(this.orbitAngle));


	// Store the time multiplier
	this.timeMultiplier = timeMultiplier;
	
	// Set the current time to 0 to start
	this.currentTime = 0;

	// Add this to the game
	game.add.existing(this);

	// Add a WorkBar as a child
	this.job = new WorkBar(game, 0, 0, this.timeMultiplier);
	this.addChild(this.job);

	// Start with character as null
	this.character = null;
	// No arrivals pending yet
	this.pendingArrival = null;

	// Start out not dying
	this.death = false;
	// Create a sound to play when dying
	this.deathSound = game.add.audio("blackHole");

	// Create a WorldSpin object to visualize the planet
	this.spin = new WorldSpin(game, key, frame, this.timeMultiplier, this);
}

// Set the prototype to a copy of the Phaser.Sprite prototype
World.prototype = Object.create(Phaser.Sprite.prototype);
// Define the constructor
World.prototype.constructor = World;

// Define the World's update function
World.prototype.update = function() {
	// Calculate a time difference variable based on relative time, global time, and time since last frame
	var delta = this.timeMultiplier * game.universalTime * game.time.elapsed / 1000;
	// Update currentTime with the new time delta
	this.currentTime += delta;

	// Calculate how much the radius should move
	// This depends on the work progress
	var progressFactor = (75 - this.job.bar.percent) / 100;
	if(progressFactor < 0) {
		progressFactor = -Math.pow(progressFactor, 2);
	}
	// Update the orbit radius
	this.orbitRad -= (delta / this.timeMultiplier) * progressFactor;
	// Make sure it does not go below zero
	if(this.orbitRad < 0) {
		this.orbitRad = 0;
	}
	// Update the time multiplier according to new distance from the black hole
	this.timeMultiplier = (this.orbitRad / 400) / 0.66;

	// Clear the orbit line
	this.orbit.clear();
	// Reset the style
	this.orbit.lineStyle(2.2 - (1.3 * Math.sin(2 * this.currentTime)), 0xffffff, 0.2 + (0.05 * (Math.sin(2 * (this.currentTime + 1)))));
	// Define a new path based on the circle path variable
	var newCirclePath = [];
	for(var i = 0; i < circlePath.length; i++) { // Each point is multiplied by the orbit radius and offset to be centered around the black hole
		newCirclePath[i] = new Phaser.Point((circlePath[i].x * this.orbitRad) + game.world.centerX, (circlePath[i].y * this.orbitRad) + game.world.centerY);
	}
	// Draw the new circle path
	this.orbit.drawPolygon(newCirclePath);

	// Update the orbit angle
	this.orbitAngle += delta * this.orbitSpeed / (this.orbitRad);
	// Keep it in range [0, 2*PI)
	this.orbitAngle = this.orbitAngle % (Math.PI * 2);
	

	// If too close to the center...
	if(Math.pow(this.x - game.world.centerX, 2) + Math.pow(this.y - game.world.centerY, 2) <= 5184){
		if(this.death === false){ // If not started dying...
			// Start dying, add tweens to fly into the black hole
			this.death = true;
			this.shrink = game.add.tween(this.scale).to({
				x: 0.1,
				y: 0.1
			}, 400, Phaser.Easing.Linear.None, true);
			this.shrinkSpin = game.add.tween(this.spin.scale).to({
				x: 0.1,
				y: 0.1
			}, 400, Phaser.Easing.Linear.None, true);
			this.shrinkSpinMask = game.add.tween(this.spin.mask.scale).to({
				x: 0.1,
				y: 0.1
			}, 400, Phaser.Easing.Linear.None, true);
			this.zoom = game.add.tween(this).to({
				x: game.world.centerX,
				y: game.world.centerY
			}, 400, Phaser.Easing.Linear.None, true);
			this.zoom.onComplete.add(this.die, this);	
		}
	}
	else if(this.death === false){ // If not too close and not dying...
		// Set the x and y position according to orbit radius and angle
		this.x = game.world.centerX + (this.orbitRad * Math.cos(this.orbitAngle));
		this.y = game.world.centerY - (this.orbitRad * Math.sin(this.orbitAngle));
	}


	if(this.character == null) { // If no character,
		this.job.bar.sleep = true; // Turn off job progress
	} else { // If there is a character,
		// Update the job's efficiency
		this.job.efficiency = this.character.efficiency;
		if(!this.job.bar.complete) { // If the job is NOT done,
			this.job.bar.sleep = false; // Turn on job progress
		}
		// Update the character, but not if it is being updated in the world (coincides with drawLine)
		if(!this.character.drawLine) {
			this.character.update(); // Run character's update function
		}
	}

	// Run job's update function
	this.job.update();
}

// Function called when the planet dies
World.prototype.die = function(){
	console.log("dead");
	this.deathSound.play("", 0, 0.9, false);
	this.x = 10000000;
	this.y = 10000000;
	if(this.character != null){
			this.character.Die();
	}
}

// Constructor for WorldSpin
function WorldSpin(game, key, frame, timeMultiplier, planet) {
	// Call Phaser.TileSprite constructor
	Phaser.TileSprite.call(this, game, -1000, -1000, 70, 70, key, frame);

	this.planet = planet;
	this.timeMultiplier = timeMultiplier;
	this.pmask = game.add.graphics(0, 0);

    //	Shapes drawn to the Graphics object must be filled.
    this.pmask.beginFill(0xfacade);

    //	Here we'll draw a circle
    this.pmask.drawCircle(0, 0, 70);

    //	And apply it to the Sprite
    this.mask = this.pmask;

	// Set the anchor point to the center
	this.anchor.set(0.5);

	// Add this to the game
	game.add.existing(this);
}

// Set the prototype to a copy of Phaser.TileSprite prototype
WorldSpin.prototype = Object.create(Phaser.TileSprite.prototype);
// Define the constructor
WorldSpin.prototype.constructor = WorldSpin;

// Define the WorldSpin's update function
WorldSpin.prototype.update = function() {
	//Scroll planet
	this.tilePosition.x -= this.timeMultiplier * (game.universalTime / 0.3);
	this.x = this.planet.x;
	this.y = this.planet.y;
	this.pmask.x = this.x;
	this.pmask.y = this.y;
}