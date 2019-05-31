//Group 37 Jay Holm, Ian Horning, Gram Nitschke
//https://github.com/ihorning/Group-37
"use strict";

// var game = new Phaser.Game(900, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var game = new Phaser.Game(1100, 900, Phaser.AUTO);
game.universalTime = 0.3;

var dragging = false;

var MainMenu = function(game) {};
MainMenu.prototype = {
	preload: function() {
		// console.log('MainMenu: preload');
		game.load.atlas('title', 'assets/img/title.png', 'assets/img/title.json');
		game.load.atlas('exit', 'assets/img/exit.png', 'assets/img/exit.json');
		game.load.atlas('chars', 'assets/img/chars.png', 'assets/img/chars.json');
		game.load.atlas('spaceatlas', 'assets/img/spaceatlas.png', 'assets/img/spaceatlas.json');
		game.load.atlas('planets', 'assets/img/planets.png', 'assets/img/planets.json');
		game.load.atlas("barAtlas", "assets/img/barAtlas.png", "assets/img/barAtlas.json");
		game.load.atlas("rocketAtlas", "assets/img/rocketAtlas.png", "assets/img/rocketAtlas.json");
		game.load.atlas("UIAtlas", "assets/img/UIAtlas.png", "assets/img/UIAtlas.json");
		game.load.audio('clickCharacter', 'assets/audio/clickCharacter.mp3');
		game.load.audio('dropCharacter', 'assets/audio/dropCharacter.mp3');

		// grab keyboard manager
		var cursors = game.input.keyboard.createCursorKeys();
		
	},
	create: function() {
		 game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		// console.log('MainMenu: create');
		// add title and play, tutorial, credits button
		this.blackHoleBG = this.add.image(game.width/2, game.height/2, 'title', 'titleBHole');
		this.blackHoleBG.anchor.setTo(0.5);
		this.title = this.add.image(game.width/2, game.height/2, 'title', 'titleStrip');
		this.title.anchor.setTo(0.5);
		//PlayButton(game, x, y, key, callback, callbackContext, buttonFrame, buttonOver, text)
		this.play = new PlayButton(game, game.width/2, game.height/2 + 20, 'title', start, this, 'buttonUp', 'buttonDown', "PLAY");
		this.play.anchor.setTo(0.5);
		this.tutorial = new PlayButton(game, game.width/2, game.height/2 + 140, 'title', tutorial, this, 'buttonUp', 'buttonDown', "TUTORIAL");
		this.tutorial.anchor.setTo(0.5);
		this.credits = new PlayButton(game, game.width/2, game.height/2 + 260, 'title', credits, this, 'buttonUp', 'buttonDown', "CREDITS");
		this.credits.anchor.setTo(0.5);

		// this.instruct1 = game.add.text(game.width/2, game.width/6, 'Click and Drag Characters to the different planets', { fontSize: '16px', fill: '#fff'});
		// this.instruct1.anchor.setTo(0.5);
		// this.instruct2 = game.add.text(game.width/2, game.width/5, 'Keep them from dying and fill the productivity bars', { fontSize: '16px', fill: '#fff'});
		// this.instruct2.anchor.setTo(0.5);

		// this.toplay = game.add.text(game.width/2, game.width/3, 'Press SPACEBAR to Play', { fontSize: '32px', fill: '#fff'});
		// this.toplay.anchor.setTo(0.5);

		this.testLine = game.add.graphics(0, 0);
	},
	update: function() {
		// main menu logic
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('Play');
		}
	}
}
var start = function(){
	game.state.start('Play');
}
var tutorial = function(){
	game.state.start('Tutorial', true, false, 0);
	//console.log('Tutorial');
}
var credits = function(){
	//game.state.start('Credits');
	console.log('Credits');
}

