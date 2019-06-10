"use strict";

// Whether or not the rocket path projection line is curved
var CURVED_LINE = true;

// Constructor
// game: the game
// planet: this character's home planet
// planetList: an array of all the planets
// key: texture atlas
// frame: the small icon for this character
// audio: array of audio objects this Character will play
// profile: the sprite showing the larger picture of this Character

// Constructor
function Character(game, planet, planetList, key, frame, audio, name, profile) {

	// Call Phaser.Sprite constructor
	Phaser.Sprite.call(this, game, 74, 0, key, frame, 0);

	// Set anchor to middle
	this.anchor.set(0.5);

	// Add this to the game
	game.add.existing(this);

	// Step keeps track of where the character is in the tutorial;
	this.step = 0;

	//Keeps track of if tutorial popups have been opened
	this.openOnce = false;

	// Save this character's name
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

	// https://phaser.io/examples/v2/input/drag-event-parameters#gv
	// Enable drag input on this Character
	this.inputEnabled = true;
	this.input.enableDrag();
	this.input.useHandCursor = true;
	this.events.onDragStart.add(this.WaitForDrag, this);
	this.events.onDragStop.add(this.EndDrag, this);

	// Initialize life value to 100%
	this.life = 100;
	// Initialize happiness value to 100%
	this.happiness = 100;
	this.efficiency = 1;

	// Add the emote sprite as a child
	this.emote = this.addChild(game.make.sprite(23, -20, "emoteAtlas", "happy"));
	this.emote.anchor.set(0.5);
	this.emote.inputEnabled = true;
	this.emote.input.disableDrag();

	// Add the life % text object as a child
	this.lifeText = this.addChild(game.make.text(-12, 20, "faweion", {font: "20px Courier", fontWeight: "bold", fill: "#fff"}));
	this.lifeText.inputEnabled = true;
	this.lifeText.input.disableDrag();

	// Create the graphics object to draw the rocket path projection
	this.line = game.add.graphics();
	// Not drawing a line initially
	this.drawLine = false;

	// Add a Popup that Character statistics will be shown on
	this.popup = new Popup(game, 0, game.height - 115, 365, 140, "UIAtlas", ["windowNW", "windowN", "windowNE", "windowW", "windowC", "windowE", "windowSW", "windowS", "windowSE"]);
	this.picture = profile;
	this.picture.bringToTop();

	// Add oldness filter but initialize it as invisible
	this.old = game.foreground.add(game.make.sprite(0, game.height, 'chars', this.name+"Old"));
	this.old.anchor.setTo(0, 1);
	this.old.scale.setTo(0.7);
	this.old.bringToTop();
	this.oldalph = 0;

	// Add an AgeBar for this character
	this.ageBar = game.foreground.add(new AgeBar(game, 153, game.height - 95, this));
	this.ageBar.scale.set(1.6);
	//text(x, y, text, {style});
	this.info = {
		name:      game.foreground.add(game.make.text(150, game.height - 170, "", {font: "35px Courier", fill: "#fff"})),
		age:       game.foreground.add(game.make.text(150, game.height - 123, "", {font: "25px Courier", fill: "#fff"})),
		diff:      game.foreground.add(game.make.text(150, game.height - 63, "", {font: "17px Courier", fill: "#fff"})),
		happiness: game.foreground.add(game.make.text(150, game.height - 38, "", {font: "17px Courier", fill: "#fff"}))
	}
	this.aDifference = 0;
	this.zDifference = 0;
	this.hideProfile();
	this.clicked = false;
	this.waitingForDrag = false;
	this.dragTimer = 0;
	this.dragOffsetX = 0;
	this.dragOffsetY = 0;

	this.clickOnce = true;

	// Initialize the time since last message from home was sent
	this.timeSinceLastMessage = 0;

	// Create a list of happy messages
	this.familyHappyMessages = Array.from(Messager.FAMILY_HAPPY);
	for(var i = 0; i < this.familyHappyMessages.length; i++) {
		this.familyHappyMessages[i] = this.familyHappyMessages[i].replace(/@/g, this.name);
	}

	// Create a list of bad-but-getting-better messages
	this.familyUnhappyMessages = Array.from(Messager.FAMILY_UNHAPPY);
	for(var i = 0; i < this.familyUnhappyMessages.length; i++) {
		this.familyUnhappyMessages[i] = this.familyUnhappyMessages[i].replace(/@/g, this.name);
	}

	// Create a list of family-too-young messages
	this.familyYoungerMessages = Array.from(Messager.FAMILY_YOUNGER);
	for(var i = 0; i < this.familyYoungerMessages.length; i++) {
		this.familyYoungerMessages[i] = this.familyYoungerMessages[i].replace(/@/g, this.name);
	}

	// Create a list of family-too-old messages
	this.familyOlderMessages = Array.from(Messager.FAMILY_OLDER);
	for(var i = 0; i < this.familyOlderMessages.length; i++) {
		this.familyOlderMessages[i] = this.familyOlderMessages[i].replace(/@/g, this.name);
	}

	this.currentGTime = 0.3; //time check for leaving the profile open when speed arrow clicked 

	this.continue = false; //boolean for handling clicking through the tutorial to keep the profile open
}

