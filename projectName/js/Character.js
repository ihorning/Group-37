"use strict";

function Character(game, planet, planetList, key, frame, audio) {
	// Call Phaser.Sprite constructor
	Phaser.Sprite.call(this, game, 53, 0, key, frame, 0);

	// Set anchor to middle
	this.anchor.set(0.5);
	// Set scale to 0.2
	this.scale.set(0.2);

	game.add.existing(this);
		
	// Set the planet:
	this.planet = planet; // Get reference to planet
	this.planet.addChild(this); // Make this person a child of the planet
	this.planet.character = this; // Give the planet reference to this

	// Store the planetList
	this.planetList = planetList;

	//Store the audio for character interaction
	this.audio = audio;


	// Add an AgeBar for this character
	this.ageBar = game.add.existing(new AgeBar(game, this.width, 0, this));
	// Set its location
	this.ageBar.x = this.planet.x + this.x + this.width;
	this.ageBar.y = this.planet.y + this.y;

	// https://phaser.io/examples/v2/input/drag-event-parameters#gv
	this.inputEnabled = true;
	this.input.enableDrag();
	this.events.onDragStart.add(this.BeginDrag, this);
	this.events.onDragStop.add(this.EndDrag, this);

	// Initialize life value to 100%
	this.life = 100;

	this.line = game.add.graphics();
	this.drawLine = false;
}

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.update = function() {
	if(!this.isDragged) { // If on a planet...
		// Age self
		this.life -= this.planet.timeMultiplier * game.time.elapsed / 1000;
		if(this.life < 0) { // If dead,
			//alert("I died"); // Debug alert

			//Remove charcter
			this.Die();
		}

		this.ageBar.x = this.planet.x + this.x + this.width; // Update AgeBar x and y
		this.ageBar.y = this.planet.y + this.y;
	} else {
		this.ageBar.x = this.x;
		this.ageBar.y = this.y;
	}

	this.line.clear();
	if(this.drawLine) {
		this.line.lineStyle(4, 0xffffff, 0.5);
		this.line.moveTo(this.planet.x, this.planet.y);
		this.line.lineTo(game.input.mousePointer.x, game.input.mousePointer.y);

		for(var i = 0; i < this.planetList.length; i++) {
			if(this.planetList[i].character == null) {
				this.line.moveTo(this.planetList[i].x, this.planetList[i].y);
				this.line.drawCircle(this.planetList[i].x, this.planetList[i].y, 100 + (10 * Math.sin(this.planetList[i].currentTime() * Math.PI)))
			}
		}
	}
}

Character.prototype.Die = function() {
	if(this.planet) {
		this.planet.character = null;
	}
	this.ageBar.kill();
	this.kill();
}

Character.prototype.ExitPlanet = function() { // Remove this from the current planet (when drag starts)
	this.drawLine = true;
	//play the clickCharacter sound
	this.audio[0].play('', 0, 1, false);

	// Find and remove this from the planet's children
	for(var i = 0; i < this.planet.children.length; i++) {
		if(this.planet.children[i] === this) {
			this.planet.children.splice(i, 1);
			break;
		}
	}
	// Remove reference from planet
	this.planet.character = null;
	// Remove reference of planet
	this.planet = null;
	// Put this in the main game group
	game.add.existing(this);
	//console.log("this should be null: "+this.planet);
}

Character.prototype.EnterPlanet = function(planet) { // Add this to the nearest planet (when drag ends)

	this.planet = planet;
	this.planet.addChild(this);
	this.planet.character = this;
	this.x = 53;
	this.y = 0;
	this.ageBar.x = this.planet.x + this.x + this.width; // Update AgeBar x and y
	this.ageBar.y = this.planet.y + this.y;
	console.log("new planet: "+this.planet);

}

Character.prototype.BeginDrag = function() {
	this.drawLine = true;
	//play the clickCharacter sound
	this.audio[0].play('', 0, 1, false);

	// Find and remove this from the planet's children
	for(var i = 0; i < this.planet.children.length; i++) {
		if(this.planet.children[i] === this) {
			this.planet.children.splice(i, 1);
			break;
		}
	}

	// Put this in the game world
	game.add.existing(this);
}

Character.prototype.EndDrag = function() {
	//play the dropCharacter sound
	this.audio[1].play('', 0, 1, false);

	// Find the nearest planet...
	var minDistance = Infinity;
	var minInd = 0;
	for(var i = 0; i < this.planetList.length; i++) { // Select the planet with the smallest distance to this
		if(this.planetList[i].character == null) {
			var newDistance = Math.pow(Math.pow(this.planetList[i].x - this.x, 2) + Math.pow(this.planetList[i].y - this.y, 2), 0.5);
			if(newDistance < minDistance) {
				console.log("TET");
				minDistance = newDistance;
				minInd = i;
			}
		}
	}

	// Set x and y to default distance from planet
	this.x = 53;
	this.y = 0;
	// If within range of valid planet...
	if(minDistance < 100) {
		// Make a rocket
		var newRocket = new Rocket(game, this.planet, this.planetList[minInd], this, 100, "rocketAtlas", "rocket");
		// Add this as a child
		newRocket.addChild(this);
		// Position to be beside the rocket
		this.x = 100;
		this.y = -200;
		// Remove this from planet and planet from this
		this.planet.character = null;
		this.planet = null;
	} else { // If not chosen valid planet,
		console.log(minDistance);
		// Put this back on the planet it was on before
		this.planet.addChild(this);
	}

	// Stop drawing lines
	this.line.clear();
	this.drawLine = false;
}