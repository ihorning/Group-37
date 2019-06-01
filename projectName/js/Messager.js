var MESSAGE_ATAS = "UIAtlas";
var MESSAGE_FRAMES = ["windowNW", "windowN", "windowNE", "windowW", "windowC", "windowE", "windowSW", "windowS", "windowSE"];
	
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
		"Grandpa died. He said he was happy you were doing such important work."
	],

	FAMILY_YOUNGER: [
		"Harry is shower now, would you join?"
	],


	CHARACTER_LAST: [
		"I am the last character."
	],


	PushMessage: function(game, receiver, list, messageQueue) {
		var chosen = Math.round(Math.random() * (list.length - 1));
		var message = new Message(game, game.world.centerX, game.world.centerY, 500, 700, MESSAGE_ATAS, MESSAGE_FRAMES, "INCOMING TRANSMISSION (to "+receiver+"):", list[chosen]);

		if(list != Messager.FAMILY_HAPPY && list != Messager.FAMILY_UNHAPPY && list != Messager.FAMILY_OLDER && list != Messager.FAMILY_YOUNGER) {
			list.splice(chosen, 1);
		} else {
			console.log("Did not remove item");
		}

		message.anchor.set(0.5);
		message.Resize(message.xSize, message.ySize);

		if(messageQueue) {
			game.world.remove(message);
			MessageQueue.push(message);
		}
	}
}

var ShowMessage = function(game) {
	game.add.existing(MessageQueue.shift());
}



function MessageButton() {

	Phaser.Button.call(this, game, game.world.width - 10, game.world.height - 10, "mail", null, null, "mailOpen", "mailClosed");

	this.anchor.set(1);
	this.onInputDown.add(function() {
		if(MessageQueue.length > 0) {
			game.add.existing(MessageQueue.shift());
		} else {
			console.log("No new messages");
		}
	}, this);

	this.notificationNumber = this.addChild(game.make.text(0, -this.height, "0", {font: "20px Courier", fontWeight: "bold", fill: "#fff"}));
	this.notificationNumber.anchor.set(0.5);

	game.add.existing(this);
}

MessageButton.prototype = Object.create(Phaser.Button.prototype);

MessageButton.prototype.constructor = MessageButton;

MessageButton.prototype.update = function() {
	this.notificationNumber.text = MessageQueue.length;
	if(MessageQueue.length == 0) {
		this.notificationNumber.visible = false;
	} else {
		this.notificationNumber.visible = true;
	}
}