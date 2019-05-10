var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	// preload assets
	game.load.atlas("barAtlas", "assets/img/barAtlas.png", "assets/img/barAtlas.json");
}

function create() {
	// place your assets
	new World(game, 400, 400, "barAtlas", "testProgress", 1.5);

	new PlayButton(game, 100, 100, "barAtlas", function() {console.log("button");}, this, "testProgress", "Button");
}

function update() {
	// run game loop
}