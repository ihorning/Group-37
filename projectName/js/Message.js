"use strict";

function Message(game, x, y, xSize, ySize, key, frames, title, message) {

	Popup.call(this, game, x, y, xSize, ySize, key, frames);

	var style1 = {
		font: "bold 35px Courier",
		fill: "#fff",
		wordWrap: true,
		wordWrapWidth: xSize
	}
	var style2 = {
		font: "30px Courier",
		fill: "#fff",
		wordWrap: true,
		wordWrapWidth: xSize
	}
	this.titleDisplay = this.addChild(game.make.text(0, 0, title, style1));
	console.log(this.titleDisplay.height);
	this.underline = this.titleDisplay.addChild(game.make.graphics(0, this.titleDisplay.height));
	this.underline.lineStyle(5, 0xffffff, 1);
	this.underline.lineTo(this.titleDisplay.width, 0);
	this.messageDisplay = this.addChild(game.make.text(0, this.titleDisplay.height + 20, message, style2));

	game.add.existing(this);
}

Message.prototype = Object.create(Popup.prototype);
Message.prototype.constructor = Message;

Message.prototype.update = function(xSize, ySize) {

}