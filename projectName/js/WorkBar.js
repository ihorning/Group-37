"use strict";

// The WorkBar updates its own progress. It can be "paused" by setting the "sleep" member to true. The bar changes color to indicate this. It counts up from 0% to 100% complete.

// Change these "constant" (not really) variables to whatever the default values for WorkBar should be.
// I put these variables here instead of as parameters to reduce clutter.

var WORK_BAR_WIDTH = 128; // Desired size of full bar
var WORK_BAR_HEIGHT = 16; // Height of bar png
var WORK_PROGRESS_WIDTH = WORK_BAR_WIDTH; // Probably going to be WORK_BAR_WIDTH
var WORK_PROGRESS_HEIGHT = 12; // Height of progress png

var WORK_BAR_KEY = "barAtlas";
var WORK_BAR_FRAMES = {
	start: "WorkStartCap",
	middle: "WorkBar",
	end: "WorkEndCap",
	progress: "WorkProgress"
}

var WORK_BAR_MODULUS = 8; // Increment amount of progress. Probably progress png width

var WORK_BAR_TINT = "0xaaaaaa"; // Tint when sleeping

var WORK_BAR_FONT = {font: "20px Courier", font: "20px Lucida Console", fontWeight: "bold", fill: "#fff"};

// Constructor
function WorkBar(game, universalTime, x, y, timeMultiplier) {
	this.universalTime = universalTime;

	// Call ProgressBar constructor
	ProgressBar.call(this, game, x, y, WORK_BAR_WIDTH, WORK_BAR_HEIGHT, WORK_PROGRESS_WIDTH, WORK_PROGRESS_HEIGHT, WORK_BAR_KEY, WORK_BAR_FRAMES.start, WORK_BAR_FRAMES.middle, WORK_BAR_FRAMES.end, WORK_BAR_FRAMES.progress);

	// Set modulus
	this.displayModulus = WORK_BAR_MODULUS;

	// Store timeMultiplier
	this.timeMultiplier = timeMultiplier;
	this.efficiency = 1;

	// Add a text object to display %
	this.displayText = this.addChild(game.make.text(WORK_BAR_WIDTH, 0, "0%", WORK_BAR_FONT));

}


WorkBar.prototype = Object.create(ProgressBar.prototype);
// Define the constructor
WorkBar.prototype.constructor = WorkBar;

// Update the progress size, if not sleeping
WorkBar.prototype.update = function() {
	// How much work has been done this frame
	var delta = this.universalTime * game.time.elapsed * this.timeMultiplier * this.efficiency / 1000;

	if(this.reversed) { // If reversed,
		delta *= -1; // Subtract
	}
	if(!this.sleep) { // If not sleeping...
		// Change percent and make sure tint is normal
		this.percent += 2.25 * delta;
		this.progress.tint = "0xffffff";
	} else if(!this.complete) { // If sleeping,
		// Set tint and do not change percent
		this.progress.tint = WORK_BAR_TINT;
	}

	// Update displayText to current percent
	this.displayText.text = " "+Math.floor(this.percent)+"%";

	// Call the ProgressBar update function from here
	ProgressBar.prototype.update.call(this);
}