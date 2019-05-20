"use strict";

// Constructor
function CircleBar(game, x, y, divisions, key, frame) {
	Phaser.Sprite.call(this, game, x, y, key, frame, 0);
	this.anchor.set(0.5);
	game.add.existing(this);

	this.divisions = divisions;

	this.progressMask = game.add.graphics();
	this.addChild(this.progressMask);
	this.mask = this.progressMask;
}

CircleBar.prototype = Object.create(Phaser.Sprite.prototype);
CircleBar.prototype.constructor = CircleBar;

CircleBar.prototype.setMask = function(percent) {
	var roundedPercent = (100 / this.divisions) * Math.floor(percent / (100 / this.divisions));
	var startAngle = 0;
	var endAngle = (roundedPercent / 100) * Math.PI * 2;
	var radius = this.width / 2;
	var maskPath = [new Phaser.Point(0, 0)];
	for(var i = 0; i < 500; i++) {
		maskPath[maskPath.length] = new Phaser.Point(radius * Math.cos((endAngle - startAngle) * (i / 500)), radius * Math.sin((endAngle - startAngle) * (i / 500)));
	}
	maskPath[maskPath.length] = new Phaser.Point(0, 0);
	this.progressMask.clear();
	this.progressMask.beginFill(0xffffff, 1);
	this.progressMask.drawPolygon(maskPath);
}

CircleBar.prototype.update = function() {
	
}