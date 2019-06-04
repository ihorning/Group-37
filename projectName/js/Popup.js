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


	this.goalXSize = this.xSize;
	this.goalYSize = this.ySize;

	this.opening = false;
	this.openTime = 0.3;

	this.textElements = [];

	this.alpha = 0.8;

	game.foreground.add(this);

}

Popup.prototype = Object.create(Phaser.Sprite.prototype);
Popup.prototype.constructor = Popup;

Popup.prototype.Resize = function(xSize, ySize) {

	this.xSize = Math.round(xSize);
	this.ySize = Math.round(ySize);

	var xOffset = Math.floor(this.anchor.x * this.xSize);
	var yOffset = Math.floor(this.anchor.y * this.ySize);

	this.NW.x = -this.NWFrame.width - xOffset;
	this.NW.y = -this.NWFrame.height - yOffset;
	this.NW.width = this.NWFrame.width;
	this.NW.height = this.NWFrame.height;

	this.N.x = 0 - xOffset;
	this.N.y = -this.NFrame.height - yOffset;
	this.N.width = this.xSize;
	this.N.height = this.NFrame.height;

	this.NE.x = this.xSize - xOffset;
	this.NE.y = -this.NEFrame.height - yOffset;
	this.NE.width = this.NEFrame.width;
	this.NE.height = this.NEFrame.height;

	this.W.x = -this.WFrame.width - xOffset;
	this.W.y = 0 - yOffset;
	this.W.width = this.WFrame.width;
	this.W.height = this.ySize;

	this.C.x = 0 - xOffset;
	this.C.y = 0 - yOffset;
	this.C.width = this.xSize;
	this.C.height = this.ySize;

	this.E.x = this.xSize - xOffset;
	this.E.y = 0 - yOffset;
	this.E.width = this.EFrame.width;
	this.E.height = this.ySize;

	this.SW.x = -this.SWFrame.width - xOffset;
	this.SW.y = this.ySize - yOffset;
	this.SW.width = this.SWFrame.width;
	this.SW.height = this.SWFrame.height;

	this.S.x = 0 - xOffset;
	this.S.y = this.ySize - yOffset;
	this.S.width = this.xSize;
	this.S.height = this.SFrame.height;

	this.SE.x = this.xSize - xOffset;
	this.SE.y = this.ySize - yOffset;
	this.SE.width = this.SEFrame.width;
	this.SE.height = this.SEFrame.height;

}

Popup.prototype.Open = function(time) {
	if(time) {
		this.openTime = time;
	}

	this.opening = true;
	for(var element in this.textElements) {
		this.textElements[element].alpha = 0;
	}
	this.Resize(300, 10);
}

Popup.prototype.update = function() {
	if(this.opening) {
		var newX = this.xSize;
		var newY = this.ySize;
		if(this.xSize < this.goalXSize) {
			newX += ((game.time.elapsed / 1000) / this.openTime) * (this.goalXSize - 300);
		}
		if(this.ySize < this.goalYSize) {
			newY += ((game.time.elapsed / 1000) / this.openTime) * (this.goalYSize - 10);
		}

		if(newX > this.goalXSize) {
			newX = this.goalXSize;
		}
		if(newY > this.goalYSize) {
			newY = this.goalYSize;
		}

		if(this.xSize == this.goalXSize && this.ySize == this.goalYSize) {
			this.opening = false;
			for(var element in this.textElements) {
				this.textElements[element].alpha = 1;
			}
			console.log("TEST");
		} else {
			this.Resize(newX, newY);
		}
	}
}