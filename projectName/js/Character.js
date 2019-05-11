function Character(game, planet, planetList, key, frame) {
	Phaser.Sprite.call(this, game, 53, planet.y, atlas, key, 0);
	this.anchor.set(0.5);
	
	this.planet = planet;
	this.planetList = planetList;

	// https://phaser.io/examples/v2/input/drag
	this.inputEnabled = true;
	this.enableDrag = true;
}

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.update = function() {
	if(this.isDragged) {
		this.planet = null;
	} else if(planet == null) {
		var minDistance = Math.Pow(Math.Pow(this.planetList[0].x - this.x, 2) + Math.Pow(this.planetList[0].y - this.y), 0.5);
		var minInd = 0;
		for(var i = 1; i < this.planetList.length; i++) {
			var newDistance = Math.Pow(Math.Pow(this.planetList[i].x - this.x, 2) + Math.Pow(this.planetList[i].y - this.y), 0.5);
			if(newDistance < minDistance) {
				minDistance = newDistance;
				minInd = i;
			}
		}
		this.planet = this.planetList[minInd];
	}
}