// Set prototype to a copy of Phaser.Sprite prototype
Character.prototype = Object.create(Phaser.Sprite.prototype);
// Define constructor
Character.prototype.constructor = Character;

// Define the Character's update function
Character.prototype.update = function() {
	if(game.state.getCurrentState().key === 'GameOver'){
		this.inputEnabled = false;
	}

	this.aDifference = (100 - this.life) - this.home.currentTime;

	if(game.input.activePointer.isDown){
		if(this.clickOnce){ //make sure tutorial steps aren't skipped
			switch(this.step){ // tutorial advancement
				case 0:
					this.step = 1;
					this.openOnce = false;
					if(game.state.getCurrentState().key === 'Tutorial'){
						this.continue = true;
					}
					break;
				case 3:
					this.step = 4;
					this.openOnce = false;
					if(game.state.getCurrentState().key === 'Tutorial'){
						this.continue = true;
					}
					break;
				case 5:
					this.step = 6;
					this.openOnce = false;
					if(game.state.getCurrentState().key === 'Tutorial'){
						this.continue = true;
					}
					break;
				case 9:
					this.step = 10;
					this.openOnce = false;
					if(game.state.getCurrentState().key === 'Tutorial'){
						this.continue = true;
					}
					break;
				case 11:
					this.step = 12;
					this.openOnce = false;
					if(game.state.getCurrentState().key === 'Tutorial'){
						this.continue = true;
					}
					break;
				case 12:
					this.step = 13;
					this.openOnce = false;
					if(game.state.getCurrentState().key === 'Tutorial'){
						this.continue = true;
					}
					break;
				case 13:
					this.step = 14;
					this.openOnce = false;
					if(game.state.getCurrentState().key === 'Tutorial'){
						this.continue = true;
					}
			}
			this.clickOnce = false; //set clickOnce to false until mouse is up again
		}
		//Check if this character was clicked
		if(this.clicked == false && this.currentGTime === game.universalTime){ // if not and speed arrows weren't clicked, hide thier profile
			if(!this.continue){
				this.hideProfile();
			}
			if(this.step == 2){ // tutorial advancement
				this.step = 3;
				this.openOnce = false;
			}
		}
		else if(this.currentGTime != game.universalTime && this.picture.alpha === 0){ // if a speed arrow clicked while a profile is open, don't close it
			this.hideProfile();
		}
		else{ // if they were clicked, show their profile
			this.showProfile();
			if(this.step == 1){
				this.step = 2;
				this.openOnce = false;
			}
		}
	}
	else{
		this.clickOnce = true; //set clickOnce to true if mouse is not down
		this.currentGTime = game.universalTime; //reset time and tutorial advancement checks
		this.continue = false;
	}
	
	//if character is over 35 start to fade in the oldness filter
	if(20 + (100 - this.life)*.6 > 35){
		this.oldalph = ((20 + (100 - this.life)*.6)-35)/45;
		if(this.picture.alpha != 0){
			this.old.alpha = this.oldalph;
		}
	}

	// Calculate difference in time since last frame
	var delta;
	if(this.planet != null) { // Based on planet speed if on a planet
		delta = this.planet.timeMultiplier * game.universalTime * game.time.elapsed / 1000;
	} else { // No time passes if in a rocket
		delta = 0;
	}

	// Update profile information
	this.info.name.text = "" + this.name;
	this.info.age.text = Math.floor(20 + (100 - this.life)*.6) + " YEARS OLD";
	
	this.info.happiness.text = "Efficiency: " + Math.floor(this.happiness) + "%";

	// Age self
	this.life -= delta;

	// Update life text
	this.lifeText.text = Math.floor(this.life)+1 + "%";


	if(!this.input.isDragged) { // If on a planet...
		// Emote and life text are visible
		this.emote.visible = true;
		this.lifeText.visible = true;

		// Set color of life text
		if(this.life < 11){
			this.lifeText.fill = "#ff0000";
		}
		else if(this.life < 31){
			this.lifeText.fill = "#FF9200";
		}

		// Get the absolute value difference in age from home
		var difference = Math.abs((100 - this.life) - this.home.currentTime);

		// If at home...
		if(this.planet === this.home) {
			this.happiness += delta * (10 - difference);
			//this.emote.alpha = 1;
			if(difference >=0 && difference < 2){
				this.emote.frameName = "happy";
				this.showEmote();
				this.info.happiness.fill = "#00ff00";
				this.picture.frameName = this.name;
			}
			else if(difference > 9 && difference < 10){
				this.emote.frameName = "fine";
				this.showEmote();
				this.info.happiness.fill = "#00ff00";
				this.picture.frameName = this.name + "Meh";
			}
			else if(difference > 10) {
				//this.emote.frameName = "unhappy";
				this.emote.frameName = "sad";
				this.showEmote();
				this.info.happiness.fill = "#ff0000";
				this.picture.frameName = this.name + "Sad";
			} else {
				this.info.happiness.fill = "#00ff00";
				//this.emote.alpha = 0;
				this.hideEmote();
				this.picture.frameName = this.name + "Meh";
			}
		} else { // If not at home...
			//this.emote.alpha = 1;
			this.happiness += delta * (5 - difference);
			if(difference >=0 && difference < 2){
				this.emote.frameName = "happy";
				this.showEmote();
				this.info.happiness.fill = "#00ff00";
				this.picture.frameName = this.name;
			}
			else if(difference > 4 && difference < 5){
				this.emote.frameName = "fine";
				this.showEmote();
				this.info.happiness.fill = "#00ff00";
				this.picture.frameName = this.name + "Meh";
			}
			else if(difference > 5) {
				if(this.step == 7){
					this.step = 8;
					this.openOnce = false;
				}
				//this.emote.frameName = "unhappy";
				this.emote.frameName = "sad";
				// game.add.tween(this.emote).to({
				// 	rotation: Math.PI/4,
				// }, 200, Phaser.Easing.Linear.None, true, 0, true, true);
				this.showEmote();
				this.info.happiness.fill = "#ff0000";
				this.picture.frameName = this.name + "Sad";
			} else {
				this.info.happiness.fill = "#00ff00";
				//this.emote.alpha = 0;
				this.hideEmote();
				this.picture.frameName = this.name + "Meh";
			}
		}

		// Keep happiness in range [0, 100]
		if(this.happiness < 0) {
			this.happiness = 0;
		} else if(this.happiness > 100) {
			this.happiness = 100;
		}

		// Calculate efficiency
		this.efficiency = this.happiness / 100;

		if(game.state.getCurrentState().key != "Tutorial") {

			if(this.planet === this.home) { // If at home,
				this.timeSinceLastMessage = 0; // Reset time since last message
			}

			if(this.timeSinceLastMessage > 40 && difference < 5) { // If it has been 40 units since last message and age difference is small,
				this.timeSinceLastMessage = 40; // Cap at 40, leaving >5 units of time after threshold passed before a message is sent
			}

			if(this.timeSinceLastMessage > 45 && difference >= 5) { // If it has been 45 units since last message and age difference is large...

				// Reset time since last message
				this.timeSinceLastMessage = 0;

				// Push a message according to ahead/behind
				if((100 - this.life) - this.home.currentTime > 0) {
					Messager.PushMessage(game, this, this.familyYoungerMessages, this.audio[4], true);
				} else {
					Messager.PushMessage(game, this, this.familyOlderMessages, this.audio[4], true);
				}

			} else if(this.timeSinceLastMessage >= 45 && (this.happiness < 60 || this.happiness == 100)) { // If it has been 45 units since last message, difference is small, and happiness is significantly high/low...

				// Reset time since last message
				this.timeSinceLastMessage = 0;

				// Push a message according to happiness
				if(this.happiness > 60) {
					Messager.PushMessage(game, this, this.familyHappyMessages, this.audio[4], true);
				} else {
					Messager.PushMessage(game, this, this.familyUnhappyMessages, this.audio[4], true);
				}

			} else { // If no message should be sent,
				this.timeSinceLastMessage += (game.universalTime / 0.3) * this.home.timeMultiplier * (game.time.elapsed / 1000); // Update time since last message
			}
		}


	} else { // If being dragged...
		// Set emote and life text to invisible
		this.emote.visible = false;
		this.lifeText.visible = false;

		// Set position to input position
		this.world.x = game.input.x;
		this.world.y = game.input.y;

	}

	// Update the ahead/behind number on the profile
	this.UpdateAheadBehind();

	// if(this.aDifference < this.zDifference && Math.floor(this.aDifference) != 0){
	// 	this.info.diff.text += " ∧";
	// }
	// else if(this.aDifference > this.zDifference && Math.floor(this.aDifference) != 0){
	// 	this.info.diff.text += " ∨";
	// }

	// Clear the rocket path line
	this.line.clear();
	// If a line should be drawn...
	if(this.drawLine) {
		if(!CURVED_LINE) { // Straight version:
			// Draw a straight line from planet to character
			this.line.lineStyle(4, 0xffffff, 0.5);
			this.line.moveTo(this.planet.x, this.planet.y);
			this.line.lineTo(game.input.x, game.input.y);

		} else if(CURVED_LINE) { // Curved version:
			// Calculate the polar coordinates of the character
			var orbitAngle = Math.atan2(game.world.centerY - this.world.y, this.world.x - game.world.centerX);
			var orbitRad = Math.pow(Math.pow(game.world.centerX - this.world.x, 2) + Math.pow(game.world.centerY - this.world.y, 2), 0.5);

			// Get arguments for the curve to be drawn
			var x0 = this.planet.orbitAngle;
			var x1 = orbitAngle;
			var y0 = this.planet.orbitRad;
			var y1 = orbitRad;

			// Create a new RocketCurve
			var newCurve = new RocketCurve(x0, x1, y0, y1, 0.8, 2);

			if(!newCurve.reverse) { // If not reversed curve...
				// Use oddEven boolean for alternating dot size
				var oddEven = false;
				// Draw dots along the curve from start to finish...
				for(var i = newCurve.x0; i < newCurve.x1; i += (newCurve.x1 - newCurve.x0) / 50) {
					this.line.beginFill(0xffffff, (i - newCurve.x0) / (newCurve.x1 - newCurve.x0));
					var newRad = newCurve.y(i);
					var newX = game.world.centerX + (newRad * Math.cos(i));
					var newY = game.world.centerY - (newRad * Math.sin(i));
					var circleRad;
					if(oddEven) {
						circleRad = 5;
					} else {
						circleRad = 4;
					}
					oddEven = !oddEven;
					this.line.drawCircle(newX, newY, circleRad);
				}
			} else { // If reversed curve...
				// Use oddEven boolean for alternating dot size
				var oddEven = false;
				// Draw dots along the curve from finish to start...
				for(var i = newCurve.x1; i < newCurve.x0; i += (newCurve.x0 - newCurve.x1) / 50) {
					this.line.beginFill(0xffffff, (newCurve.x0 - i) / (newCurve.x0 - newCurve.x1));
					var newRad = newCurve.y(i);
					var newX = game.world.centerX + (newRad * Math.cos(i));
					var newY = game.world.centerY - (newRad * Math.sin(i));
					var circleRad;
					if(oddEven) {
						circleRad = 5;
					} else {
						circleRad = 4;
					}
					oddEven = !oddEven;
					this.line.drawCircle(newX, newY, circleRad);
				}
			}

		}

		// Set line style
		this.line.beginFill(0x000000, 0);
		this.line.lineStyle(4, 0xffffff, 0.5);

		// Draw circles around planets that are not occupied
		for(var i = 0; i < this.planetList.length; i++) {
			if(this.planetList[i].character == null && !this.planetList[i].pendingArrival) {
				this.line.moveTo(this.planetList[i].x, this.planetList[i].y);
				this.line.drawCircle(this.planetList[i].x, this.planetList[i].y, 100 + (10 * Math.sin(this.planetList[i].currentTime * Math.PI)))
			}
		}
	}

	this.zDifference = (100 - this.life) - this.home.currentTime;

	// If being dragged and waiting for distance/time condition to be met for actual drag,
	if(this.waitingForDrag) {
		this.WaitForDrag();
	}

	if(this.life < 0) { // If dead,
		//Remove charcter
		this.Die();
	}
}

