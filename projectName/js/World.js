"use strict";

function World(game, x, y, key, frame, timeMultiplier) {
	Phaser.Sprite.call(this, game, x, y, key, frame);
	this.anchor.set(0.5);

	this.timeMultiplier = timeMultiplier;
	
	this.timer = game.time.create(false);
	this.timer.start();

	game.add.existing(this);



	this.debugTimeDisplay = this.addChild(game.make.text(0, 0, "0", {font: "15px Courier", font: "15px Lucida Console", fontWeight: "bold", fill: "#f22"}));
	this.debugTimeDisplay.anchor.set(0.5);


	this.job = this.addChild(new WorkBar(game, -WORK_PROGRESS_WIDTH / 2, ((this.height / 2) + 50), this.timeMultiplier));


	this.character = null;

}

World.prototype = Object.create(Phaser.Sprite.prototype);

World.prototype.constructor = World;

World.prototype.update = function() {
	var numberToDisplay = Math.floor(this.currentTime() * 10) / 10;
	if(Math.floor(numberToDisplay) == numberToDisplay) {
		this.debugTimeDisplay.text = numberToDisplay+".0";
	} else {
		this.debugTimeDisplay.text = numberToDisplay+"";
	}

	if(this.character = null) {
		this.job.sleep = true;
	} else {
		this.job.sleep = false;
	}

	this.job.update();
}

World.prototype.currentTime = function() {
	return this.timeMultiplier * this.timer.seconds;
}