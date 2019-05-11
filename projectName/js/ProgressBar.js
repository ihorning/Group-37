"use strict";

// Constructor
function ProgressBar(game, x, y, barWidth, barHeight, maxProgressWidth, progressHeight, key, barStartFrame, barFrame, barEndFrame, progressFrame) {
	// x and y are the position coordinates of this bar.
	// barWidth and barHeight are the dimensions of the outer/empty bar. This is not necessarily the size of the actual image asset, because it repeats.
	// maxProgressWidth and progressHeight are the sizes of the inner/full component when it is completely full. This can also be a different size from the asset.
	// key is the key of the texture atlas.
	// barStartFrame is the frame of the front-cap of the bar.
	// barFrame is the frame of the repeating middle part of the bar.
	// barEndFrame is the frame of the end-cap of the bar.
	// progressFrame is the frame of the repeating fullness graphic.


	// Call the Phaser.Sprite constructor
	Phaser.TileSprite.call(this, game, x, y, barWidth, barHeight, key, barFrame);

	// Add this sprite to the game
	game.add.existing(this);


	// Create the start and end caps of the bar. Th
	this.startCap = this.addChild(game.make.sprite(0, 0, key, barStartFrame));
	this.startCap.anchor.x = 1;
	this.endCap = this.addChild(game.make.sprite(barWidth, 0, key, barEndFrame));
	
	

	// Add another sprite as a child of this.
	// The child is the tileSprite "within" the bar that represents fullness
	var offsetX = (barWidth - maxProgressWidth) / 2;
	var offsetY = (barHeight - progressHeight) / 2;
	this.progress = this.addChild(game.make.tileSprite(offsetX, offsetY, 0, progressHeight, key, progressFrame));
	// You can change the tint of progress.
	// You might do this if you want to grey out the bar when it isn't moving or is complete or something.

	// Save the progress dimensions.
	this.maxProgressWidth = maxProgressWidth;
	this.maxProgressHeight = progressHeight;


	// The percent completeness of the bar
	this.percent = 0;

	// In case you want to improve performance, you can disable updates (other than 1 bool check)
	this.sleep = false;
	// You can have the bar sleep as soon as percent reaches 100
	this.sleepWhenComplete = true;

	// Increments of pixels the progress can be shown at.
	// If the progress was represented by a series of squares, 20 px each with 3 px gaps,
	// You would make this 23 to display only whole squares.
	this.displayModulus = 0;


	this.complete = false;

	this.reversed = false;
}

// Set the prototype of Spike to be a copy of Phaser.Sprite.prototype
ProgressBar.prototype = Object.create(Phaser.TileSprite.prototype);
// Define the constructor
ProgressBar.prototype.constructor = ProgressBar;

// Update the progress size, if not sleeping
ProgressBar.prototype.update = function() {
	if(!this.sleep) {
		if(this.percent > 100 && !this.reversed) {
			this.percent = 100;
			this.complete = true;
			if(this.sleepWhenComplete) {
				this.sleep = true;
			}
		} else if(this.percent < 0 && this.reversed) {
			this.percent = 0;
			this.complete = true;
			if(this.sleepWhenComplete) {
				this.sleep = true;
			}
		}
	}

	// Calculate how much of the bar can be shown
	var shownProgress = (this.percent / 100) * this.maxProgressWidth;
	if(this.displayModulus != 0 && this.percent != 100) {
		shownProgress -= shownProgress % this.displayModulus;
		// If not reversed (bar going up), blocks appear as floor of value
		// If reversed (bar going down), blocks appear as ceiling of value
		if(this.reversed && this.shownProgress > 0) {
			shownProgress += this.displayModulus;
		}
	}

	// Do the actual change
	this.progress.width = shownProgress;
}