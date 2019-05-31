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

	this.closeButton = this.addChild(new PlayButton(game, xSize / 2, ySize, 'exit', this.Close, this, 'exitOff', 'exitOn', ""));
	this.closeButton.scale.set(2);
	this.closeButton.anchor.set(0.5);

	game.add.existing(this);

	this.Resize(this.xSize, this.ySize);
}

Message.prototype = Object.create(Popup.prototype);
Message.prototype.constructor = Message;

Message.prototype.Close = function() {
	var newX = this.closeButton.worldX;
	var newY = this.closeButton.worldY;
	game.add.existing(this.closeButton);
	this.closeButton.x = newX;
	this.closeButton.y = newY;
	this.closeButton.pendingDestroy = true;
	this.destroy();
}

Message.prototype.Resize = function(xSize, ySize) {
	Popup.prototype.Resize.call(this, xSize, ySize);

	var xOffset = Math.floor(this.anchor.x * this.xSize);
	var yOffset = Math.floor(this.anchor.y * this.ySize);

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