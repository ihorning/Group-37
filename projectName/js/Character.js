"use strict";

function Character(game, planet, planetList, key, frame, audio, name) {

	// Call Phaser.Sprite constructor
	Phaser.Sprite.call(this, game, 53, 0, key, frame, 0);

	// Set anchor to middle
	this.anchor.set(0.5);
	// Set scale to 0.2
	this.scale.set(0.2);

	game.add.existing(this);

	this.name = name;
		
	// Set the planet:
	this.planet = planet; // Get reference to planet
	this.home = this.planet; // Save as home planet
	this.lastPlanet = this.planet;
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
	this.events.onDragStart.add(this.ExitPlanet, this);
	this.events.onDragStop.add(this.EnterPlanet, this);

	// Initialize life value to 100%
	this.life = 100;
	// Initialize happiness value to 100%
	this.happiness = 100;
	this.efficiency = 1;

	this.debugText = this.addChild(game.make.text(80, -90, "faweion", {font: "80px Courier", fontWeight: "bold", fill: "#fff"}));
	console.log("debugText note:\n:) = happiness, efficiency\nOn home planet, |difference| < 10 is good\nOn other planet, |difference| < 5 is good\nGreen = regaining happiness\nRed = losing happiness")
}

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.update = function() {

	var delta;
	if(this.planet != null) {
		delta = this.planet.timeMultiplier * game.universalTime * game.time.elapsed / 1000;
	} else {
		delta = 0;
	}

	if(this.planet != null) { // If on a planet...
		// Age self
		this.life -= delta;

		if(this.life < 0) { // If dead,
			//alert("I died"); // Debug alert

			//Remove charcter
			this.Die();
		}

		var difference = Math.abs((100 - this.life) - this.home.currentTime());

		if(this.planet === this.home) {
			this.happiness += delta * (10 - difference);
			if(difference > 10) {
				this.debugText.fill = "#ff0000";
			} else {
				this.debugText.fill = "#00ff00";
			}
		} else {
			this.happiness += delta * (5 - difference);
			if(difference > 5) {
				this.debugText.fill = "#ff0000";
			} else {
				this.debugText.fill = "#00ff00";
			}
		}

		if(this.happiness < 0) {
			this.happiness = 0;
		} else if(this.happiness > 100) {
			this.happiness = 100;
		}

		this.efficiency = this.happiness / 100;

		var aheadBehind = "ahead";
		if((100 - this.life) - this.home.currentTime() < 0) {
			aheadBehind = "behind";
		}
		this.debugText.text = (this.name+"  :) "+Math.floor(this.happiness)+"%   "+Math.floor(difference)+" "+aheadBehind);
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
}

Character.prototype.EnterPlanet = function() { // Add this to the nearest planet (when drag ends)
	//play the dropCharacter sound
	this.audio[1].play('', 0, 1, false);

	// Find the nearest planet...
	var minDistance = Infinity;
	var minInd = 0;
	for(var i = 0; i < this.planetList.length; i++) { // Select the planet with the smallest distance to this
		if(this.planetList[i].character == null) {
			var newDistance = Math.pow(Math.pow(this.planetList[i].x - this.x, 2) + Math.pow(this.planetList[i].y - this.y, 2), 0.5);
			if(newDistance < minDistance) {
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
	//console.log("new planet: "+this.planet);
	if(this.lastPlanet !== this.planet) {
		if(this.planet === this.home) {
			console.log(this.name+" gains 10 points of happiness for going home");
			this.happiness += 10;
			if(this.happiness > 100) {
				this.happiness = 100;
			}
		} else {
			console.log(this.name+" loses 10 points of happiness for travel");
			this.happiness -= 10;
			if(this.happiness < 0) {
				this.happiness = 0;
			}
		}
	}
	this.lastPlanet = this.planet;
}