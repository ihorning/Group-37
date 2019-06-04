function SpeedUp(game, key, frame, text, value, index){
	Phaser.Sprite.call(this, game, 20 * index + 10, 10, key, frame);
	this.value = value;
	this.text = text;
	this.index = index;
	this.recent = 0;

	this.inputEnabled = true;
	this.input.useHandCursor = true;
	this.events.onInputUp.add(this.setSpeed, this);

	//game.add.existing(this);
	game.foreground.add(this);
}

SpeedUp.prototype = Object.create(Phaser.Sprite.prototype);
// Define constructor
SpeedUp.prototype.constructor = SpeedUp;

SpeedUp.prototype.setSpeed = function() {
	this.frame = 'filled';
	this.recent = 1;
}
// SpeedUp.prototype.getRecent = function() {
// 	return this.recent;
// }
// SpeedUp.prototype.getIndex = function() {
// 	return this.index;
// }
// SpeedUp.prototype.setRecent = function(r) {
// 	this.recent = r;
// }
// SpeedUp.prototype.setFrame = function(f) {
// 	this.frame = f;
// }