"use strict";

// Constructor
// game: the game
// x: x position
// y: y position
// xSize: width of text field
// ySize: height of text field
// key: texture atlas
// frames: array of frames for 9-patch components
/*							[ NW N NE
							  W  C  E
							  SW S SW ]
*/

// Constructor
function Popup(game, x, y, xSize, ySize, key, frames) {

	// Call Phaser.Sprite constructor
	Phaser.Sprite.call(this, game, x, y, null, null, 0);

	// Save the xSize and ySize
	this.xSize = xSize;
	this.ySize = ySize;

	// Save all of the 9-patch frames as Phaser.Frame
	this.NWFrame = game.cache.getFrameByName(key, frames[0]);
	this.NFrame = game.cache.getFrameByName(key, frames[1]);
	this.NEFrame = game.cache.getFrameByName(key, frames[2]);
	this.WFrame = game.cache.getFrameByName(key, frames[3]);
	this.CFrame = game.cache.getFrameByName(key, frames[4]);
	this.EFrame = game.cache.getFrameByName(key, frames[5]);
	this.SWFrame = game.cache.getFrameByName(key, frames[6]);
	this.SFrame = game.cache.getFrameByName(key, frames[7]);
	this.SEFrame = game.cache.getFrameByName(key, frames[8]);

	// Define the 9 components of this popup window as tileSprites
	this.NW = this.addChild(new Phaser.TileSprite(game, 0, 0, 0, 0, key, frames[0]));
	this.N = this.addChild(new Phaser.TileSprite(game, 0, 0, 0, 0, key, frames[1]));
	this.NE = this.addChild(new Phaser.TileSprite(game, 0, 0, 0, 0, key, frames[2]));
	this.W = this.addChild(new Phaser.TileSprite(game, 0, 0, 0, 0, key, frames[3]));
	this.C = this.addChild(new Phaser.TileSprite(game, 0, 0, 0, 0, key, frames[4]));
	this.E = this.addChild(new Phaser.TileSprite(game, 0, 0, 0, 0, key, frames[5]));
	this.SW = this.addChild(new Phaser.TileSprite(game, 0, 0, 0, 0, key, frames[6]));
	this.S = this.addChild(new Phaser.TileSprite(game, 0, 0, 0, 0, key, frames[7]));
	this.SE = this.addChild(new Phaser.TileSprite(game, 0, 0, 0, 0, key, frames[8]));

	// Initialize the size and position of the components
	this.Resize(this.xSize, this.ySize);

	// Define the goal dimensions as the current dimensions
	// Goal dimensions will be used if this is called with Open function
	this.goalXSize = this.xSize;
	this.goalYSize = this.ySize;

	// Initialize opening boolean and time it takes to open
	this.opening = false;
	this.openTime = 0.25;

	// Initialize array of elements to hide during open
	this.textElements = [];

	// Set the opacity to 80%
	this.alpha = 0.8;

	// Add the Popup to the foreground
	game.foreground.add(this);

}

// Set the prototype to a copy of Phaser.Sprite's prototype
Popup.prototype = Object.create(Phaser.Sprite.prototype);
// Define constructor
Popup.prototype.constructor = Popup;

// Function to Resize the Popup window
Popup.prototype.Resize = function(xSize, ySize) {

	// Make sure the xSize and ySize are pixel-aligned
	this.xSize = Math.round(xSize);
	this.ySize = Math.round(ySize);

	// Get the position offset based on the anchor
	var xOffset = Math.floor(this.anchor.x * this.xSize);
	var yOffset = Math.floor(this.anchor.y * this.ySize);

	// Set the x, y, width, and height of the NW component
	this.NW.x = -this.NWFrame.width - xOffset;
	this.NW.y = -this.NWFrame.height - yOffset;
	this.NW.width = this.NWFrame.width;
	this.NW.height = this.NWFrame.height;

	// Set the x, y, width, and height of the N component
	this.N.x = 0 - xOffset;
	this.N.y = -this.NFrame.height - yOffset;
	this.N.width = this.xSize;
	this.N.height = this.NFrame.height;

	// Set the x, y, width, and height of the NE component
	this.NE.x = this.xSize - xOffset;
	this.NE.y = -this.NEFrame.height - yOffset;
	this.NE.width = this.NEFrame.width;
	this.NE.height = this.NEFrame.height;

	// Set the x, y, width, and height of the W component
	this.W.x = -this.WFrame.width - xOffset;
	this.W.y = 0 - yOffset;
	this.W.width = this.WFrame.width;
	this.W.height = this.ySize;

	// Set the x, y, width, and height of the C component
	this.C.x = 0 - xOffset;
	this.C.y = 0 - yOffset;
	this.C.width = this.xSize;
	this.C.height = this.ySize;

	// Set the x, y, width, and height of the E component
	this.E.x = this.xSize - xOffset;
	this.E.y = 0 - yOffset;
	this.E.width = this.EFrame.width;
	this.E.height = this.ySize;

	// Set the x, y, width, and height of the SW component
	this.SW.x = -this.SWFrame.width - xOffset;
	this.SW.y = this.ySize - yOffset;
	this.SW.width = this.SWFrame.width;
	this.SW.height = this.SWFrame.height;

	// Set the x, y, width, and height of the S component
	this.S.x = 0 - xOffset;
	this.S.y = this.ySize - yOffset;
	this.S.width = this.xSize;
	this.S.height = this.SFrame.height;

	// Set the x, y, width, and height of the SE component
	this.SE.x = this.xSize - xOffset;
	this.SE.y = this.ySize - yOffset;
	this.SE.width = this.SEFrame.width;
	this.SE.height = this.SEFrame.height;

}

// Function to start opening this Popup
Popup.prototype.Open = function(time) {
	// Set custom time if specified
	if(time) {
		this.openTime = time;
	}

	// Set opening boolean
	this.opening = true;
	// Make all the text elements invisible
	for(var element in this.textElements) {
		this.textElements[element].alpha = 0;
	}
	// Resize to the default starting size
	this.Resize(300, 10);
}

// Define the Popup update function
Popup.prototype.update = function() {
	// If this is in the process of opening...
	if(this.opening) {
		// Get new size based on last size and time since last frame
		var newX = this.xSize;
		var newY = this.ySize;
		if(this.xSize < this.goalXSize) {
			newX += ((game.time.elapsed / 1000) / this.openTime) * (this.goalXSize - 300);
		}
		if(this.ySize < this.goalYSize) {
			newY += ((game.time.elapsed / 1000) / this.openTime) * (this.goalYSize - 10);
		}
		// Do not overshoot the goal
		if(newX > this.goalXSize) {
			newX = this.goalXSize;
		}
		if(newY > this.goalYSize) {
			newY = this.goalYSize;
		}

		// Resize to the new dimensions
		this.Resize(newX, newY);

		// If reached the desired width and height...
		if(this.xSize == this.goalXSize && this.ySize == this.goalYSize) {
			// Stop opening
			this.opening = false;
			// Set all the text elements to visible
			for(var element in this.textElements) {
				this.textElements[element].alpha = 1;
			}
		}
	}
}