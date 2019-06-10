"use strict";

// Constructor:
// game: the game
// x: x position
// y: y position
// xSize: width of the message (excluding margins/edges)
// ySize: height of the message (excluding margins/edges)
// key: texture atlas
// frames: array of frames for 9-patch components
/*							[ NW N NE
							  W  C  E
							  SW S SW ]
*/
// title: text displayed at the top of the message
// message: text displayed in the body of the message
// openSound: sound that plays when the message opens
// closeSound: sound that plays when the message closes
function Message(game, x, y, xSize, ySize, key, frames, title, message, openSound, closeSound) {
	// Call the Popup constructor
	Popup.call(this, game, x, y, xSize, ySize, key, frames);

	// Text style of the title
	var style1 = {
		font: "bold 35px Courier",
		fill: "#fff",
		wordWrap: true,
		wordWrapWidth: xSize
	}
	// Text style of the body
	var style2 = {
		font: "30px Courier",
		fill: "#fff",
		wordWrap: true,
		wordWrapWidth: xSize
	}
	// Add a text object to display the title
	this.titleDisplay = this.addChild(game.make.text(0, 0, title, style1));
	// Draw a line to underline the title
	this.underline = this.titleDisplay.addChild(game.make.graphics(0, this.titleDisplay.height));
	this.underline.lineStyle(5, 0xffffff, 1);
	this.underline.lineTo(this.titleDisplay.width, 0);
	// Add a text object to display the message
	this.messageDisplay = this.addChild(game.make.text(0, this.titleDisplay.height + 20, message, style2));

	// Add a button to close the message
	this.closeButton = this.addChild(new PlayButton(game, xSize / 2, ySize, 'atlas', this.Close, this, 'exitMessageOff', 'exitMessageOn', ""));
	this.closeButton.scale.set(1);
	this.closeButton.anchor.set(0.5);

	// Add these items as text elements to be hidden in the opening process
	this.textElements[this.textElements.length] = this.titleDisplay;
	this.textElements[this.textElements.length] = this.underline;
	this.textElements[this.textElements.length] = this.messageDisplay;
	this.textElements[this.textElements.length] = this.closeButton;

	// Save the open and close sounds
	this.openSound = openSound;
	this.closeSound = closeSound;

	// Add this to the game
	game.add.existing(this);

	// Initialize the size of all components with Resize function
	this.Resize(this.xSize, this.ySize);
}

// Set prototype to a copy of Popup prototype
Message.prototype = Object.create(Popup.prototype);
// Define constructor
Message.prototype.constructor = Message;

// Function to close the message
Message.prototype.Close = function() {
	// Play sound to close
	this.closeSound.play("", 0, 1, false);
	// Take the close button off of the message and put it onto the world in the same place
	var newX = this.closeButton.worldX;
	var newY = this.closeButton.worldY;
	game.add.existing(this.closeButton);
	this.closeButton.x = newX;
	this.closeButton.y = newY;
	// The close button will close next frame, after it is done with button operations
	this.closeButton.pendingDestroy = true;
	// Destroy the message object
	this.destroy();
}

// Function to set the size of the message
Message.prototype.Resize = function(xSize, ySize) {
	// Call the Popup Resize function
	Popup.prototype.Resize.call(this, xSize, ySize);

	// Get offset according to anchor
	var xOffset = Math.floor(this.anchor.x * this.xSize);
	var yOffset = Math.floor(this.anchor.y * this.ySize);

	// Move the text elements according to the new size, if they are defined
	if(this.titleDisplay) {
		this.titleDisplay.x = -xOffset;
		this.titleDisplay.y = -yOffset;
	}
	if(this.messageDisplay) {
		this.messageDisplay.x = this.titleDisplay.x;
		this.messageDisplay.y = this.titleDisplay.y + this.titleDisplay.height + 20;
	}
	if(this.closeButton) {
		this.closeButton.x = Math.floor((0.5 - this.anchor.x) * this.xSize);
		this.closeButton.y = this.ySize - yOffset;
	}
}