var Tutorial = function(game) {};
Tutorial.prototype = {
	init: function(step) {
		this.step = step; //pass score through to display
	},
	preload: function() {
	},
	create: function() {
		game.universalTime = 0.3;
		//Escape button
		//PlayButton(game, x, y, key, callback, callbackContext, buttonFrame, buttonOver, text)
		this.esc = new PlayButton(game, game.width-10, 10, 'exit', exitTutorial, this, 'exitOff', 'exitOn', "");
		this.esc.anchor.setTo(1, 0);

		// Put black hole on the screen
		this.blackHole = this.add.sprite(game.width/2, game.height/2, 'spaceatlas', 'BlackHole');
		this.blackHole.anchor.setTo(0.5);

		// Add in the planets
		this.reallySlow = new World(game, 0.33 * 400, 1 * Math.PI, 7, 'planets', 'RSlowP', 1.5, "green");
		this.medium = new World(game, 0.66 * 400, 1.897 * Math.PI, 6, 'planets', 'MedP', 2.5, "blue");
		this.reallyFast = new World(game, 1.0 * 400, 0.646 * Math.PI, 4, 'planets', 'RFastP', 4, "purple");

		//add audio to be sent to character prefab
		this.clickCharacter = game.add.audio('clickCharacter');
		this.dropCharacter = game.add.audio('dropCharacter');
		this.audio = [this.clickCharacter, this.dropCharacter];

		this.planetList = [this.reallySlow, this.medium, this.reallyFast];

		//Abigail's Profile Pic
		this.mPic = this.add.sprite(0, game.height, 'chars', 'Abigail');
		this.mPic.anchor.setTo(0,1);
		this.mPic.scale.setTo(0.7);
		this.mPic.alpha = 0;

		//Instruction text
		this.instruction = game.add.text(10, 15, "", { fontSize: '20px', fill: '#fff'});

		//Add Abigail
		this.medChar = new Character(game, this.medium, this.planetList, "chars", "smolAbigail", this.audio, "Abigail", this.mPic);

		this.timeControlDisplay = game.add.text(0, 0, '1x speed', { fontSize: '15px', fill: '#fff'});
		this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.leftKey.onDown.add(this.speedDown, this);
		this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		this.rightKey.onDown.add(this.speedUp, this);

		this.medChar.step = this.step;

		this.numPlanets = 0;
		this.pLeft = 0;
	},
	update: function() {
		this.timeControlDisplay.text = (Math.round(100 * game.universalTime / 0.3) / 100)+"x speed";
		this.numPlanets = 0;
		this.pLeft = 0;

		// if statement going to end screen: check character's dead and planet progress bars
		var allJobsDone = true;
		for (var i = 0; i < this.planetList.length; i++) {
			if(!this.planetList[i].job.bar.complete) {
				allJobsDone = false;
				this.pLeft += this.planetList[i].job.bar.percent; 
			}
			else{
				this.numPlanets++;
			}
		}
		if(!this.medChar.alive) {
			game.universalTime = 0;
			//(won, numPlanets, pLeft, tutor)
			game.state.start('GameOver', false, false, 0, this.numPlanets, this.pLeft, true);
		}
		if(allJobsDone) { // productivity has been completed
			game.universalTime = 0;
			//(won, numPlanets, pLeft, tutor)
			game.state.start('GameOver', false, false, 1, this.numPlanets, 0, true);
		}

		switch(this.medChar.step){
			case 0:
				this.instruction.text = "Click on the character icon to get more information about your worker.";
				break;
			case 1:
				this.instruction.text = "Click anywhere else to get rid of Abigail's profile.";
				break;
			case 2:
				this.instruction.text = "Planets will slowly move towards the black hole. When stationed at a planet, \nworkers will increase the percentage below each planet to slow it's movement inward. \nOnce it reaches 100% the planet will no longer be pulled by the black hole!\nClick and drag Abigail's icon to the purple planet to move her there.";
				break;
			case 3:
				this.instruction.text = "Time moves faster for someone the further they are from a strong gravitational field.\nThis means that workers on planets further from the black hole age and work faster\nthan on planets closer to the black hole. It also means that the workers will age at \ndifferent speeds than their family back on their home planet. \nOpen Abigail's profile and watch what happens when she gets 5 or more years ahead of her family.\n\nUse the right arrow key to spped the game up and\nthe left arrow key to slow it down.";
				break;
			case 4:
				this.instruction.text = "Notice that Abigail's efficiency has started to drop now that she's 5 years ahead of her family.\nDrag her back to her home, the blue planet.";
				break;
			case 5:
				this.instruction.text = "While a worker is on their home planet, their happiness will drop when they are 10 or more years\noff from their family. To make Abigail closer to her family's age again, she must go to a planet closer to the \nblack hole than her home planet. In this case the only planet slower than her home is the green planet.\nSend her there now.";
				break;
			case 6:
				this.instruction.text = "You lose the game if all your worker's die. A worker will die if the percentage \nbelow their icon reaches 0%. This percentage represents the amount of life they have left. \nTo win, complete each planet. Make sure you do this before the planet gets consumed by the black hole! \nComplete all of the planets to finish the tutorial and move on to the real where you manage 5 planets \nand 3 workers.";
				break;
			case 7:
				this.instruction.text = "";
		}
	},
	speedUp: function() {
		game.universalTime += 0.25 * 0.3;
		if(game.universalTime > 3.0 * 0.3) {
			game.universalTime = 3.0 * 0.3;
		}
	},
	speedDown: function() {
		game.universalTime -= 0.25 * 0.3;
		if(game.universalTime < 0.25 * 0.3) {
			game.universalTime = 0.25 * 0.3;
		}
	}
}
var exitTutorial = function(){
	game.universalTime = 0;
	//(won, numPlanets, pLeft, tutor)
	game.state.start('GameOver', false, false, 2, this.numPlanets, this.pLeft, true);
}

