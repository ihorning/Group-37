var MESSAGE_ATAS = "UIAtlas";
var MESSAGE_FRAMES = ["windowNW", "windowN", "windowNE", "windowW", "windowC", "windowE", "windowSW", "windowS", "windowSE"];

var currentMessage;
	
var MessageQueue = [];

var Messager = {
	FAMILY_HAPPY: [
		"We are so proud of you! Everyone is well!",
		"It's hard without you around, but we know this job is important. You're helping so many people!"
	],

	FAMILY_UNHAPPY: [
		"@, are you okay? I haven't heard from you in a long time. I know this job is really important, but we all miss you. Hopefully we can get to see you soon.",
		"It's good to hear you're getting back on track. Take care of yourself, try to visit home if you can."
	],

	FAMILY_OLDER: [
		"We haven’t heard from you in a long time! Your little brother got married. Sad you missed it :(",
		"Grandpa died. He said he was happy you were doing such important work.",
		"It's weird to think I'm older than you now. I thought I'd always be the youngest sibling.",
		"Please find the time to visit, we miss you. It's been a lot longer for us than it's been for you.",
		"Things have changed a lot around here since you left. Maybe you can find the time to come back and catch up. We love you!"
	],

	FAMILY_YOUNGER: [
		"Hey, who said you could get older than me? You're supposed to be the little sibling, not me.",
		"It's been hard around here since we last saw you. Honestly, it's hard for us to see you this way. I can't stop thinking about all the time together we lost.",
		"Oh my goodness, you look so different! It's still hard for me to wrap my head around this whole thing. Hope we'll get to see you soon.",
		"I can't believe you're # now! We have so many birthday parties to make up for."
	],


	CHARACTER_LAST: [
		"I am the last character."
	],


	PushMessage: function(game, receiver, list, audio) {
		audio.play('', 0, 0.5, false);
		var chosen = Math.round(Math.random() * (list.length - 1));
		var chosenString = list[chosen];
		if(chosenString === undefined) {
			chosenString = "NO MORE MESSAGES";
		}
		chosenString = chosenString.replace(/#/g, Math.floor(20 + (100 - receiver.life)*.6));
		var message = new Message(game, game.world.centerX, game.world.centerY, 500, 400, MESSAGE_ATAS, MESSAGE_FRAMES, "INCOMING TRANSMISSION (to "+receiver.name+"):", chosenString, game.add.audio("open"), game.add.audio("close"));

		if(list != Messager.FAMILY_HAPPY && list != Messager.FAMILY_UNHAPPY && list != Messager.FAMILY_OLDER && list != Messager.FAMILY_YOUNGER) {
			list.splice(chosen, 1);
		} else {
			console.log("Did not remove item");
		}

		message.anchor.set(0.5);
		message.Resize(message.xSize, message.ySize);

		message.kill();
		MessageQueue.push(message);
	}
}

var ShowMessage = function(game) {
	if(currentMessage) {
		currentMessage.Close();
	}

	var message = MessageQueue.shift();
	message.revive();
	message.Open(0.25);
	message.openSound.play("", 0, 1, false);
	currentMessage = message;
}



function MessageButton() {

	Phaser.Button.call(this, game, game.world.width - 10, game.world.height - 10, "mail", null, null, "mailOpen", "mailClosed");
	this.anchor.set(1);
	this.onInputDown.add(function() {
		if(MessageQueue.length > 0 && game.state.getCurrentState().key != 'GameOver') {
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

	this.shake = game.add.tween(this).to({
			x: 1083
		}, 200, Phaser.Easing.Linear.None, true, 1000, -1, true);

	game.foreground.add(this);
}

MessageButton.prototype = Object.create(Phaser.Button.prototype);

MessageButton.prototype.constructor = MessageButton;

MessageButton.prototype.update = function() {
	this.notificationNumber.text = MessageQueue.length;
	if(MessageQueue.length == 0) {
		this.bubble.alpha = 0;
		this.notificationNumber.visible = false;
		this.shake.pause();
	} else {
		this.bubble.alpha = 1;
		this.notificationNumber.visible = true;
		if(this.shake.isPaused){
			this.shake.resume();
		}
	}
}

MessageButton.prototype.closeRemaining = function() {
	if(currentMessage) {
		currentMessage.Close();
	}
}