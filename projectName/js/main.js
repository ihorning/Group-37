//Group 37 Jay Holm, Ian Horning, Gram Nitschke
//https://github.com/ihorning/Group-37
"use strict";

// var game = new Phaser.Game(900, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var game = new Phaser.Game(900, 900, Phaser.AUTO);
game.universalTime = 0.3;

var won;

var MainMenu = function(game) {};
MainMenu.prototype = {
	preload: function() {
		// console.log('MainMenu: preload');

		game.load.atlas('spaceatlas', 'assets/img/spaceatlas.png', 'assets/img/spaceatlas.json');
		game.load.atlas('medSpin', 'assets/img/medSpin.png', 'assets/img/medSpin.json');
		game.load.atlas("barAtlas", "assets/img/barAtlas.png", "assets/img/barAtlas.json");
		game.load.atlas("rocketAtlas", "assets/img/rocketAtlas.png", "assets/img/rocketAtlas.json");
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
		// Put black hole on the screen
		this.blackHole = this.add.sprite(game.width/2, game.height/2, 'spaceatlas', 'BlackHole');
		this.blackHole.anchor.setTo(0.5);

		// Add in the planets
		this.reallySlow = new World(game, 0.33 * 400, 1 * Math.PI, 4, 'spaceatlas', 'ReallySlowPlanet', 0.5, false);
		this.slow = new World(game, 0.5 * 400, 0.2123523 * Math.PI, 5, 'spaceatlas', 'SlowPlanet', 0.75, false);
		this.medium = new World(game, 0.66 * 400, 1.897 * Math.PI, 3, 'medSpin', 'Med01', 1, true);
		this.fast = new World(game, 0.83 * 400, 1.23432 * Math.PI, 5, 'spaceatlas', 'FastPlanet', 1.25, false);
		this.reallyFast = new World(game, 1.0 * 400, 0.646 * Math.PI, 2, 'spaceatlas', 'ReallyFastPlanet', 1.75, false);

		//add audio to be sent to character prefab
		this.clickCharacter = game.add.audio('clickCharacter');
		this.dropCharacter = game.add.audio('dropCharacter');
		this.audio = [this.clickCharacter, this.dropCharacter];

		
		this.planetList = [this.reallySlow, this.slow, this.medium, this.fast, this.reallyFast];

		this.slowChar = new Character(game, this.slow, this.planetList, "spaceatlas", "SlowChar", this.audio, "slow");
		this.medChar = new Character(game, this.medium, this.planetList, "spaceatlas", "MedChar", this.audio, "med");
		this.fastChar = new Character(game, this.fast, this.planetList, "spaceatlas", "FastChar", this.audio, "fast");

		this.characterList = [this.slowChar, this.medChar, this.fastChar];
		this.ProgressBarList = [this.reallySlow.job, this.slow.job, this.medium.job, this.fast.job, this.reallyFast.job];

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

//game.state.add("RocketTest", RocketTest);
//game.state.start("RocketTest");

//add states to StateManager and start MainMenu
game.state.add('MainMenu', MainMenu);
game.state.add('Play', Play);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');
