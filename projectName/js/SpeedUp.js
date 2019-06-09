function SpeedUp(game, key, frame, text, value, index, sound){
	Phaser.Sprite.call(this, game, 20 * index + 10, 10, key, frame);
	this.value = value;
	this.text = text;
	this.index = index;
	this.recent = 0;

	this.inputEnabled = true;
	this.input.useHandCursor = true;
	this.events.onInputDown.add(this.setSpeed, this);

	//game.add.existing(this);
	game.foreground.add(this);
	this.sound1 = game.add.audio(sound);
	this.sound2 = game.add.audio(sound);
	this.sound3 = game.add.audio(sound);

}

SpeedUp.prototype = Object.create(Phaser.Sprite.prototype);
// Define constructor
SpeedUp.prototype.constructor = SpeedUp;

SpeedUp.prototype.setSpeed = function() {
	this.frame = 'filled';
	this.recent = 1;

	if(game.sound.context.state !== "suspended") {
		if(this.sound1.isPlaying) {
			if(this.sound2.isPlaying) {
				var temp = this.sound2;
				this.sound2 = this.sound3;
				this.sound3 = temp;
				this.sound3.fadeOut(100);
			}
			var temp = this.sound1;
			this.sound1 = this.sound2;
			this.sound2 = temp;
			this.sound2.fadeOut(100);
		}
		this.sound1.play("", 0, 1, false);
	}

}