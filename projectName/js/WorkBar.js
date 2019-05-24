"use strict";

// The WorkBar updates its own progress. It can be "paused" by setting the "sleep" member to true. The bar changes color to indicate this. It counts up from 0% to 100% complete.

// Change these "constant" (not really) variables to whatever the default values for WorkBar should be.
// I put these variables here instead of as parameters to reduce clutter.

var WORK_BAR_DIVISIONS = 50;
var WORK_BAR_KEY = "barAtlas";
var WORK_BAR_FRAME = "circleBar";
var WORK_BAR_BG_FRAME = "circleBarBG";
var WORK_BAR_TINT = "0x909090"; // Tint when sleeping
var WORK_BAR_FONT = {font: "20px Courier", font: "20px Lucida Console", fontWeight: "bold", fill: "#fff"};

// Constructor
function WorkBar(game, x, y, timeMultiplier) {

	// Call CircleBar constructor
	Phaser.Sprite.call(this, game, x, y, null, null, 0);
	this.anchor.set(0.5);
	this.scale.set(0.8);

	this.BG = this.addChild(new Phaser.Sprite(game, 0, 0, WORK_BAR_KEY, WORK_BAR_BG_FRAME, 0));
	this.BG.anchor.set(0.5);

	this.bar = this.addChild(new CircleBar(game, 0, 0, WORK_BAR_DIVISIONS, WORK_BAR_KEY, WORK_BAR_FRAME));

	// Store timeMultiplier
	this.timeMultiplier = timeMultiplier;
	this.efficiency = 1;

	// Add a text object to display %
	this.displayText = this.addChild(game.make.text(0, 85, "0% Complete", WORK_BAR_FONT));
	this.displayText.anchor.x = 0.5;
	this.displayText.anchor.y = 0.25;

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


	if(!dragging && Math.pow(Math.pow(game.input.mousePointer.x - this.world.x, 2) + Math.pow(game.input.mousePointer.y - this.world.y, 2), 0.5) < this.BG.width * 0.5) {
		this.BG.visible = true;
		this.displayText.scale.set(1.15);
	} else {
		this.BG.visible = false;
		this.displayText.scale.set(1);
	}

	// Update displayText to current percent
	this.displayText.text = " "+Math.floor(this.bar.percent)+"% Complete";
	if(this.bar.complete) {
		this.displayText.tint = 0x00ff00;
	}
}