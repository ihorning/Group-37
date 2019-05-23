"use strict";

function Popup(game, x, y, xSize, ySize, key, frames) {

	Phaser.Sprite.call(this, game, x, y, null, null, 0);

	this.xSize = xSize;
	this.ySize = ySize;

	this.NWFrame = game.cache.getFrameByName(key, frames[0]);
	this.NFrame = game.cache.getFrameByName(key, frames[1]);
	this.NEFrame = game.cache.getFrameByName(key, frames[2]);
	this.WFrame = game.cache.getFrameByName(key, frames[3]);
	this.CFrame = game.cache.getFrameByName(key, frames[4]);
	this.EFrame = game.cache.getFrameByName(key, frames[5]);
	this.SWFrame = game.cache.getFrameByName(key, frames[6]);
	this.SFrame = game.cache.getFrameByName(key, frames[7]);
	this.SEFrame = game.cache.getFrameByName(key, frames[8]);

	this.NW = this.addChild(new Phaser.TileSprite(game, 0, 0, 0, 0, key, frames[0]));
	this.N = this.addChild(new Phaser.TileSprite(game, 0, 0, 0, 0, key, frames[1]));
	this.NE = this.addChild(new Phaser.TileSprite(game, 0, 0, 0, 0, key, frames[2]));
	this.W = this.addChild(new Phaser.TileSprite(game, 0, 0, 0, 0, key, frames[3]));
	this.C = this.addChild(new Phaser.TileSprite(game, 0, 0, 0, 0, key, frames[4]));
	this.E = this.addChild(new Phaser.TileSprite(game, 0, 0, 0, 0, key, frames[5]));
	this.SW = this.addChild(new Phaser.TileSprite(game, 0, 0, 0, 0, key, frames[6]));
	this.S = this.addChild(new Phaser.TileSprite(game, 0, 0, 0, 0, key, frames[7]));
	this.SE = this.addChild(new Phaser.TileSprite(game, 0, 0, 0, 0, key, frames[8]));

	this.Resize(this.xSize, this.ySize);

	game.add.existing(this);

}

Popup.prototype = Object.create(Phaser.Sprite.prototype);
Popup.prototype.constructor = Popup;

Popup.prototype.Resize = function(xSize, ySize) {

	this.xSize = xSize;
	this.ySize = ySize;

	var xOffset = this.anchor.x * this.xSize;
	var yOffset = this.anchor.y * this.ySize;

	this.NW.x = 0 - xOffset;
	this.NW.y = 0 - yOffset;
	this.NW.width = this.NWFrame.width;
	this.NW.height = this.NWFrame.height;

	this.N.x = this.NWFrame.width - xOffset;
	this.N.y = 0 - yOffset;
	this.N.width = xSize - (this.NWFrame.width + this.NEFrame.width);
	this.N.height = this.NFrame.height;

	this.NE.x = xSize - this.NEFrame.width - xOffset;
	this.NE.y = 0 - yOffset;
	this.NE.width = this.NEFrame.width;
	this.NE.height = this.NEFrame.height;

	this.W.x = 0 - xOffset;
	this.W.y = this.NWFrame.height - yOffset;
	this.W.width = this.WFrame.width;
	this.W.height = ySize - (this.NWFrame.height + this.SWFrame.height);

	this.C.x = this.WFrame.width - xOffset;
	this.C.y = this.NFrame.height - yOffset;
	this.C.width = xSize - (this.WFrame.width + this.EFrame.width);
	this.C.height = ySize - (this.NFrame.height + this.SFrame.height);

	this.E.x = xSize - this.EFrame.width - xOffset;
	this.E.y = this.NEFrame.height - yOffset;
	this.E.width = this.EFrame.width;
	this.E.height = ySize - (this.NEFrame.height + this.SEFrame.height);

	this.SW.x = 0 - xOffset;
	this.SW.y = ySize - this.SWFrame.height - yOffset;
	this.SW.width = this.SWFrame.width;
	this.SW.height = this.SWFrame.height;

	this.S.x = this.SWFrame.width - xOffset;
	this.S.y = ySize - this.SFrame.height - yOffset;
	this.S.width = xSize - (this.SWFrame.width + this.SEFrame.width);
	this.S.height = this.SFrame.height;

	this.SE.x = xSize - this.SEFrame.width - xOffset;
	this.SE.y = ySize - this.SEFrame.height - yOffset;
	this.SE.width = this.SEFrame.width;
	this.SE.height = this.SEFrame.height;

}