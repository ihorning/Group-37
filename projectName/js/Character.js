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

	//step keeps track of where the character is in the tutorial;
	this.step = 0;

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

	//this.ageBar.scale.set(1 / this.scale.x);
	//1.25
	//this.ageBar.scale.set(1.25);

	// https://phaser.io/examples/v2/input/drag-event-parameters#gv
	this.inputEnabled = true;
	this.input.enableDrag();
	//this.input.dragDistanceThreshold = 5;
	this.input.useHandCursor = true;
	//this.events.onInputUp.add(this.showProfile, this);
	this.events.onDragStart.add(this.WaitForDrag, this);
	this.events.onDragStop.add(this.EndDrag, this);

	game.input.mouse.capture = true;

	// Initialize life value to 100%
	this.life = 100;
	// Initialize happiness value to 100%
	this.happiness = 100;
	this.efficiency = 1;

	//this.debugText = this.addChild(game.make.text(15, -20, "faweion", {font: "20px Courier", fontWeight: "bold", fill: "#fff"}));
	//this.debugText.inputEnabled = true;
	//this.debugText.input.disableDrag();
	this.emote = this.addChild(game.make.sprite(23, -20, "emoteAtlas", "happy"));
	//this.emote.scale.set(0.25);
	this.emote.anchor.set(0.5);
	this.emote.inputEnabled = true;
	this.emote.input.disableDrag();

	this.lifeText = this.addChild(game.make.text(-12, 20, "faweion", {font: "20px Courier", fontWeight: "bold", fill: "#fff"}));
	this.lifeText.inputEnabled = true;
	this.lifeText.input.disableDrag();
	//this.debugText.scale.set(0.7);
	//console.log("debugText note:\n:) = happiness, efficiency\nOn home planet, |difference| < 10 is good\nOn other planet, |difference| < 5 is good\nGreen = regaining happiness\nRed = losing happiness")

	this.line = game.add.graphics();
	this.drawLine = false;

	//this.popup = popup;
	this.popup = new Popup(game, 0, game.height - 115, 365, 140, "UIAtlas", ["windowNW", "windowN", "windowNE", "windowW", "windowC", "windowE", "windowSW", "windowS", "windowSE"]);
	this.picture = profile;
	this.picture.bringToTop();
	this.old = game.add.sprite(0, game.height, 'chars', this.name+"Old");
	this.old.anchor.setTo(0, 1);
	this.old.scale.setTo(0.7);
	this.old.bringToTop();
	this.oldalph = 0;
	// Add an AgeBar for this character
	this.ageBar = game.add.existing(new AgeBar(game, 153, game.height - 95, this));
	this.ageBar.scale.set(1.6);
	//text(x, y, text, {style});
	this.info = {
		name:      game.add.text(150, game.height - 170, "", {font: "35px Courier", fill: "#fff"}),
		age:       game.add.text(150, game.height - 123, "", {font: "25px Courier", fill: "#fff"}),
		diff:      game.add.text(150, game.height - 63, "", {font: "17px Courier", fill: "#fff"}),
		happiness: game.add.text(150, game.height - 38, "", {font: "17px Courier", fill: "#fff"}),
		//quote:     game.add.text(150, game.height - 50, "", {font: "20px Courier", fill: "#fff"})
	}
	this.aDifference = 0;
	this.zDifference = 0;
	this.hideProfile();
	this.clicked = false;
	this.waitingForDrag = false;
	this.dragTimer = 0;
	this.dragOffsetX = 0;
	this.dragOffsetY = 0;

	this.timeSinceLastMessage = 0;
	this.familyHappyMessages = Array.from(Messager.FAMILY_HAPPY);
	this.familyUnhappyMessages = Array.from(Messager.FAMILY_UNHAPPY);
	this.familyYoungerMessages = Array.from(Messager.FAMILY_YOUNGER);
	this.familyOlderMessages = Array.from(Messager.FAMILY_OLDER);
}

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.update = function() {
	this.aDifference = (100 - this.life) - this.home.currentTime;

	if(game.input.activePointer.leftButton.isDown){
		if(this.clicked == false){
			//console.log("hide1");
			this.hideProfile();
			if(this.step == 1){
				this.step = 2;
			}
		}
		else{
			this.showProfile();
			if(this.step == 0){
				this.step = 1;
			}
		}
	}
	
	if(20 + (100 - this.life)*.6 > 35){
		this.oldalph = ((20 + (100 - this.life)*.6)-35)/45;
		if(this.picture.alpha != 0){
			this.old.alpha = this.oldalph;
		}
	}

	var delta;
	if(this.planet != null) {
		delta = this.planet.timeMultiplier * game.universalTime * game.time.elapsed / 1000;
	} else {
		delta = 0;
	}
	//Update profile information
	this.info.name.text = "" + this.name;
	this.info.age.text = Math.floor(20 + (100 - this.life)*.6) + " YEARS OLD";
	
	this.info.happiness.text = "Efficiency: " + Math.floor(this.happiness) + "%";
	//this.info.quote.text = "YEET";

	// Age self
	this.life -= delta;

	this.lifeText.text = Math.floor(this.life)+1 + "%";

	if(this.life < 0) { // If dead,
		//Remove charcter
		this.Die();
	}
											
	//If moused over character show profile
	// if(this.input.pointerOver() && this.life > 0.1){
	// 	this.showProfile();	
	// }
	// else{
	// 	this.hideProfile();
	// }

	if(!this.input.isDragged) { // If on a planet...
		//this.debugText.visible = true;
		this.emote.visible = true;
		this.lifeText.visible = true;
		//this.ageBar.visible = true;

		if(this.life < 11){
			this.lifeText.fill = "#ff0000";
		}
		else if(this.life < 31){
			this.lifeText.fill = "#FF9200";
		}

		var difference = Math.abs((100 - this.life) - this.home.currentTime);

		if(this.planet === this.home) {
			this.happiness += delta * (10 - difference);
			//this.emote.alpha = 1;
			if(difference >=0 && difference < 2){
				//this.debugText.fill = "#00ff00";
				//this.debugText.text = ":)";
				this.emote.frameName = "happy";
				this.showEmote();
				this.info.happiness.fill = "#00ff00";
				this.picture.frameName = this.name;
			}
			else if(difference > 9 && difference < 10){
				//this.debugText.fill = "#00ff00";
				//this.debugText.text = ":|";
				this.emote.frameName = "fine";
				this.showEmote();
				this.info.happiness.fill = "#00ff00";
				this.picture.frameName = this.name + "Meh";
			}
			else if(difference > 10) {
				//this.debugText.fill = "#ff0000";
				//this.debugText.text = ":(";
				//this.emote.frameName = "unhappy";
				this.emote.frameName = "sad";
				this.showEmote();
				this.info.happiness.fill = "#ff0000";
				this.picture.frameName = this.name + "Sad";
			} else {
				//this.debugText.fill = "#00ff00";
				//this.debugText.text = "";
				this.info.happiness.fill = "#00ff00";
				//this.emote.alpha = 0;
				this.hideEmote();
				this.picture.frameName = this.name + "Meh";
			}
		} else {
			//this.emote.alpha = 1;
			this.happiness += delta * (5 - difference);
			if(difference >=0 && difference < 2){
				//this.debugText.fill = "#00ff00";
				//this.debugText.text = ":)";
				this.emote.frameName = "happy";
				this.showEmote();
				this.info.happiness.fill = "#00ff00";
				this.picture.frameName = this.name;
			}
			else if(difference > 4 && difference < 5){
				//this.debugText.fill = "#00ff00";
				//this.debugText.text = ":|";
				this.emote.frameName = "fine";
				this.showEmote();
				this.info.happiness.fill = "#00ff00";
				this.picture.frameName = this.name + "Meh";
			}
			else if(difference > 5) {
				if(this.step == 3){
					this.step = 4;
				}
				//this.debugText.fill = "#ff0000";
				//this.debugText.text = ":(";
				//this.emote.frameName = "unhappy";
				this.emote.frameName = "sad";
				// game.add.tween(this.emote).to({
				// 	rotation: Math.PI/4,
				// }, 200, Phaser.Easing.Linear.None, true, 0, true, true);
				this.showEmote();
				this.info.happiness.fill = "#ff0000";
				this.picture.frameName = this.name + "Sad";
			} else {
				//this.debugText.fill = "#00ff00";
				//this.debugText.text = "";
				this.info.happiness.fill = "#00ff00";
				//this.emote.alpha = 0;
				this.hideEmote();
				this.picture.frameName = this.name + "Meh";
			}
		}

		if(this.happiness < 0) {
			this.happiness = 0;
		} else if(this.happiness > 100) {
			this.happiness = 100;
		}

		this.efficiency = this.happiness / 100;

		var aheadBehind = "ahead of";
		if((100 - this.life) - this.home.currentTime < 0) {
			aheadBehind = "behind";
		}
		if(Math.floor(difference) != 1){
			this.info.diff.text = "" + Math.floor(difference) + " years " + aheadBehind + " family";
		}
		else{
			this.info.diff.text = "" + Math.floor(difference) + " year " + aheadBehind + " family";
		}
		//this.debugText.text = "";


		if(this.planet === this.home) {
			this.timeSinceLastMessage = 0;
		}


		if(this.timeSinceLastMessage > 20 && difference >= 5) {

			this.timeSinceLastMessage = 0;

			if((100 - this.life) - this.home.currentTime > 0) {
				Messager.PushMessage(game, this.name, this.familyYoungerMessages, this.audio[4], true);
			} else {
				Messager.PushMessage(game, this.name, this.familyOlderMessages, this.audio[4], true);
			}

		} else if(this.timeSinceLastMessage > 30 && (this.happiness < 60 || this.happiness == 100)) {

			this.timeSinceLastMessage = 0;

			if(this.happiness > 60) {
				Messager.PushMessage(game, this.name, this.familyHappyMessages, this.audio[4], true);
			} else {
				Messager.PushMessage(game, this.name, this.familyUnhappyMessages, this.audio[4], true);
			}

		} else {
			this.timeSinceLastMessage += (game.universalTime / 0.3) * this.home.timeMultiplier * (game.time.elapsed / 1000);
		}


	} else {
		//this.debugText.visible = false;
		this.emote.visible = false;
		this.lifeText.visible = false;

		this.world.x = game.input.mousePointer.x;
		this.world.y = game.input.mousePointer.y;

		//this.hideProfile();
	}

	// if(this.aDifference < this.zDifference && Math.floor(this.aDifference) != 0){
	// 	this.info.diff.text += " ∧";
	// }
	// else if(this.aDifference > this.zDifference && Math.floor(this.aDifference) != 0){
	// 	this.info.diff.text += " ∨";
	// }

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

	this.zDifference = (100 - this.life) - this.home.currentTime;

	if(this.waitingForDrag) {
		this.WaitForDrag();
	}
}

