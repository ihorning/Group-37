"use strict";

// Constructor
function PlayButton(game, x, y, key, callback, callbackContext, buttonFrame, text) {

	// Call the Phaser.Button constructor
	Phaser.Button.call(this, game, x, y, key, callback, callbackContext, buttonFrame, buttonFrame, buttonFrame, buttonFrame);
	// Set the anchor point to the middle, scale to double
	this.anchor.set(0.5);
	this.scale.set(2);

	// Add this sprite to the game
	game.add.existing(this);

	
	this.text = this.addChild(game.make.text(0, 0, text, {font: "15px Courier", font: "15px Lucida Console", fontWeight: "bold", fill: "#f22"}));


	// Add changing tint events for mouse input
	this.onInputOver.add(over, this);
	this.onInputOut.add(out, this);
	this.onInputDown.add(down, this);
	this.onInputUp.add(up, this);
}

// Set the prototype of PlayButton to be a copy of Phaser.Button.prototype
PlayButton.prototype = Object.create(Phaser.Button.prototype);
// Define constructor
PlayButton.prototype.constructor = PlayButton;

// Change tint when mouse is over
function over() {
	this.tint = 0xDDDDFF;
}

// Change tint back when mouse leaves
function out() {
	this.tint = 0xFFFFFF;
}

function down() {

}

function up() {

}