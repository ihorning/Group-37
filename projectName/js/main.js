//Group 37 Jay Holm, Ian Horning, Gram Nitschke
//https://github.com/ihorning/Group-37
"use strict";

// var game = new Phaser.Game(900, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var game = new Phaser.Game(1100, 900, Phaser.AUTO);
game.universalTime = 0.3;

var won;

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

		new Message(game, 200, 200, 400, 500, "UIAtlas", ["windowNW", "windowN", "windowNE", "windowW", "windowC", "windowE", "windowSW", "windowS", "windowSE"], "SHOWER INVITATION:", "Harry is shower now, would you join? Harry is shower now, would you join? Harry is shower now, would you join? Harry is shower now, would you join? Harry is shower now, would you join?");

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
	//game.state.start('Tutorial');
	console.log('Tutorial');
}
var credits = function(){
	//game.state.start('Credits');
	console.log('Credits');
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
		this.reallySlow = new World(game, 0.33 * 400, 1 * Math.PI, 7, 'planets', 'RSlowP', 0.5);
		this.slow = new World(game, 0.5 * 400, 0.2123523 * Math.PI, 8, 'planets', 'SlowP', 0.75);
		this.medium = new World(game, 0.66 * 400, 1.897 * Math.PI, 6, 'planets', 'MedP', 1);
		this.fast = new World(game, 0.83 * 400, 1.23432 * Math.PI, 7, 'planets', 'FastP', 1.25);
		this.reallyFast = new World(game, 1.0 * 400, 0.646 * Math.PI, 4, 'planets', 'RFastP', 1.75);

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

		won = false;
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
			if(!this.ProgressBarList[i].bar.complete) {
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


		this.timeControlDisplay.text = (Math.round(100 * game.universalTime / 0.3) / 100)+"x speed";

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
var exit = function(){
	game.state.start('GameOver');
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