Character.prototype.Die = function() {
	if(this.planet) {
		this.planet.character = null;
	}

	if(this.happiness > 60) {
		this.audio[2].play('', 0, 1, false);
	} else {
		this.audio[3].play('', 0, 1, false);
	}

	this.waitingForDrag = false;

	this.drawLine = false;
	this.line.clear();
	this.input.disableDrag();

	this.hideProfile();
	this.kill();
}

Character.prototype.ExitPlanet = function() { // Remove this from the current planet (when drag starts)
	this.drawLine = true;
	this.clicked = false;
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

Character.prototype.EnterPlanet = function(planet) { // Add this to the nearest planet (when drag ends)

	this.planet = planet;
	this.planet.addChild(this);
	this.planet.character = this;
	this.planet.pendingArrival = false;
	this.x = 74;
	this.y = 0;
	if(this.step == 2 && this.planet.name == "purple"){
		this.step = 3;
	}
	else if(this.step == 4 && this.planet.name == "blue"){
		this.step = 5;
	}
	else if(this.step == 5 && this.planet.name == "green"){
		this.step = 6;
	}
	else if(this.step == 6){
		this.step = 7;
	}

}

Character.prototype.WaitForDrag = function() {
	this.showProfile();
	this.clicked = true;
	if(this.step == 0){
		this.step = 1;
	}
	if(!this.waitingForDrag) {
		this.dragOffsetX = game.input.mousePointer.x - this.world.x;
		this.dragOffsetY = game.input.mousePointer.y - this.world.y;

		//play the clickCharacter sound
		this.audio[0].play('', 0, 1, false);
	}
	this.waitingForDrag = true;
	this.dragTimer += game.time.elapsed / 1000;
	var difference = Math.pow(Math.pow(game.input.mousePointer.x - (this.input.dragStartPoint.x + this.planet.x), 2) + Math.pow(game.input.mousePointer.y - (this.input.dragStartPoint.y + this.planet.y), 2), 0.5);
	difference -= Math.pow(Math.pow(this.dragOffsetX, 2) + Math.pow(this.dragOffsetY, 2), 0.5);
	if(this.dragTimer > 0.2 || difference > 7) {
		this.waitingForDrag = false;
		this.dragTimer = 0;
		this.BeginDrag();
	}
}

Character.prototype.BeginDrag = function() {
	dragging = true;
	this.clicked = true;

	//Show this characters profile
	//this.showProfile();

	this.x = game.input.mousePointer.x;
	this.y = game.input.mousePointer.y;

	this.drawLine = true;

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
	this.clicked = false;
	
	if(!this.waitingForDrag) {
		//play the dropCharacter sound
		this.audio[1].play('', 0, 1, false);
	} else {
		this.waitingForDrag = false;
		this.dragTimer = 0;
	}

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
		// Put this back on the planet it was on before
		this.planet.addChild(this);
	}

	// Stop drawing lines
	this.line.clear();
	this.drawLine = false;
}

Character.prototype.showEmote = function(){
	if(this.emote.scale.x <= 0.01){
		game.add.tween(this.emote.scale).to({
			x: 1,
			y: 1
		}, 200, Phaser.Easing.Linear.None, true);
	}
}

Character.prototype.hideEmote = function(){
	if(this.emote.scale.x === 1){
		game.add.tween(this.emote.scale).to({
			x: 0.001,
			y: 0.001
		}, 200, Phaser.Easing.Linear.None, true);
	}
}

Character.prototype.showProfile = function(){
	this.popup.alpha = 1;
	this.picture.alpha = 1;
	this.old.alpha = this.oldalph;
	this.ageBar.visible = true;
	for(var property in this.info){
		this.info[property].alpha = 1;
	}
}
Character.prototype.hideProfile = function(){
	this.popup.alpha = 0;
	this.picture.alpha = 0;
	this.old.alpha = 0;
	this.ageBar.visible = false;
	for(var property in this.info){
		this.info[property].alpha = 0;
	}
}