var Play = function(game) {};
Play.prototype = {
	preload: function() {

	},
	create: function() {
		game.universalTime = 0.3;
		//Escape button
		//PlayButton(game, x, y, key, callback, callbackContext, buttonFrame, buttonOver, text)
		this.esc = new PlayButton(game, game.width-10, 10, 'exit', exit, this, 'exitOff', 'exitOn', "");
		this.esc.anchor.setTo(1, 0);

		// Put black hole on the screen
		this.blackHole = this.add.sprite(game.width/2, game.height/2, 'spaceatlas', 'BlackHole');
		this.blackHole.anchor.setTo(0.5);

		// Add in the planets
		this.reallySlow = new World(game, 0.33 * 400, 1 * Math.PI, 7, 'planets', 'RSlowP', 0.5, "green");
		this.slow = new World(game, 0.5 * 400, 0.2123523 * Math.PI, 8, 'planets', 'SlowP', 0.75, "yellow");
		this.medium = new World(game, 0.66 * 400, 1.897 * Math.PI, 6, 'planets', 'MedP', 1, "blue");
		this.fast = new World(game, 0.83 * 400, 1.23432 * Math.PI, 7, 'planets', 'FastP', 1.25, "red");
		this.reallyFast = new World(game, 1.0 * 400, 0.646 * Math.PI, 4, 'planets', 'RFastP', 1.75, "purple");

		//add audio to be sent to character prefab
		this.clickCharacter = game.add.audio('clickCharacter');
		this.dropCharacter = game.add.audio('dropCharacter');
		this.audio = [this.clickCharacter, this.dropCharacter];

		
		this.planetList = [this.reallySlow, this.slow, this.medium, this.fast, this.reallyFast];

		//Add profile pics
		this.sPic = this.add.sprite(0, game.height, 'chars', 'Cameron');
		this.sPic.anchor.setTo(0,1);
		this.sPic.scale.setTo(0.7);
		this.sPic.alpha = 0;

		this.mPic = this.add.sprite(0, game.height, 'chars', 'Abigail');
		this.mPic.anchor.setTo(0,1);
		this.mPic.scale.setTo(0.7);
		this.mPic.alpha = 0;

		this.fPic = this.add.sprite(0, game.height, 'chars', 'Henry');
		this.fPic.anchor.setTo(0,1);
		this.fPic.scale.setTo(0.7);
		this.fPic.alpha = 0;

		//Add characters
		//Character(game, planet, planetList, key, frame, audio, name, profile)
		this.slowChar = new Character(game, this.slow, this.planetList, "chars", "smolCameron", this.audio, "Cameron", this.sPic);
		this.medChar = new Character(game, this.medium, this.planetList, "chars", "smolAbigail", this.audio, "Abigail", this.mPic);
		this.fastChar = new Character(game, this.fast, this.planetList, "chars", "smolHenry", this.audio, "Henry", this.fPic);

		this.characterList = [this.slowChar, this.medChar, this.fastChar];
		this.ProgressBarList = [this.reallySlow.job, this.slow.job, this.medium.job, this.fast.job, this.reallyFast.job];

		this.timeControlDisplay = game.add.text(0, 0, '1x speed', { fontSize: '15px', fill: '#fff'});
		this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.leftKey.onDown.add(this.speedDown, this);
		this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		this.rightKey.onDown.add(this.speedUp, this);

		this.numPlanets = 0;

		this.pLeft = 0;
	},

	update: function() {
		// run game loop
		// if statement going to end screen: check character's dead and planet progress bars
		var allCharactersDead = true;
		var allJobsDone = true;
		this.numPlanets = 0;
		this.pLeft = 0;
		for (var i = 0; i < this.characterList.length; i++) {
			if(this.characterList[i].alive) {
				allCharactersDead = false;
				break;
			}
		}
		for (var i = 0; i < this.ProgressBarList.length; i++) {
			if(!this.ProgressBarList[i].bar.complete) {
				allJobsDone = false;
				this.pLeft += this.planetList[i].job.bar.percent; 
			}
			else{
				this.numPlanets++;
			}
		}
		if(allCharactersDead) { // all characters have died
			game.universalTime = 0;
			game.state.start('GameOver', false, false, 0, this.numPlanets, this.pLeft, false);

		}else if(allJobsDone) { // productivity has been completed
			game.universalTime = 0;
			game.state.start('GameOver', false, false, 1, this.numPlanets, this.pLeft, false);

		}

		// if(game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
		// 	game.state.start('GameOver');
		// }


		this.timeControlDisplay.text = (Math.round(100 * game.universalTime / 0.3) / 100)+"x speed";

	},
	speedUp: function() {
		game.universalTime += 5 * 0.3;
		if(game.universalTime > 50.0 * 0.3) {
			game.universalTime = 50.0 * 0.3;
		}
	},
	speedDown: function() {
		game.universalTime -= 5 * 0.3;
		if(game.universalTime < 0.25 * 0.3) {
			game.universalTime = 0.25 * 0.3;
		}
	}
}
var exit = function(){
	game.universalTime = 0;
	game.state.start('GameOver', false, false, 2, this.numPlanets, this.pLeft, false);
}

