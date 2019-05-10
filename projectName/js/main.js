var game = new Phaser.Game(900, 900, Phaser.AUTO);

var MainMenu = function(game) {};
MainMenu.prototype = {
	preload: function() {
		game.load.atlas('spaceatlas', 'assets/img/spaceatlas.png', 'assets/img/spaceatlas.json');
	},

	create: function() {
		game.state.start('Play');
	},

	update: function() {
	}
}

var Play = function(game) {};
Play.prototype = {
	create: function() {
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

		//Set up planets
		this.reallySlow = this.add.sprite(576, 410, 'spaceatlas', 'ReallySlowPlanet');
		this.reallySlow.anchor.setTo(0.5);
		this.slow = this.add.sprite(404, 260, 'spaceatlas', 'SlowPlanet');
		this.slow.anchor.setTo(0.5);
		this.medium = this.add.sprite(597, 671, 'spaceatlas', 'MediumPlanet');
		this.medium.anchor.setTo(0.5);
		this.fast = this.add.sprite(133, 378, 'spaceatlas', 'FastPlanet');
		this.fast.anchor.setTo(0.5);
		this.reallyFast = this.add.sprite(135, 683, 'spaceatlas', 'ReallyFastPlanet');
		this.reallyFast.anchor.setTo(0.5);

		//Set up characters
		//Character(game, planet, key, scale)
		this.slowChar = new Character(game, this.slow, 'spaceatlas', 'SlowChar', 0.2);
		game.add.existing(this.slowChar);
		this.medChar = new Character(game, this.medium, 'spaceatlas', 'MedChar', 0.2);
		game.add.existing(this.medChar);
		this.fastChar = new Character(game, this.fast, 'spaceatlas', 'FastChar', 0.2);
		game.add.existing(this.fastChar);
	},

	update: function() {
	}
}

var GameOver = function(game) {
};
GameOver.prototype = {

	create: function() {
	},

	update: function() {
	}
}

game.state.add('MainMenu', MainMenu);
game.state.add('Play', Play);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');


