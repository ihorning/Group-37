//Group 37 Jay Holm, Ian Horning, Gram Nitschke
//https://github.com/ihorning/Group-37
"use strict";

// var game = new Phaser.Game(900, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var game = new Phaser.Game(900, 900, Phaser.AUTO);

var won;

var MainMenu = function(game) {};
MainMenu.prototype = {
	preload: function() {
		// console.log('MainMenu: preload');

		game.load.atlas('spaceatlas', 'assets/img/spaceatlas.png', 'assets/img/spaceatlas.json');
		game.load.atlas("barAtlas", "assets/img/barAtlas.png", "assets/img/barAtlas.json");
		game.load.audio('clickCharacter', 'assets/audio/clickCharacter.mp3');
		game.load.audio('dropCharacter', 'assets/audio/dropCharacter.mp3');

		// grab keyboard manager
		var cursors = game.input.keyboard.createCursorKeys();
		
	},
	create: function() {
		// console.log('MainMenu: create');
		// add play button, for now using SPACEBAR
		// this.playButton = new PlayButton(game, game.width/2, game.height/2, )

		this.instruct1 = game.add.text(game.width/2, game.width/6, 'Click and Drag Characters to the different planets', { fontSize: '16px', fill: '#fff'});
		this.instruct1.anchor.setTo(0.5);
		this.instruct2 = game.add.text(game.width/2, game.width/5, 'Keep them from dying and fill the productivity bars', { fontSize: '16px', fill: '#fff'});
		this.instruct2.anchor.setTo(0.5);

		this.toplay = game.add.text(game.width/2, game.width/3, 'Press SPACEBAR to Play', { fontSize: '32px', fill: '#fff'});
		this.toplay.anchor.setTo(0.5);
		
	},
	update: function() {
		// main menu logic
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('Play');
		}

	}
}

var Play = function(game) {};
Play.prototype = {
	preload: function() {

	},
	create: function() {
		// Put background stuff (black hole, orbit rings) on the screen
		//////////////////////////////////// Copied and pasted directly from Gram's code
		this.blackHole = this.add.sprite(game.width/2, game.height/2, 'spaceatlas', 'BlackHole');
		this.blackHole.anchor.setTo(0.5);

		//Set up all orbits, 1 is smallest, 5 biggest
		this.orbit1 = this.add.sprite(game.width/2, game.height/2, 'spaceatlas', 'Orbit');
		this.orbit1.anchor.setTo(0.5);
		this.orbit1.scale.setTo(0.33);
		this.orbit2 = this.add.sprite(game.width/2, game.height/2, 'spaceatlas', 'Orbit');
		this.orbit2.anchor.setTo(0.5);
		this.orbit2.scale.setTo(0.5);
		this.orbit3 = this.add.sprite(game.width/2, game.height/2, 'spaceatlas', 'Orbit');
		this.orbit3.anchor.setTo(0.5);
		this.orbit3.scale.setTo(0.66);
		this.orbit4 = this.add.sprite(game.width/2, game.height/2, 'spaceatlas', 'Orbit');
		this.orbit4.anchor.setTo(0.5);
		this.orbit4.scale.setTo(0.83);
		this.orbit5 = this.add.sprite(game.width/2, game.height/2, 'spaceatlas', 'Orbit');
		this.orbit5.anchor.setTo(0.5);
		//////////////////////////////////// End of copied and pasted from Gram's code

		// Put the planets on the screen
		// Some parameters directly copied here
		this.reallySlow = new World(game, 576, 410, 'spaceatlas', 'ReallySlowPlanet', 0.5);
		this.slow = new World(game, 404, 260, 'spaceatlas', 'SlowPlanet', 0.75);
		this.medium = new World(game, 597, 671, 'spaceatlas', 'MediumPlanet', 1);
		this.fast = new World(game, 133, 378, 'spaceatlas', 'FastPlanet', 1.25);
		this.reallyFast = new World(game, 135, 683, 'spaceatlas', 'ReallyFastPlanet', 1.75);

		//add audio to be sent to character prefab
		this.clickCharacter = game.add.audio('clickCharacter');
		this.dropCharacter = game.add.audio('dropCharacter');
		this.audio = [this.clickCharacter, this.dropCharacter];


		this.planetList = [this.reallySlow, this.slow, this.medium, this.fast, this.reallyFast];

		this.slowChar = new Character(game, this.slow, this.planetList, "spaceatlas", "SlowChar", this.audio);
		this.medChar = new Character(game, this.medium, this.planetList, "spaceatlas", "MedChar", this.audio);
		this.fastChar = new Character(game, this.fast, this.planetList, "spaceatlas", "FastChar", this.audio);

		this.characterList = [this.slowChar, this.medChar, this.fastChar];
		this.ProgressBarList = [this.reallySlow.job, this.slow.job, this.medium.job, this.fast.job, this.reallyFast.job];

		//this.testBar = new ProgressBar(game, 500, 500, 300, 16, 300, 12, "barAtlas", "WorkStartCap", "WorkBar", "WorkEndCap", "WorkProgress");
		//this.testBar.sleep = true;
	},

	update: function() {
		// run game loop
		// if statement going to end screen: check character's dead and planet progress bars
		var allCharactersDead = true;
		var allJobsDone = true;
		for (var i = 0; i < this.characterList.length; i++) {
			if(this.characterList[i].alive) {
				allCharactersDead = false;
				break;
			}
		}
		for (var i = 0; i < this.ProgressBarList.length; i++) {
			if(!this.ProgressBarList[i].complete) {
				allJobsDone = false;
				break;
			}
		}
		if(allCharactersDead) { // all characters have died

			won = false;
			game.state.start('GameOver');

		}else if(allJobsDone) { // productivity has been completed

			won = true;
			game.state.start('GameOver');

		}

		if(game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
			game.state.start('GameOver');
		}

	}
}

var GameOver = function(game) {};
GameOver.prototype = {
	preload: function() {
		// console.log('GameOver: preload');

	},
	create: function() {
		// check if player won or lost
		if(won === true){
			this.yay = game.add.text(game.width/2, game.width/5, 'Congratulations! You completed the mission!', { fontSize: '32px', fill: '#fff'});
			this.yay.anchor.setTo(0.5);
		}else {
			this.dang = game.add.text(game.width/2, game.width/5, 'Mission Not Completed', { fontSize: '32px', fill: '#fff'});
			this.dang.anchor.setTo(0.5);
		}

		this.retry = game.add.text(game.width/2, game.width/3, 'Press SPACEBAR to try again', { fontSize: '32px', fill: '#fff'});
		this.retry.anchor.setTo(0.5);
		
	},
	update: function() {
		// restart game
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('Play');
		}

	}
}

game.state.add("RocketTest", RocketTest);
game.state.start("RocketTest");

//add states to StateManager and start MainMenu
game.state.add('MainMenu', MainMenu);
game.state.add('Play', Play);
game.state.add('GameOver', GameOver);
//game.state.start('MainMenu');
