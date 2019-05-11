"use strict";

var game = new Phaser.Game(900, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	game.load.atlas('spaceatlas', 'assets/img/spaceatlas.png', 'assets/img/spaceatlas.json');
	game.load.atlas("barAtlas", "assets/img/barAtlas.png", "assets/img/barAtlas.json");
}

function create() {
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
	this.reallySlow = new World(game, 576, 410, 'spaceatlas', 'ReallySlowPlanet', 0.25);
	this.slow = new World(game, 404, 260, 'spaceatlas', 'SlowPlanet', 0.75);
	this.medium = new World(game, 597, 671, 'spaceatlas', 'MediumPlanet', 1);
	this.fast = new World(game, 133, 378, 'spaceatlas', 'FastPlanet', 1.25);
	this.reallyFast = new World(game, 135, 683, 'spaceatlas', 'ReallyFastPlanet', 1.75);


	this.planetList = [this.reallySlow, this.slow, this.medium, this.fast, this.reallyFast];

	this.slowChar = new Character(game, this.slow, this.planetList, "spaceatlas", "SlowChar");
	this.medChar = new Character(game, this.medium, this.planetList, "spaceatlas", "MedChar");
	this.fastChar = new Character(game, this.fast, this.planetList, "spaceatlas", "FastChar");

	//this.testBar = new ProgressBar(game, 500, 500, 300, 16, 300, 12, "barAtlas", "WorkStartCap", "WorkBar", "WorkEndCap", "WorkProgress");
	//this.testBar.sleep = true;

}

function update() {
	// run game loop
}
