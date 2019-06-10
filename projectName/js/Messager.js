var MESSAGE_ATAS = "UIAtlas";
var MESSAGE_FRAMES = ["windowNW", "windowN", "windowNE", "windowW", "windowC", "windowE", "windowSW", "windowS", "windowSE"];

// The current message object on the screen
var currentMessage;

// A queue of messages to be opened
var MessageQueue = [];

// The Messager holds a library of messages and a function to push a message to the queue
var Messager = {
	// Messages for when the worker is happy and with low age offset
	FAMILY_HAPPY: [
		"We are so proud of you! Everyone is well!",
		"It's hard without you around, but we know this job is important. You're helping so many people!",
		"Your last visit was so wonderful! We hope you return again soon!",
		"Wow! We just found out you were given a humanitarian award! Congratulations!",
		"@, everyone back home has been talking about you! They love knowing someone so involved in the mission.",
		"Man, my little cousin saving the planet. I can’t believe it.",
		"I know we fired you from your job here, but we were wondering if you would be interested in rejoining us considering your latest experience?"
	],

	// Messages for when the worker is unhappy and with low age offset
	FAMILY_UNHAPPY: [
		"@, are you okay? I haven't heard from you in a long time. I know this job is really important, but we all miss you. Hopefully we can get to see you soon.",
		"It's good to hear you're getting back on track. Take care of yourself, try to visit home if you can.",
		"Did you get my last message?",
		"You said you were coming home soon, but will this new issue make that not happen?",
		"I heard a rumor that some of the new hardware caught on fire. Is this true?",
		"It’s weird looking up at the stars and know you’re somewhere out there among them."
	],

	// Messages for when the worker is much younger than family
	FAMILY_OLDER: [
		"We haven’t heard from you in a long time! Your little brother got married. Sad you missed it :(",
		"Grandpa died. He said he was happy you were doing such important work.",
		"It's weird to think I'm older than you now. I thought I'd always be the youngest sibling.",
		"Please find the time to visit, we miss you. It's been a lot longer for us than it's been for you.",
		"Things have changed a lot around here since you left. Maybe you can find the time to come back and catch up. We love you!",
		"It’s been hard taking care of things with you gone all the time. When you get back we should talk.",
		"I went to the doctor today and they told me I have cancer. Please come home so I can spend some time with you.",
		"We had to sell the family lake house. It was getting to be too much work. We’re sorry you didn’t get one last summer in it.",
		"Your cat died. I’m sorry, we tried to keep her going the last few years but it was a lost cause.",
		"Mom is so pissed that you’re not calling her. Dad too, but he’s pretending he doesn’t feel emotion."
	],

	// Messages for when the worker is much older than family
	FAMILY_YOUNGER: [
		"Hey, who said you could get older than me? You're supposed to be the little sibling, not me.",
		"It's been hard around here since we last saw you. Honestly, it's hard for us to see you this way. I can't stop thinking about all the time together we lost.",
		"Oh my goodness, you look so different! It's still hard for me to wrap my head around this whole thing. Hope we'll get to see you soon.",
		"I can't believe you're # now! We have so many birthday parties to make up for.",
		"Your mother is making your favorite cake! Wish you were here to celebrate with us!",
		"Are those gray hairs I see in your latest video log? # is not looking so good on you.",
		"Maybe you should come home and let me take care of you. I don’t feel comfortable being the mother of someone older than me.",
		"Sparky, your little pup, has been having so much fun going on walks everyday! I’m sure he’ll jump for joy the next time he sees you...as long as he recognizes you.",
		"In our eyes you’re still only a kid. Not fair that you’re already #."
	],

	// Function to push a new message object to the MessageQueue
	PushMessage: function(game, receiver, list, audio) {
		// Play a sound
		audio.play('', 0, 0.5, false);
		// Choose a random message from the provided list
		var chosen = Math.round(Math.random() * (list.length - 1));
		var chosenString = list[chosen];
		// If the list is somehow empty, put a default error message instead of undefined
		if(chosenString === undefined) {
			chosenString = "NO MORE MESSAGES";
		}
		// Replace all the # with the receiver's current age
		chosenString = chosenString.replace(/#/g, Math.floor(20 + (100 - receiver.life)*.6));
		// Make the message
		var message = new Message(game, game.world.centerX, game.world.centerY, 500, 400, MESSAGE_ATAS, MESSAGE_FRAMES, "INCOMING TRANSMISSION (to "+receiver.name+"):", chosenString, game.add.audio("open"), game.add.audio("close"));

		// If this list is not a constant/part of the Messager library, delete the chosen string from the list
		if(list != Messager.FAMILY_HAPPY && list != Messager.FAMILY_UNHAPPY && list != Messager.FAMILY_OLDER && list != Messager.FAMILY_YOUNGER) {
			list.splice(chosen, 1);
		} else {
			console.log("Did not remove item");
		}

		// Set the anchor of the message
		message.anchor.set(0.5);
		message.Resize(message.xSize, message.ySize);

		// Kill the message until the MessageButton is pressed
		message.kill();
		// Push this new message to the MessageQueue
		MessageQueue.push(message);
	}
}

// Function to show the next message on the screen
var ShowMessage = function(game) {
	// Close the current message, if there is one
	if(currentMessage) {
		currentMessage.Close();
	}

	// Get the next message from the queue
	var message = MessageQueue.shift();
	// Revive the message and open it
	message.revive();
	message.Open(0.25);
	// Play opening sound of the message
	message.openSound.play("", 0, 1, false);
	// This message is now the current message
	currentMessage = message;
}


// Constructor for the MessageButton
function MessageButton() {
	// Call the Phaser.Button constructor
	Phaser.Button.call(this, game, game.world.width - 10, game.world.height - 10, "mail", null, null, "mailOpen", "mailClosed");
	// Set the anchor to the bottom right
	this.anchor.set(1);
	// Show the next message on click if there is a next message
	this.onInputDown.add(function() {
		if(MessageQueue.length > 0 && game.state.getCurrentState().key != 'GameOver') {
			ShowMessage();
		} else {
			console.log("No new messages");
		}
	}, this);

	// Draw a bubble to show number of new messages
	this.bubble = this.addChild(game.make.graphics(0, 0));
	this.bubble.beginFill(0xff0000);
	this.bubble.drawCircle(-60, -53, 25);
	this.bubble.endFill();
	// Add a number to the bubble
	this.notificationNumber = this.addChild(game.make.text(-60, -this.height + 15, "0", {font: "20px Courier", fontWeight: "bold", fill: "#fff"}));
	this.notificationNumber.anchor.set(0.5);
	// Add a tween to animate the button when there are messages to be read.
	this.shake = game.add.tween(this).to({
			x: 1083
		}, 200, Phaser.Easing.Linear.None, true, 1000, -1, true);

	// Add this button to the foreground
	game.foreground.add(this);
}

// Set prototype to a copy of Phaser.Button prototype
MessageButton.prototype = Object.create(Phaser.Button.prototype);
// Define constructor
MessageButton.prototype.constructor = MessageButton;

// Define MessageButton's update function
MessageButton.prototype.update = function() {
	// Set the notification number to the amount of new messages
	this.notificationNumber.text = MessageQueue.length;
	// If no new messages, do not show the bubble and do not play the tween
	if(MessageQueue.length == 0) {
		this.bubble.alpha = 0;
		this.notificationNumber.visible = false;
		this.shake.pause();
	} else { // Else, show the bubble and play the tween
		this.bubble.alpha = 1;
		this.notificationNumber.visible = true;
		if(this.shake.isPaused){
			this.shake.resume();
		}
	}
}

// Function to close the current message, if there is one
MessageButton.prototype.closeRemaining = function() {
	if(currentMessage) {
		currentMessage.Close();
	}
}