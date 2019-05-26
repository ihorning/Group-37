"use strict";

var CURVED_LINE = true;

function Character(game, planet, planetList, key, frame, audio, name, profile) {

	// Call Phaser.Sprite constructor
	Phaser.Sprite.call(this, game, 74, 0, key, frame, 0);

	// Set anchor to middle
	this.anchor.set(0.5);
	// Set scale to 0.2
	//this.scale.set(0.55);

	game.add.existing(this);

	this.name = name;
		
	// Set the planet:
	this.planet = planet; // Get reference to planet
	this.home = this.planet; // Save as home planet
	this.planet.addChild(this); // Make this person a child of the planet
	this.planet.character = this; // Give the planet reference to this

	// Store the planetList
	this.planetList = planetList;

	//Store the audio for character interaction
	this.audio = audio;


	// Add an AgeBar for this character
	this.ageBar = this.addChild(new AgeBar(game, 110, 0, this));

	//this.ageBar.scale.set(1 / this.scale.x);
	//1.25
	this.ageBar.scale.set(1.25);

	// https://phaser.io/examples/v2/input/drag-event-parameters#gv
	this.inputEnabled = true;
	this.input.enableDrag();
	this.input.useHandCursor = true;
	this.events.onDragStart.add(this.BeginDrag, this);
	this.events.onDragStop.add(this.EndDrag, this);

	// Initialize life value to 100%
	this.life = 100;
	// Initialize happiness value to 100%
	this.happiness = 100;
	this.efficiency = 1;

	this.debugText = this.addChild(game.make.text(15, -20, "faweion", {font: "20px Courier", fontWeight: "bold", fill: "#fff"}));
	this.debugText.scale.set(0.7);
	console.log("debugText note:\n:) = happiness, efficiency\nOn home planet, |difference| < 10 is good\nOn other planet, |difference| < 5 is good\nGreen = regaining happiness\nRed = losing happiness")

	this.line = game.add.graphics();
	this.drawLine = false;

	this.picture = profile;
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

	// Age self
	this.life -= delta;

	if(this.life < 0) { // If dead,

		//Remove charcter
		this.Die();
	}

	if(!this.input.isDragged) { // If on a planet...
		this.debugText.visible = true;
		this.ageBar.visible = true;

		var difference = Math.abs((100 - this.life) - this.home.currentTime);

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
		if((100 - this.life) - this.home.currentTime < 0) {
			aheadBehind = "behind";
		}
		this.debugText.text = (":) "+Math.floor(this.happiness)+"%  "+Math.floor(difference)+" "+aheadBehind);

		this.ageBar.x = 110; // Update AgeBar x and y
		this.ageBar.y = 0;
	} else {
		this.debugText.visible = false;
		this.ageBar.visible = false;
	}

	this.line.clear();
	if(this.drawLine) {
		if(!CURVED_LINE) {

			this.line.lineStyle(4, 0xffffff, 0.5);
			this.line.moveTo(this.planet.x, this.planet.y);
			this.line.lineTo(game.input.mousePointer.x, game.input.mousePointer.y);

		} else if(CURVED_LINE) {

			var orbitAngle = Math.atan2(game.world.centerY - game.input.mousePointer.y, game.input.mousePointer.x - game.world.centerX);
			var orbitRad = Math.pow(Math.pow(game.world.centerX - game.input.mousePointer.x, 2) + Math.pow(game.world.centerY - game.input.mousePointer.y, 2), 0.5);

			var x0 = this.planet.orbitAngle;
			var x1 = orbitAngle;
			var y0 = this.planet.orbitRad;
			var y1 = orbitRad;

			var newCurve = new RocketCurve(x0, x1, y0, y1, 0.8, 2);

			if(!newCurve.reverse) {
				for(var i = newCurve.x0; i < newCurve.x1; i += (newCurve.x1 - newCurve.x0) / 50) {
					this.line.beginFill(0xffffff, (i - newCurve.x0) / (newCurve.x1 - newCurve.x0));
					var newRad = newCurve.y(i);
					var newX = game.world.centerX + (newRad * Math.cos(i));
					var newY = game.world.centerY - (newRad * Math.sin(i));
					this.line.drawCircle(newX, newY, 5);
				}
			} else {
				for(var i = newCurve.x1; i < newCurve.x0; i += (newCurve.x0 - newCurve.x1) / 50) {
					this.line.beginFill(0xffffff, (newCurve.x0 - i) / (newCurve.x0 - newCurve.x1));
					var newRad = newCurve.y(i);
					var newX = game.world.centerX + (newRad * Math.cos(i));
					var newY = game.world.centerY - (newRad * Math.sin(i));
					this.line.drawCircle(newX, newY, 5);
				}
			}

		}

		this.line.beginFill(0x000000, 0);
		this.line.lineStyle(4, 0xffffff, 0.5);

		for(var i = 0; i < this.planetList.length; i++) {
			if(this.planetList[i].character == null && !this.planetList[i].pendingArrival) {
				this.line.moveTo(this.planetList[i].x, this.planetList[i].y);
				this.line.drawCircle(this.planetList[i].x, this.planetList[i].y, 100 + (10 * Math.sin(this.planetList[i].currentTime * Math.PI)))
			}
		}
	}

	if(!this.alive) {
		this.ageBar.visible = false;
	} else {
		this.ageBar.update();
	}
}

Character.prototype.Die = function() {
	if(this.planet) {
		this.planet.character = null;
	}
	//this.line.clear();
	//this.input.disableDrag();
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
	this.planet.pendingArrival = false;
	this.x = 74;
	this.y = 0;
	this.ageBar.visible = true;
	this.ageBar.x = 110; // Update AgeBar x and y
	this.ageBar.y = 0;
	console.log("new planet: "+this.planet);

}

Character.prototype.BeginDrag = function() {
	dragging = true;

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

	//this.picture.alpha = 1;

	// Put this in the game world
	game.add.existing(this);
}

Character.prototype.EndDrag = function() {
	dragging = false;
	
	//play the dropCharacter sound
	this.audio[1].play('', 0, 1, false);

	// Find the nearest planet...
	var minDistance = Infinity;
	var minInd = 0;
	for(var i = 0; i < this.planetList.length; i++) { // Select the planet with the smallest distance to this
		if(this.planetList[i].character == null && !this.planetList[i].pendingArrival) {
			var newDistance = Math.pow(Math.pow(this.planetList[i].x - this.x, 2) + Math.pow(this.planetList[i].y - this.y, 2), 0.5);
			if(newDistance < minDistance) {
				minDistance = newDistance;
				minInd = i;
			}
		}
	}

	// Set x and y to default distance from planet
	this.x = 74;
	this.y = 0;

	// If within range of valid planet...
	if(minDistance < 100) {

		this.ageBar.visible = false;

		if(this.planetList[minInd] === this.home) {
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

		this.planetList[minInd].pendingArrival = true;

		// Make a rocket
		var newRocket = new Rocket(game, this.planet, this.planetList[minInd], this, 300, "rocketAtlas", "rocket");
		this.input.disableDrag();
		// Add this as a child
		newRocket.addChild(this);
		// Position to be beside the rocket
		this.x = 100;
		this.y = -200;
		// Remove this from planet and planet from this
		this.planet.character = null;
		this.planet = null;
	} else { // If not chosen valid planet,
		//console.log(minDistance);
		// Put this back on the planet it was on before
		this.planet.addChild(this);
	}

	// Stop drawing lines
	this.line.clear();
	this.drawLine = false;
}