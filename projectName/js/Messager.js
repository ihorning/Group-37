var MESSAGE_ATAS = "UIAtlas";
var MESSAGE_FRAMES = ["windowNW", "windowN", "windowNE", "windowW", "windowC", "windowE", "windowSW", "windowS", "windowSE"];

var currentMessage;
	
var MessageQueue = [];

var Messager = {
	FAMILY_HAPPY: [
		"We are so proud of you! Everyone is well!"
	],

	FAMILY_UNHAPPY: [
		":("
	],

	FAMILY_OLDER: [
		"We haven’t heard from you in a long time! Your little brother got married. Sad you missed it :(",
		"Grandpa died. He said he was happy you were doing such important work.",
		"It's weird to think I'm older than you now. I thought I'd always be the youngest sibling."
	],

	FAMILY_YOUNGER: [
		"Hey, who said you could get older than me? You're supposed to be the little sibling, not me."
	],


	CHARACTER_LAST: [
		"I am the last character."
	],


	PushMessage: function(game, receiver, list, audio, messageQueue) {
		audio.play('', 0, 0.65, false);
		var chosen = Math.round(Math.random() * (list.length - 1));
		var message = new Message(game, game.world.centerX, game.world.centerY, 500, 400, MESSAGE_ATAS, MESSAGE_FRAMES, "INCOMING TRANSMISSION (to "+receiver+"):", list[chosen]);

		if(list != Messager.FAMILY_HAPPY && list != Messager.FAMILY_UNHAPPY && list != Messager.FAMILY_OLDER && list != Messager.FAMILY_YOUNGER) {
			list.splice(chosen, 1);
		} else {
			console.log("Did not remove item");
		}

		message.anchor.set(0.5);
		message.Resize(message.xSize, message.ySize);

		if(messageQueue) {
			message.kill();
			MessageQueue.push(message);
		}
	}
}

var ShowMessage = function(game) {
	if(currentMessage) {
		currentMessage.Close();
	}

	var message = MessageQueue.shift();
	message.revive();
	message.Open(0.25);
	console.log(message.alive);
	currentMessage = message;
}



function MessageButton() {

	Phaser.Button.call(this, game, game.world.width - 10, game.world.height - 10, "mail", null, null, "mailOpen", "mailClosed");

	this.anchor.set(1);
	this.onInputDown.add(function() {
		if(MessageQueue.length > 0) {
			ShowMessage();
		} else {
			console.log("No new messages");
		}
	}, this);

	this.bubble = this.addChild(game.make.graphics(0, 0));
	this.bubble.beginFill(0xff0000);
	this.bubble.drawCircle(-60, -53, 25);
	this.bubble.endFill();

	this.notificationNumber = this.addChild(game.make.text(-60, -this.height + 15, "0", {font: "20px Courier", fontWeight: "bold", fill: "#fff"}));
	this.notificationNumber.anchor.set(0.5);

	game.foreground.add(this);
}

MessageButton.prototype = Object.create(Phaser.Button.prototype);

MessageButton.prototype.constructor = MessageButton;

MessageButton.prototype.update = function() {
	this.notificationNumber.text = MessageQueue.length;
	if(MessageQueue.length == 0) {
		this.bubble.alpha = 0;
		this.notificationNumber.visible = false;
	} else {
		this.bubble.alpha = 1;
		this.notificationNumber.visible = true;
	}
}