"use strict";

// The AgeBar updates itself to match the "life" variable (0 to 100 number) on a "person". Life is expected to be going down from 100 to 0.

// Change these "constant" (not really) variables to whatever the default values for AgeBar should be.
// I put these variables here instead of as parameters to reduce clutter.

// Look at WorkBar for details about what the variables do

var AGE_BAR_WIDTH = 72;
var AGE_BAR_HEIGHT = 10;
var AGE_PROGRESS_WIDTH = AGE_BAR_WIDTH;
var AGE_PROGRESS_HEIGHT = 4;

var AGE_BAR_KEY = "atlas";
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
	// Call ProgressBar constructor
	ProgressBar.call(this, game, x, y, AGE_BAR_WIDTH, AGE_BAR_HEIGHT, AGE_PROGRESS_WIDTH, AGE_PROGRESS_HEIGHT, AGE_BAR_KEY, AGE_BAR_FRAMES.start, AGE_BAR_FRAMES.middle, AGE_BAR_FRAMES.end, AGE_BAR_FRAMES.progress);

	// This bar is reversed (100% down to 0%)
	this.reversed = true;

	// Set the modulus
	this.displayModulus = AGE_BAR_MODULUS;

	// Store the person this is for
	this.person = person;

	// Make a text object to display %
	this.displayText = this.addChild(game.make.text(AGE_BAR_WIDTH, 0, "0% Life", AGE_BAR_FONT));
	this.displayText.scale.set(0.65);

	AgeBar.prototype.update.call(this);

}


AgeBar.prototype = Object.create(ProgressBar.prototype);
// Define the constructor
AgeBar.prototype.constructor = AgeBar;

// Update the progress size, if not sleeping
AgeBar.prototype.update = function() {
	// Update the life value
	this.percent = this.person.life;

	// Update the text to the life value
	this.displayText.text = " "+Math.ceil(this.percent)+"% Life Left";

	// Call the ProgressBar update function from here
	ProgressBar.prototype.update.call(this);
}