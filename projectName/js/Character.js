"use strict";

function Character(game, planet, planetList, key, frame) {
	// Call Phaser.Sprite constructor
	Phaser.Sprite.call(this, game, planet.x + 53, planet.y, key, frame, 0);

	// Set anchor to middle
	this.anchor.set(0.5);
	// Set scale to 0.2
	this.scale.set(0.2);
		
	// Set the planet:
	this.planet = planet; // Get reference to planet
	this.planet.addChild(this); // Make this person a child of the planet
	this.planet.character = this; // Give the planet reference to this

	// Store the planetList
	this.planetList = planetList;

	// Add this to the game
	game.add.existing(this);


	// Add an AgeBar for this character
	this.ageBar = game.add.existing(new AgeBar(game, this.width, 0, this));
	// Set its location
	this.ageBar.x = this.x + this.width;
	this.ageBar.y = this.y;

	// https://phaser.io/examples/v2/input/drag-event-parameters#gv
	this.inputEnabled = true;
	this.input.enableDrag();
	this.events.onDragStart.add(this.ExitPlanet, this);
	this.events.onDragStop.add(this.EnterPlanet, this);

	// Initialize life value to 100%
	this.life = 100;
}

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.update = function() {
	if(this.planet != null) { // If on a planet...
		// Age self
		this.life -= this.planet.timeMultiplier * game.time.elapsed / 1000;
		if(this.life < 0) { // If dead,
			//alert("I died"); // Debug alert
			this.destroy(); // Destroy this
		}
	}
}

Character.prototype.ExitPlanet = function() { // Remove this from the current planet (when drag starts)
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
	console.log("this should be null: "+this.planet);
}

Character.prototype.EnterPlanet = function() { // Add this to the nearest planet (when drag ends)
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
	// Set up new planet...
	this.planet = this.planetList[minInd]; // Get reference
	this.planet.addChild(this); // Add this as child
	this.planet.character = this; // Give it reference to this
	this.x = 53; // Set x and y position
	this.y = 0;
	this.ageBar.x = this.planet.x + this.x + this.width; // Update AgeBar x and y
	this.ageBar.y = this.planet.y + this.y;
	console.log("new planet: "+this.planet);
}