// Function to update the ahead/behind number on character profile
Character.prototype.UpdateAheadBehind = function() {
	var difference = Math.abs((100 - this.life) - this.home.currentTime);

	var aheadBehind = "ahead of";
	if((100 - this.life) - this.home.currentTime < 0) {
		aheadBehind = "behind";
	}
	var displayedDiff = (Math.floor(10 * difference) / 10);
	if(displayedDiff == Math.floor(displayedDiff)) {
		displayedDiff = displayedDiff+".0";
	} else {
		displayedDiff = displayedDiff+"";
	}
	if(Math.floor(difference * 10) != 10){
		this.info.diff.text = "" + displayedDiff + " years " + aheadBehind + " family";
	}
	else{
		this.info.diff.text = "" + displayedDiff + " year " + aheadBehind + " family";
	}
}

// Function to kill the Character
Character.prototype.Die = function() {
	if(this.planet) {
		this.planet.character = null;
	}

	if(this.happiness > 60) {
		this.audio[2].play('', 0, 0.225, false);
	} else {
		this.audio[3].play('', 0, 0.085, false);
	}

	this.waitingForDrag = false;

	this.drawLine = false;
	this.line.clear();
	this.input.disableDrag();

	this.hideProfile();
	this.destroy();
}

// Function to enter a new planet
Character.prototype.EnterPlanet = function(planet) { // Add this to the nearest planet (when drag ends)

	this.planet = planet;
	this.planet.addChild(this);
	this.planet.character = this;
	this.planet.pendingArrival = false;
	this.x = 74;
	this.y = 0;
	if(this.step == 4 && this.planet.name == "purple"){
		this.step = 5;
		this.openOnce = false;
	}
	else if(this.step == 8 && this.planet.name == "blue"){
		this.step = 9;
		this.openOnce = false;
	}
	else if(this.step == 10 && this.planet.name == "green"){
		this.step = 11;
		this.openOnce = false;
	}

}

