"use strict";

// The WorkBar updates its own progress. It can be "paused" by setting the "sleep" member to true. The bar changes color to indicate this. It counts up from 0% to 100% complete.

// Change these "constant" (not really) variables to whatever the default values for WorkBar should be.
// I put these variables here instead of as parameters to reduce clutter.

var WORK_BAR_WIDTH = 128;
var WORK_BAR_HEIGHT = 16;
var WORK_PROGRESS_WIDTH = WORK_BAR_WIDTH;
var WORK_PROGRESS_HEIGHT = 12;

var WORK_BAR_KEY = "barAtlas";
var WORK_BAR_FRAMES = {
	start: "WorkStartCap",
	middle: "WorkBar",
	end: "WorkEndCap",
	progress: "WorkProgress"
}

var WORK_BAR_MODULUS = 8;

var WORK_BAR_TINT = "0xaaaaaa";

var WORK_BAR_FONT = {font: "20px Courier", font: "20px Lucida Console", fontWeight: "bold", fill: "#fff"};

// Constructor
function WorkBar(game, x, y, timeMultiplier) {

	ProgressBar.call(this, game, x, y, WORK_BAR_WIDTH, WORK_BAR_HEIGHT, WORK_PROGRESS_WIDTH, WORK_PROGRESS_HEIGHT, WORK_BAR_KEY, WORK_BAR_FRAMES.start, WORK_BAR_FRAMES.middle, WORK_BAR_FRAMES.end, WORK_BAR_FRAMES.progress);

	this.displayModulus = WORK_BAR_MODULUS;

	this.currentTime = 0;
	this.timeMultiplier = timeMultiplier;
	this.efficiency = 1;

	this.displayText = this.addChild(game.make.text(WORK_BAR_WIDTH, 0, "0%", WORK_BAR_FONT));

}


WorkBar.prototype = Object.create(ProgressBar.prototype);
// Define the constructor
WorkBar.prototype.constructor = WorkBar;

// Update the progress size, if not sleeping
WorkBar.prototype.update = function() {
	var delta = game.time.elapsed * this.timeMultiplier * this.efficiency / 1000;
	if(this.reversed) {
		delta *= -1;
	}
	this.currentTime += delta;
	if(!this.sleep) {
		this.percent += delta;
		this.progress.tint = "0xffffff";
	} else if(!this.complete) {
		this.progress.tint = WORK_BAR_TINT;
	}

	this.displayText.text = " "+Math.floor(this.percent)+"%";

	ProgressBar.prototype.update.call(this);
}