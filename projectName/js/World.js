"use strict";

function World(game, x, y, key, frame, timeMultiplier) {
	// Call Phaser.Sprite constructor
	Phaser.Sprite.call(this, game, x, y, key, frame);

	// Set the anchor point to the center
	this.anchor.set(0.5);

	// Store the time multiplier
	this.timeMultiplier = timeMultiplier;
	
	// Begin a timer
	this.timer = game.time.create(false);
	this.timer.start();

	// Add this to the game
	game.add.existing(this);


	// Add in a text to display time
	this.debugTimeDisplay = this.addChild(game.make.text(0, 0, "0", {font: "15px Courier", font: "15px Lucida Console", fontWeight: "bold", fill: "#fff"}));
	this.debugTimeDisplay.anchor.set(0.5);

	// Add a WorkBar
	this.job = game.add.existing(new WorkBar(game, -WORK_PROGRESS_WIDTH / 2, ((this.height / 2) + 32), this.timeMultiplier));
	this.addChild(this.job);

	// Start with character as null
	this.character = null;

}

World.prototype = Object.create(Phaser.Sprite.prototype);

World.prototype.constructor = World;

World.prototype.update = function() {
	// Get the number to be displayed (1 decimal)
	var numberToDisplay = Math.floor(this.currentTime() * 10) / 10;
	// Add a .0 if rounds to integer
	if(Math.floor(numberToDisplay) == numberToDisplay) {
		this.debugTimeDisplay.text = numberToDisplay+".0";
	} else { // Otherwise, just make it a string
		this.debugTimeDisplay.text = numberToDisplay+"";
	}

	if(this.character == null) { // If no character,
		this.job.sleep = true; // Turn off job progress
	} else { // If there is a character,
		this.job.sleep = false; // Turn on job progress
		this.character.update(); // Run character's update function
	}

	// Run job's update function
	this.job.update();
}

World.prototype.currentTime = function() {
	return this.timeMultiplier * this.timer.seconds;
}