// Function called in drag state waiting for time/distance condition to be met for drag to register
Character.prototype.WaitForDrag = function() {
	//this.showProfile();
	this.clicked = true;

	if(!this.waitingForDrag) {
		this.dragOffsetX = game.input.x - this.world.x;
		this.dragOffsetY = game.input.y - this.world.y;

		//play the clickCharacter sound
		this.audio[0].play('', 0, 1, false);
	}
	this.waitingForDrag = true;
	this.dragTimer += game.time.elapsed / 1000;
	var difference = Math.pow(Math.pow(game.input.x - (this.input.dragStartPoint.x + this.planet.x), 2) + Math.pow(game.input.y - (this.input.dragStartPoint.y + this.planet.y), 2), 0.5);
	difference -= Math.pow(Math.pow(this.dragOffsetX, 2) + Math.pow(this.dragOffsetY, 2), 0.5);
	if(this.dragTimer > 0.2 || difference > 7) {
		this.waitingForDrag = false;
		this.dragTimer = 0;
		this.BeginDrag();
	}
}

// Function called to put the character in a dragged state
Character.prototype.BeginDrag = function() {
	dragging = true;
	this.clicked = true;

	//Show this characters profile
	//this.showProfile();

	this.x = game.input.x;
	this.y = game.input.y;

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
	game.world.moveDown(this);
}

