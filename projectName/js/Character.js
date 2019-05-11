"use strict";

function Character(game, planet, planetList, key, frame) {
	Phaser.Sprite.call(this, game, planet.x + 53, planet.y, key, frame, 0);
	this.anchor.set(0.5);
	this.scale.set(0.2);
	
	this.planet = planet;
	this.planet.addChild(this);
	this.planet.character = this;
	this.planetList = planetList;

	game.add.existing(this);


	this.ageBar = game.add.existing(new AgeBar(game, this.width, 0, this));
	this.ageBar.x = this.x + this.width;
	this.ageBar.y = this.y;

	// https://phaser.io/examples/v2/input/drag-event-parameters#gv
	this.inputEnabled = true;
	this.input.enableDrag();
	this.events.onDragStart.add(this.ExitPlanet, this);
	this.events.onDragStop.add(this.EnterPlanet, this);

	this.life = 100;
}

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.update = function() {
	if(this.planet != null) {
		this.life -= this.planet.timeMultiplier * game.time.elapsed / 1000;
		if(this.life < 0) {
			alert("I died");
			this.destroy();
		}
	}
}

Character.prototype.ExitPlanet = function() {
	for(var i = 0; i < this.planet.children.length; i++) {
		if(this.planet.children[i] === this) {
			this.planet.children.splice(i, 1);
			break;
		}
	}
	this.planet.character = null;
	this.planet = null;
	game.add.existing(this);
	console.log("this should be null: "+this.planet);
}

Character.prototype.EnterPlanet = function() {
	var minDistance = Math.pow(Math.pow(Math.abs(this.planetList[0].x - this.x, 2) + Math.pow(this.planetList[0].y - this.y)), 0.5);
	minDistance = Infinity;
	var minInd = 0;
	for(var i = 0; i < this.planetList.length; i++) {
		if(this.planetList[i].character == null) {
			var newDistance = Math.pow(Math.pow(this.planetList[i].x - this.x, 2) + Math.pow(this.planetList[i].y - this.y, 2), 0.5);
			if(newDistance < minDistance) {
				console.log("TET");
				minDistance = newDistance;
				minInd = i;
			}
		}
	}
	this.planet = this.planetList[minInd];
	this.planet.addChild(this);
	this.planet.character = this;
	this.x = 53;
	this.y = 0;
	this.ageBar.x = this.planet.x + this.x + this.width;
	this.ageBar.y = this.planet.y + this.y;
	console.log("new planet: "+this.planet);
}