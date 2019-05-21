"use strict";

var circlePath = [];
var circleDetail = 1000;
for(var i = 0; i < circleDetail; i++) {
	circlePath[circlePath.length] = new Phaser.Point(Math.cos(2 * Math.PI * i / (circleDetail - 1)), Math.sin(2 * Math.PI * i / (circleDetail - 1)));
}

function World(game, orbitRad, orbitAngle, orbitSpeed, key, frame, timeMultiplier) {
	// Call Phaser.Sprite constructor
	Phaser.Sprite.call(this, game, -1000, -1000);

	// Set the anchor point to the center
	this.anchor.set(0.5);


	this.orbitRad = orbitRad;
	this.orbitAngle = orbitAngle;
	this.orbitSpeed = orbitSpeed;


	this.orbit = game.add.graphics();


	this.x = game.world.centerX + (this.orbitRad * Math.cos(this.orbitAngle));
	this.y = game.world.centerY - (this.orbitRad * Math.sin(this.orbitAngle));


	// Store the time multiplier
	this.timeMultiplier = timeMultiplier;
	
	this.currentTime = 0;

	// Add this to the game
	game.add.existing(this);


	// Add in a text to display time
	this.debugTimeDisplay = this.addChild(game.make.text(0, 0, "0", {font: "15px Courier", font: "15px Lucida Console", fontWeight: "bold", fill: "#fff"}));
	this.debugTimeDisplay.anchor.set(0.5);

	// Add a WorkBar
	this.job = new WorkBar(game, 0, 0, this.timeMultiplier);
	this.addChild(this.job);

	// Start with character as null
	this.character = null;
	this.pendingArrival = null;

	this.spin = new WorldSpin(game, key, frame, this.timeMultiplier, this);
}

World.prototype = Object.create(Phaser.Sprite.prototype);

World.prototype.constructor = World;

World.prototype.update = function() {
	var delta = this.timeMultiplier * game.universalTime * game.time.elapsed / 1000;
	this.currentTime += delta;

	this.orbitRad -= delta * 2 / this.timeMultiplier;

	this.orbit.clear();
	this.orbit.lineStyle(2.2 - (1.3 * Math.sin(2 * this.currentTime)), 0xffffff, 0.2 + (0.05 * (Math.sin(2 * (this.currentTime + 1)))));
	//this.orbit.drawCircle(game.world.centerX, game.world.centerY, this.orbitRad * 2);
	var newCirclePath = [];
	for(var i = 0; i < circlePath.length; i++) {
		newCirclePath[i] = new Phaser.Point((circlePath[i].x * this.orbitRad) + game.world.centerX, (circlePath[i].y * this.orbitRad) + game.world.centerY);
	}
	this.orbit.drawPolygon(newCirclePath);

	this.orbitAngle += delta * this.orbitSpeed / (this.orbitRad);
	this.x = game.world.centerX + (this.orbitRad * Math.cos(this.orbitAngle));
	this.y = game.world.centerY - (this.orbitRad * Math.sin(this.orbitAngle));

	// Get the number to be displayed (1 decimal)
	var numberToDisplay = Math.floor(this.currentTime * 10) / 10;
	// Add a .0 if rounds to integer
	if(Math.floor(numberToDisplay) == numberToDisplay) {
		this.debugTimeDisplay.text = numberToDisplay+".0";
	} else { // Otherwise, just make it a string
		this.debugTimeDisplay.text = numberToDisplay+"";
	}

	if(this.character == null) { // If no character,
		this.job.bar.sleep = true; // Turn off job progress
	} else { // If there is a character,
		this.job.efficiency = this.character.efficiency;
		if(!this.job.bar.complete) {
			this.job.bar.sleep = false; // Turn on job progress
		}
		this.character.update(); // Run character's update function
	}

	// Run job's update function
	this.job.update();
}

World.prototype.currentTime = function() {
	return this.currentTime;
}

function WorldSpin(game, key, frame, timeMultiplier, planet) {
	// Call Phaser.TileSprite constructor
	Phaser.TileSprite.call(this, game, -1000, -1000, 70, 70, key, frame);
	console.log("here?");

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

WorldSpin.prototype = Object.create(Phaser.TileSprite.prototype);

WorldSpin.prototype.constructor = WorldSpin;

WorldSpin.prototype.update = function() {
	//Scroll planet
	this.tilePosition.x -= this.timeMultiplier * (game.universalTime / 0.3);
	this.x = this.planet.x;
	this.y = this.planet.y;
	this.pmask.x = this.x;
	this.pmask.y = this.y;
}