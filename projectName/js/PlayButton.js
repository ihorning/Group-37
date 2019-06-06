"use strict";

// Constructor
function PlayButton(game, x, y, key, callback, callbackContext, buttonFrame, buttonOver, text, color1, color2, font) {

	// Call the Phaser.Button constructor
	Phaser.Button.call(this, game, x, y, key, callback, callbackContext, buttonOver, buttonFrame, buttonOver, buttonOver);

	// Add this sprite to the game
	game.add.existing(this);

	this.font = font;
	this.color1 = color1;
	this.color2 = color2;

	//, font: "48px sans-serif"
	this.text = this.addChild(game.make.text(0, 0, text, {font: this.font, fill: this.color2}));
	this.text.anchor.set(0.5);
	//this.text.x = this.width / 2;
	//this.text.y = this.height / 2;


	// Add changing tint events for mouse input
	this.onInputOver.add(over, this);
	this.onInputOut.add(out, this);
	this.onInputDown.add(down, this);
	this.onInputUp.add(up, this);

	this.buttonClick = game.add.audio("buttonClick");

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
	//this.tint = 0xDDDDFF;
	this.text.fill = this.color1;
	if(game.sound.context.state !== "suspended") {
		if(this.hover1.isPlaying) {
			if(this.hover2.isPlaying) {
				var temp = this.hover2;
				this.hover2 = this.hover3;
				this.hover3 = temp;
				this.hover3.fadeOut(250);
			}
			var temp = this.hover1;
			this.hover1 = this.hover2;
			this.hover2 = temp;
			this.hover2.fadeOut(250);
		}
		this.hover1.play("", 0, 1, false);
	}
}

// Change tint back when mouse leaves
function out() {
	//this.tint = 0xFFFFFF;
	this.text.fill = this.color2;
}

function down() {
	this.buttonClick.play("", 0, 1, false);
}

function up() {

}