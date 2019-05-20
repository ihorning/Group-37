"use strict";

// The WorkBar updates its own progress. It can be "paused" by setting the "sleep" member to true. The bar changes color to indicate this. It counts up from 0% to 100% complete.

// Change these "constant" (not really) variables to whatever the default values for WorkBar should be.
// I put these variables here instead of as parameters to reduce clutter.

var WORK_BAR_DIVISIONS = 20;
var WORK_BAR_KEY = "barAtlas";
var WORK_BAR_FRAME = "circleBar";
var WORK_BAR_TINT = "0xaaaaaa"; // Tint when sleeping
var WORK_BAR_FONT = {font: "20px Courier", font: "20px Lucida Console", fontWeight: "bold", fill: "#fff"};

// Constructor
function WorkBar(game, x, y, timeMultiplier) {

	// Call CircleBar constructor
	Phaser.Sprite.call(this, game, x, y, null, null, 0);

	this.bar = this.addChild(new CircleBar(game, 0, 0, WORK_BAR_DIVISIONS, WORK_BAR_KEY, WORK_BAR_FRAME));

	// Store timeMultiplier
	this.timeMultiplier = timeMultiplier;
	this.efficiency = 1;

	// Add a text object to display %
	this.displayText = this.addChild(game.make.text(0, (this.height / 2) + 30, "0%", WORK_BAR_FONT));

	game.add.existing(this);
}


WorkBar.prototype = Object.create(Phaser.Sprite.prototype);
// Define the constructor
WorkBar.prototype.constructor = WorkBar;

// Update the progress size, if not sleeping
WorkBar.prototype.update = function() {
	// How much work has been done this frame
	var delta = game.universalTime * game.time.elapsed * this.timeMultiplier * this.efficiency / 1000;

	if(!this.bar.sleep) { // If not sleeping...
		// Change percent and make sure tint is normal
		this.bar.percent += 2.2 * delta;
		this.bar.setMask(this.bar.percent);
		this.bar.tint = 0xffffff;

		if(this.bar.percent >= 100) {
			this.bar.percent = 100;
			this.bar.sleep = true;
			this.bar.complete = true;
		}

	} else if(!this.bar.complete) { // If sleeping,
		// Set tint and do not change percent
		this.bar.tint = WORK_BAR_TINT;
	} else {
		this.bar.tint = 0xeeffee;
	}

	// Update displayText to current percent
	this.displayText.text = " "+Math.floor(this.bar.percent)+"%";
}