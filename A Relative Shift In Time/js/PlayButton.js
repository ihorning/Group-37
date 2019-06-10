"use strict";

// Constructor
// game: the game
// x: x position
// y: y position
// key: texture atlas
// callback: function called on click
// callbackContext: context for callback function
// buttonFrame: frame of button in normal state
// buttonOver: frame of button in mouse-over state
// text: text on the button
// color1: color of text in mouse-over state
// color2: color of text in normal state
// font: font used for text
function PlayButton(game, x, y, key, callback, callbackContext, buttonFrame, buttonOver, text, color1, color2, font) {

	// Call the Phaser.Button constructor
	Phaser.Button.call(this, game, x, y, key, callback, callbackContext, buttonOver, buttonFrame, buttonOver, buttonOver);

	// Add this sprite to the game
	game.add.existing(this);

	// Save the font and colors
	this.font = font;
	this.color1 = color1;
	this.color2 = color2;

	// Create the text as a child
	this.text = this.addChild(game.make.text(0, 0, text, {font: this.font, fill: this.color2}));
	this.text.anchor.set(0.5);

	// Add changing tint events for mouse input
	this.onInputOver.add(over, this);
	this.onInputOut.add(out, this);
	this.onInputDown.add(down, this);
	this.onInputUp.add(up, this);

	// Create the button clicking sound
	this.buttonClick = game.add.audio("buttonClick");

	// Create 3 audio objects for hovering
	this.hover1 = game.add.audio("hover");
	this.hover2 = game.add.audio("hover");
	this.hover3 = game.add.audio("hover");
}

// Set the prototype of PlayButton to be a copy of Phaser.Button.prototype
PlayButton.prototype = Object.create(Phaser.Button.prototype);
// Define constructor
PlayButton.prototype.constructor = PlayButton;

// Change tint when mouse is over
function over() {
	// Set the text fill
	this.text.fill = this.color1;
	// Play the hover sound...
	if(game.sound.context.state !== "suspended") {
		// Use the 3 hover audio objects to prevent audio beats
		if(this.hover1.isPlaying) { // If hover1 is busy...
			if(this.hover2.isPlaying) { // If hover2 is busy...
				// Switch out hover3 and hover2, make hover3 (formerly busy hover2) fade out
				var temp = this.hover2;
				this.hover2 = this.hover3;
				this.hover3 = temp;
				this.hover3.fadeOut(250);
			}
			// Switch out hover2 and hover1, make hover2 (formerly busy hover1) fade out
			var temp = this.hover1;
			this.hover1 = this.hover2;
			this.hover2 = temp;
			this.hover2.fadeOut(250);
		}
		// Play hover1, which should not be playing anything if at least one of the 3 audio objects was not busy
		this.hover1.play("", 0, 1, false);
	}
}

// Change tint back when mouse leaves
function out() {
	this.text.fill = this.color2;
}

// Play the buttonClick sound on click
function down() {
	this.buttonClick.play("", 0, 1, false);
}

function up() {

}