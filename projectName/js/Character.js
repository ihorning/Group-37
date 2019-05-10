function Character(game, planet, atlas, key, scale) {
	//call to Phaser.Sprite // new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, planet.x + 53, planet.y, atlas, key, 0);
	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
}

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.update = function() {
}

Character.prototype.moveChar = function(planet) {
	this.x = planet.x + 53;
	this.y = planet.y;
}