"use strict";

// Constructor
// game: the game
// x: x position
// y: y position
// divisions: number of segments this is divided into
// key: texture atlas
// frame: frame of circle bar asset
function CircleBar(game, x, y, divisions, key, frame) {
	// Call Phaser.Sprite constructor
	Phaser.Sprite.call(this, game, x, y, key, frame, 0);
	// Center anchor
	this.anchor.set(0.5);
	// Add this to the game
	game.add.existing(this);

	// Save the number of divisions
	this.divisions = divisions;

	// Add a graphics object, use this as a mask.
	this.progressMask = game.add.graphics();
	this.addChild(this.progressMask);
	this.mask = this.progressMask;

	// Initialize percent as 0
	this.percent = 0;
	// Update the mask object to show 0%
	this.setMask(0);
}

// Set the prototype to a copy of Phaser.Sprite's prototype
CircleBar.prototype = Object.create(Phaser.Sprite.prototype);
// Define constructor
CircleBar.prototype.constructor = CircleBar;

// Function used to update the mask to show current progress
CircleBar.prototype.setMask = function(percent) {
	// Round percent to the last division
	var roundedPercent = (100 / this.divisions) * Math.floor(percent / (100 / this.divisions));
	// Draw a pie-piece shape for the mask...
	var startAngle = 0;
	var endAngle = (roundedPercent / 100) * Math.PI * 2;
	var radius = this.width / 2;
	var maskPath = [new Phaser.Point(0, 0)];
	for(var i = 0; i < 500; i++) {
		maskPath[maskPath.length] = new Phaser.Point(radius * Math.cos((endAngle - startAngle) * (i / 500)), radius * Math.sin((endAngle - startAngle) * (i / 500)));
	}
	maskPath[maskPath.length] = new Phaser.Point(0, 0);
	this.progressMask.clear();
	this.progressMask.beginFill(0xffffff, 1);
	this.progressMask.drawPolygon(maskPath);
}