// Function to stop dragging the character, either returning to existing planet or being sent to a new planet
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
			//console.log(this.name+" gains 10 points of happiness for going home");
			this.happiness += 10;
			if(this.happiness > 100) {
				this.happiness = 100;
			}
		} else {
			//console.log(this.name+" loses 10 points of happiness for travel");
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

// Function to show this character's emote
Character.prototype.showEmote = function(){
	if(this.emote.scale.x <= 0.01){
		game.add.tween(this.emote.scale).to({
			x: 1,
			y: 1
		}, 200, Phaser.Easing.Linear.None, true);
	}
}

// Function to hide this character's emote
Character.prototype.hideEmote = function(){
	if(this.emote.scale.x === 1){
		game.add.tween(this.emote.scale).to({
			x: 0.001,
			y: 0.001
		}, 200, Phaser.Easing.Linear.None, true);
	}
}

// Function to show this character's profile
Character.prototype.showProfile = function(){
	this.popup.alpha = 0.8;
	this.picture.alpha = 1;
	this.old.alpha = this.oldalph;
	this.ageBar.visible = true;
	for(var property in this.info){
		this.info[property].alpha = 1;
	}
}

// Function to hide this character's profile
Character.prototype.hideProfile = function(){
	this.popup.alpha = 0;
	this.picture.alpha = 0;
	this.old.alpha = 0;
	this.ageBar.visible = false;
	for(var property in this.info){
		this.info[property].alpha = 0;
	}
}