var GameOver = function(game) {};
GameOver.prototype = {
	init: function(won, numPlanets, pLeft, tutor) {
		this.won = won;
		this.numPlanets = numPlanets;
		this.pLeft = pLeft/100;
		this.tutor = tutor;
	},
	preload: function() {
		// console.log('GameOver: preload');
		this.POPULATION = 6437289;
	},
	create: function() {
		this.outcome = "FAILURE";
		this.s = 's';
		this.partial = "All planets saved."
		this.saved = 5 * this.POPULATION;
		//Popup(game, x, y, xSize, ySize, key, frames)
		this.popup = new Popup(game, game.width/2, game.height/2, 300, 10, "UIAtlas", ["windowNW", "windowN", "windowNE", "windowW", "windowC", "windowE", "windowSW", "windowS", "windowSE"]);
		this.popup.anchor.setTo(0.5);
		if(this.won === 1){
			this.outcome = "SUCCESS";
		}
		else if(this.won === 2){
			this.outcome = "ABORTED";
		}
		if(this.numPlanets === 1){
			this.s = '';
		}

		if(this.numPlanets === 0){
			this.partial = "";
			this.saved = 0;
		}
		else if(this.numPlanets < 5){
			this.partial = "The destroyed planets slowed enough to save\n" + Math.floor(this.pLeft * 6437289) + " lives.";
			this.saved = Math.floor(this.numPlanets * this.POPULATION + this.pLeft * this.POPULATION);
		}
		this.report = game.add.text(game.width/2 - 250, game.height/6- 40, 'Mission Report: ' + this.outcome, { font: '32px Courier', fill: '#fff'});
		this.content = game.add.text(game.width/2 - 250, game.height/5, this.numPlanets + ' planet' + this.s + ' stabilized resulting in\n' + this.numPlanets * this.POPULATION + ' lives saved.\n' + this.partial + '\n\nTotal lives saved: ' + this.saved, { font: '20px Courier', fill: '#fff'});
		// check if player won or lost
		// if(won === true){
		// 	this.yay = game.add.text(game.width/2, game.height/6, 'Congratulations! You completed the mission!', { fontSize: '32px', fill: '#fff'});
		// 	this.yay.anchor.setTo(0.5);
		// }else {
		// 	this.dang = game.add.text(game.width/2, game.height/6, 'Mission Not Completed', { fontSize: '32px', fill: '#fff'});
		// 	this.dang.anchor.setTo(0.5);
		// }

		this.retry = game.add.text(game.width/2, game.width/3, 'Press SPACEBAR to try again', { fontSize: '32px', fill: '#fff'});
		this.retry.anchor.setTo(0.5);
		
	},
	update: function() {
		if(this.popup.xSize < 450){
			this.popup.Resize(this.popup.xSize + 30, this.popup.ySize);
		}
		if(this.popup.ySize < 600 && this.popup.xSize >= 450){
			this.popup.Resize(this.popup.xSize, this.popup.ySize + 30);
		}
		// restart game
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			if(this.tutor === true){
				game.state.start('Tutorial', true, false, 7);
			}
			else{
				game.state.start('Play');
			}
		}

	}
}

//game.state.add("RocketTest", RocketTest);
//game.state.start("RocketTest");

//add states to StateManager and start MainMenu
game.state.add('MainMenu', MainMenu);
game.state.add('Tutorial', Tutorial);
game.state.add('Play', Play);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');
