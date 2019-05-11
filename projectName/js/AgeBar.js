"use strict";

// The AgeBar updates itself to match the "life" variable (0 to 100 number) on a "person". Life is expected to be going down from 100 to 0.

// Change these "constant" (not really) variables to whatever the default values for AgeBar should be.
// I put these variables here instead of as parameters to reduce clutter.

var AGE_BAR_WIDTH = 96;
var AGE_BAR_HEIGHT = 10;
var AGE_PROGRESS_WIDTH = AGE_BAR_WIDTH;
var AGE_PROGRESS_HEIGHT = 4;

var AGE_BAR_KEY = "barAtlas";
var AGE_BAR_FRAMES = {
	start: "AgeStartCap",
	middle: "AgeBar",
	end: "AgeEndCap",
	progress: "AgeProgress"
}

var AGE_BAR_MODULUS = 0;

var AGE_BAR_FONT = {font: "16px Courier", font: "16px Lucida Console", fontWeight: "bold", fill: "#eff"};

// Constructor
function AgeBar(game, x, y, person) {

	ProgressBar.call(this, game, x, y, AGE_BAR_WIDTH, AGE_BAR_HEIGHT, AGE_PROGRESS_WIDTH, AGE_PROGRESS_HEIGHT, AGE_BAR_KEY, AGE_BAR_FRAMES.start, AGE_BAR_FRAMES.middle, AGE_BAR_FRAMES.end, AGE_BAR_FRAMES.progress);

	this.reversed = true;

	this.displayModulus = AGE_BAR_MODULUS;

	this.person = person;

	this.displayText = this.addChild(game.make.text(AGE_BAR_WIDTH, 0, "0%", AGE_BAR_FONT));

}


AgeBar.prototype = Object.create(ProgressBar.prototype);
// Define the constructor
AgeBar.prototype.constructor = AgeBar;

// Update the progress size, if not sleeping
AgeBar.prototype.update = function() {
	this.percent = this.person.life;

	this.displayText.text = " "+Math.ceil(this.percent)+"%";

	ProgressBar.prototype.update.call(this);
}