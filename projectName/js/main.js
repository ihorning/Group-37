//Group 37 Jay Holm, Ian Horning, Gram Nitschke
//https://github.com/ihorning/Group-37
"use strict";

// var game = new Phaser.Game(900, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var game = new Phaser.Game(1100, 900, Phaser.AUTO);
game.universalTime = 0.3;

game.background = null;
game.foreground = null;

var dragging = false;

var music;
var menusounds;

var preloadedAssets = false;

var MainMenu = function(game) {};
MainMenu.prototype = {
	preload: function() {

		if(!preloadedAssets) {
			// console.log('MainMenu: preload');
			game.load.image('credits', 'assets/img/CreditsAlph.png');

			game.load.atlas('title', 'assets/img/title.png', 'assets/img/title.json');
			game.load.atlas('hole', 'assets/img/blackHole.png', 'assets/img/blackHole.json');
			game.load.atlas('arrows', 'assets/img/arrows.png', 'assets/img/arrows.json');
			game.load.atlas('GObutton', 'assets/img/GObutton.png', 'assets/img/GObutton.json');
			game.load.atlas('exit', 'assets/img/exit.png', 'assets/img/exit.json');
			game.load.atlas('chars', 'assets/img/chars.png', 'assets/img/chars.json');
			game.load.atlas('spaceatlas', 'assets/img/spaceatlas.png', 'assets/img/spaceatlas.json');
			game.load.atlas('planets', 'assets/img/planets.png', 'assets/img/planets.json');
			game.load.atlas("barAtlas", "assets/img/barAtlas.png", "assets/img/barAtlas.json");
			game.load.atlas("rocketAtlas", "assets/img/rocketAtlas.png", "assets/img/rocketAtlas.json");
			game.load.atlas("UIAtlas", "assets/img/UIAtlas.png", "assets/img/UIAtlas.json");
			game.load.atlas("emoteAtlas", "assets/img/emoteAtlas.png", "assets/img/emoteAtlas.json");
			game.load.atlas("mail", "assets/img/mail.png", "assets/img/mail.json");
			game.load.atlas("exitMessage", "assets/img/exitMessage.png", "assets/img/exitMessage.json");
			game.load.atlas("starAtlas", "assets/img/starAtlas.png", "assets/img/starAtlas.json");

			game.load.audio('clickCharacter', 'assets/audio/clickCharacter.mp3');
			game.load.audio('dropCharacter', 'assets/audio/dropCharacter.mp3');
			game.load.audio("characterDiesGood", "assets/audio/characterDies.mp3");
			game.load.audio("characterDiesBad", "assets/audio/blackhole.mp3");
			game.load.audio("message", "assets/audio/message1.mp3");
			game.load.audio("buttonClick", "assets/audio/button.mp3");
			game.load.audio("progressComplete", "assets/audio/betterComplete.mp3");
			game.load.audio("hover", "assets/audio/betterHover.mp3");
			game.load.audio("blackHole", "assets/audio/hole.mp3");
			game.load.audio("speed1", "assets/audio/speed1.mp3");
			game.load.audio("speed2", "assets/audio/speed2.mp3");
			game.load.audio("speed3", "assets/audio/speed3.mp3");
			game.load.audio("speed4", "assets/audio/speed4.mp3");
			game.load.audio("speed5", "assets/audio/speed5.mp3");
			game.load.audio("open", "assets/audio/open.mp3");
			game.load.audio("close", "assets/audio/close.mp3");
			game.load.audio("music", "assets/audio/ambientspacebalanced.mp3");
			game.load.audio("menusounds", "assets/audio/menusounds.mp3");

			// grab keyboard manager
			var cursors = game.input.keyboard.createCursorKeys();

			preloadedAssets = true;
		}
		
	},
	create: function() {
		 game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		// console.log('MainMenu: create');

		this.musicSetUp = false;

		// add title and play, tutorial, credits button
		this.blackHoleBG = this.add.sprite(game.width/2, game.height/2, 'hole', 'blackHole01');
		this.blackHoleBG.anchor.setTo(0.5);
		this.blackHoleBG.animations.add('swirl', Phaser.Animation.generateFrameNames('blackHole', 1, 15, '', 2), 24, true);
		this.blackHoleBG.animations.play('swirl');
		this.title = this.add.image(game.width/2, game.height/2, 'title', 'titleStrip');
		this.title.anchor.setTo(0.5);
		//PlayButton(game, x, y, key, callback, callbackContext, buttonFrame, buttonOver, text)
		this.play = new PlayButton(game, game.width/2, game.height/2 + 20, 'title', start, this, 'buttonUp', 'buttonDown', "PLAY", "#FAFAFA", "#050505", "bold 48px Helvetica");
		this.play.anchor.setTo(0.5);
		this.tutorial = new PlayButton(game, game.width/2, game.height/2 + 140, 'title', tutorial, this, 'buttonUp', 'buttonDown', "TUTORIAL", "#FAFAFA", "#050505", "bold 48px Helvetica");
		this.tutorial.anchor.setTo(0.5);
		this.credits = new PlayButton(game, game.width/2, game.height/2 + 260, 'title', credits, this, 'buttonUp', 'buttonDown', "CREDITS", "#FAFAFA", "#050505", "bold 48px Helvetica");
		this.credits.anchor.setTo(0.5);
	},
	update: function() {
		if(!this.musicSetUp && !(game.sound.context.state === "suspended")) {
			if(music === undefined) {
				music = game.add.audio("music");
				music.play("", 0, 0, true);
			} else if(!music.isPlaying) {
				music.play("", 0, 0, true);
			} else {
				music.fadeTo(1000, 0);
			}
			if(menusounds === undefined) {
				menusounds = game.add.audio("menusounds");
				menusounds.play("", 0, 0, true);
				menusounds.fadeTo(5000, 0.5);
			} else if(!menusounds.isPlaying) {
				menusounds.play("", 0, 0, true);
			} else {
				menusounds.fadeTo(1000, 0.5);
			}
			this.musicSetUp = true;
		}
		if(!(game.sound.context.state === "suspended") && menusounds.volume === 0) {
			menusounds.fadeTo(3000, 0.5);
		}
	}
}
var start = function(){
	game.state.start('Play');
}
var tutorial = function(){
	game.state.start('Tutorial', true, false, 0);
}

var credits = function(){
	game.state.start('Credits');
}

var Credits = function(game) {};
Credits.prototype = {
	create: function() {
		this.credits = this.add.image(0, 0, 'credits', 0);
		this.esc = new PlayButton(game, game.width-20, 20, 'exit', toMenu, this, 'exitOff', 'exitOn', "");
		this.esc.anchor.setTo(1, 0);
	}
}

var Tutorial = function(game) {};
Tutorial.prototype = {
	init: function(step) {
		this.step = step; //pass score through to display
	},
	preload: function() {
	},
	create: function() {
		game.background = game.add.group();
		game.foreground = game.add.group();

		this.stars = game.make.tileSprite(game.world.centerX + 30, game.world.centerY + 100, 1600, 1500, "starAtlas", "stars3", 0);
		this.stars.anchor.set(0.5);
		this.stars.scale.set(1.4);
		this.stars.alpha = 0.7;
		this.stars.angle = Math.random() * 360;

		game.add.existing(this.stars);
		game.world.sendToBack(this.stars);

		if(!music.isPlaying) {
			music.play("", 0, 0, true);
		}

		menusounds.fadeTo(5000, 0);
		music.fadeTo(1000, 0.6);

		game.universalTime = 0.3;
		//Escape button
		//PlayButton(game, x, y, key, callback, callbackContext, buttonFrame, buttonOver, text)
		this.esc = new PlayButton(game, game.width-20, 20, 'exit', exit, this, 'exitOff', 'exitOn', "");
		this.esc.anchor.setTo(1, 0);

		// Add in the planets
		this.reallySlow = new World(game, 0.33 * 400, 1 * Math.PI, 7, 'planets', 'RSlowP', 1.5, "green");
		this.medium = new World(game, 0.66 * 400, 1.897 * Math.PI, 6, 'planets', 'MedP', 2.5, "blue");
		this.reallyFast = new World(game, 1.0 * 400, 0.646 * Math.PI, 4, 'planets', 'RFastP', 4, "purple");

		// Put black hole on the screen
		this.blackHole = game.background.add(game.make.sprite(game.width/2, game.height/2, 'hole', 'blackHole01'));
		this.blackHole.anchor.setTo(0.5);
		this.blackHole.animations.add('swirl', Phaser.Animation.generateFrameNames('blackHole', 1, 15, '', 2), 24, true);
		this.blackHole.animations.play('swirl');
		this.blackHole.scale.setTo(0.09);
		game.background.sendToBack(this.blackHole);

		//add audio to be sent to character prefab
		this.clickCharacter = game.add.audio('clickCharacter');
		this.dropCharacter = game.add.audio('dropCharacter');
		this.characterDiesGood = game.add.audio("characterDiesGood");
		this.characterDiesBad = game.add.audio("characterDiesBad");
		this.message = game.add.audio("message");
		this.buttonClick = game.add.audio("buttonClick");
		this.progressComplete = game.add.audio("progressComplete");
		this.hover = game.add.audio("hover");
		this.audio = [this.clickCharacter, this.dropCharacter, this.characterDiesGood, this.characterDiesBad, this.message];

		this.planetList = [this.reallySlow, this.medium, this.reallyFast];

		//Abigail's Profile Pic
		this.mPic = this.add.sprite(0, game.height, 'chars', 'Abigail');
		this.mPic.anchor.setTo(0,1);
		this.mPic.scale.setTo(0.7);
		this.mPic.alpha = 0;
		game.foreground.add(this.mPic);

		//Pop-up for instructions
		//Popup(game, x, y, xSize, ySize, key, frames)
		this.popup = new Popup(game, -1000, -1000, 40, 2, "UIAtlas", ["windowNW", "windowN", "windowNE", "windowW", "windowC", "windowE", "windowSW", "windowS", "windowSE"]);

		//Instruction text
		this.instruction = game.make.text(10, 15, "", { font: '20px Courier', fill: '#fff'});
		game.foreground.add(this.instruction);

		//Add Abigail
		this.medChar = new Character(game, this.medium, this.planetList, "chars", "smolAbigail", this.audio, "Abigail", this.mPic);

		this.timeControlDisplay = game.make.text(10, 35, '1x speed', { font: '15px Courier', fill: '#fff'});
		game.foreground.add(this.timeControlDisplay);

		this.arrows = [];
		
		//Add arrows for time speed UI
		//SpeedUp(game, key, frame, arrows, value, index)
		for(i = 0; i < 5; i++){
			this.arrows.push(new SpeedUp(game, 'arrows', 'empty', this.timeControlDisplay.text, (i+2)*0.15, i, "speed"+(i+1)));
		}
		this.arrows[0].recent = 1;

		this.medChar.step = this.step;

		this.numPlanets = 0;
		this.pLeft = 0;


		// Add a MessageButton
		this.messageButton = new MessageButton();

		// Clear the MessageQueue
		MessageQueue = [];

		game.world.bringToTop(game.foreground);
	},
	update: function() {
		this.stars.angle += (game.time.elapsed / 1000) * game.universalTime * 2;
		this.stars.tilePosition.x += (game.time.elapsed / 1000) * game.universalTime * 5;
		this.stars.tilePosition.y += (game.time.elapsed / 1000) * game.universalTime * 10;

		//Check which arrow was just clicked and set all the arrows to be filled behind it and update time
		for(var a in this.arrows){
			if(this.arrows[a].recent === 1){
				for(var r in this.arrows){
					if(this.arrows[r].index <= this.arrows[a].index){
						this.arrows[r].frame = 0;
					}
					else{
						this.arrows[r].frame = 1;
					}
				}
				game.universalTime = this.arrows[a].value;
				this.blackHole.animations.currentAnim.speed = this.arrows[a].value * 24/0.3;
				this.arrows[a].recent = 0;
				
			}
		}

		this.timeControlDisplay.text = (Math.round(100 * game.universalTime / 0.3) / 100)+"x speed";
		this.numPlanets = 0;
		this.pLeft = 0;

		// if statement going to end screen: check character's dead and planet progress bars
		var allJobsDone = true;
		for (var i = 0; i < this.planetList.length; i++) {
			if(!this.planetList[i].job.bar.complete) {
				allJobsDone = false;
				this.pLeft += this.planetList[i].job.bar.percent; 
			}
			else{
				this.numPlanets++;
			}
		}
		if(!this.medChar.alive) {
			game.universalTime = 0;
			this.esc.destroy();
			this.messageButton.closeRemaining();
			//(won, numPlanets, pLeft, tutor)
			game.state.start('GameOver', false, false, 0, this.numPlanets, this.pLeft, true);
		}
		if(allJobsDone) { // productivity has been completed
			game.universalTime = 0;
			this.esc.destroy();
			this.medChar.hideProfile();
			this.messageButton.closeRemaining();
			//(won, numPlanets, pLeft, tutor)
			game.state.start('GameOver', false, false, 1, this.numPlanets, 0, true);
		}

		this.instruction.x = this.popup.x - 30;
		this.instruction.y = this.popup.y - 30;
		this.popup.textElements = [this.instruction];
		
		if(this.medChar.step === 6 && game.universalTime > 0.3){
			this.medChar.step = 7;
		}

		switch(this.medChar.step){
			case 0:
			game.universalTime = 0;
				this.popup.x = 200;
				this.popup.y = 300;
				if(!this.medChar.openOnce){
					console.log("opening");
					this.medChar.openOnce = true;
					this.popup.ResetGoal(700, 180);
					this.popup.Open();
				}
				this.instruction.text = "Before you is a set of planets that all run at different time \nspeeds because of their relative distance from the black hole \nthey are orbiting. The mission you have been assigned is to \nmanage workers trying to stop the planets from being consumed \nby the black hole. This is a simplified simulation that will \nprepare you for the real thing.\n\nClick anywhere to begin";
				break;
			case 1:
				game.universalTime = 0.3;
				this.popup.x = 750;
				this.popup.y = 700;
				if(!this.medChar.openOnce){
					this.medChar.openOnce = true;
					this.popup.ResetGoal(150, 25);
					this.popup.Open();
				}
				this.instruction.text = "Click on the \ncharacter icon to \nsee their profile.";
				break;
			case 2:
				this.popup.x = 480;
				this.popup.y = 650;
				if(!this.medChar.openOnce){
					this.medChar.openOnce = true;
					this.popup.ResetGoal(500, 20);
					this.popup.Open();
				}
				this.instruction.text = "Here, you can learn more about your worker.\n\nClick anywhere else to close Abigail's profile.";
				break;
			case 3:
				this.popup.x = 100;
				this.popup.y = 450;
				if(!this.medChar.openOnce){
					this.medChar.openOnce = true;
					this.popup.ResetGoal(370, 140);
					this.popup.Open();
				}
				this.instruction.text = "Planets will slowly move towards \nthe black hole. When stationed at a \nplanet, workers will increase the \npercentage, shown below each planet, \nto slow its movement inward.\n\nClick anywhere to continue.";
				break;
			case 4:
				if(!this.medChar.openOnce){
					this.medChar.openOnce = true;
					this.popup.ResetGoal(400, 80);
					this.popup.Open();
				}
				this.instruction.text = "Once it reaches 100% the planet will \nno longer be pulled by the black hole! \n\nClick and drag Abigail's icon to \nthe purple planet to move her there.";
				break;
			case 5:
				this.popup.x = 540;
				this.popup.y = 100;
				if(!this.medChar.openOnce){
					this.medChar.openOnce = true;
					this.popup.ResetGoal(470, 140);
					this.popup.Open();
				}
				this.instruction.text = "Time moves faster for someone the further \nthey are from a strong gravitational field. \nThis means that workers on planets further \nfrom the black hole age and work faster than \non planets closer to the black hole.\n\nClick anywhere to continue."
				break;
			case 6:
				this.instruction.text = "This difference in time speeds also means \nthat the workers will age at different speeds \nthan their family back on their home planet. \nUse the arrows in the top left corner to \nspeed up the entire game.\n\nClick one of the arrows now.";
				break;
			case 7:
				if(!this.medChar.openOnce){
					this.medChar.openOnce = true;
					this.popup.ResetGoal(400, 20);
					this.popup.Open();
				}
				this.instruction.text = "Open Abigail's profile and watch what \nhappens when she gets 5 or more years \nahead of her family.";
				break;
			case 8:
				this.popup.x = 480;
				this.popup.y = 610;
				if(!this.medChar.openOnce){
					this.medChar.openOnce = true;
					this.popup.ResetGoal(480, 80);
					this.popup.Open();
				}
				this.instruction.text = "Notice that Abigail's efficiency has started \nto drop now that she's sad because she is \n5 years ahead of her family.\n\nDrag her back to her home, the blue planet.";
				break;
			case 9:
				this.popup.x = 100;
				this.popup.y = 200;
				if(!this.medChar.openOnce){
					this.medChar.openOnce = true;
					this.popup.ResetGoal(340, 160);
					this.popup.Open();
				}
				this.instruction.text = "While a worker is on their home \nplanet, instead of efficiency \nstarting to drop at the 5 year \nmark, their efficiency will \ndrop when they are 10 or more \nyears off from their family.\n\nClick anywhere to continue.";
				break;
			case 10:
				if(!this.medChar.openOnce){
					this.medChar.openOnce = true;
					this.popup.ResetGoal(350, 160);
					this.popup.Open();
				}
				this.instruction.text = "To make Abigail closer to her \nfamily's age again, she must go to \na planet closer to the black hole \nthan her home planet. In this \ncase the only planet slower than \nher home is the green planet.\n\nSend her there now.";
				break;
			case 11:
				this.popup.x = 100;
				this.popup.y = 150;
				if(!this.medChar.openOnce){
					this.medChar.openOnce = true;
					this.popup.ResetGoal(800, 75);
					this.popup.Open();
				}
				this.instruction.text = "The percentage below a worker’s icon is how much life they have left, \nmeaning when that reaches 0%, they will die. You lose the game if all of \nyour workers die.\n\nClick anywhere to continue.";
				break;
			case 12:
				if(!this.medChar.openOnce){
					this.medChar.openOnce = true;
					this.popup.ResetGoal(800, 55);
					this.popup.Open();
				}
				this.instruction.text = "To win, complete each planet. Make sure you do this before the planet \ngets consumed by the black hole!\n\nClick anywhere to continue."
				break; 
			case 13:
				this.instruction.text = "Complete all of the planets to finish the simulation and move on to the \nreal mission where you manage 5 planets and 3 workers.\n\nClick anywhere to get rid of this message.";
				break;
			case 14:
				this.instruction.text = "";
				this.popup.destroy();
				break;
		}
	},
	speedUp: function() {
		game.universalTime += 0.25 * 0.3;
		if(game.universalTime > 3.0 * 0.3) {
			game.universalTime = 3.0 * 0.3;
		}
	},
	speedDown: function() {
		game.universalTime -= 0.25 * 0.3;
		if(game.universalTime < 0.25 * 0.3) {
			game.universalTime = 0.25 * 0.3;
		}
	}
}
var exitTutorial = function(){
	game.universalTime = 0;
	//this.esc.destroy();
	this.esc.pendingDestroy = true;
	//(won, numPlanets, pLeft, tutor)
	game.state.start('GameOver', false, false, 2, this.numPlanets, this.pLeft, true);
}

var Play = function(game) {};
Play.prototype = {
	preload: function() {

	},
	create: function() {
		game.background = game.add.group();
		game.foreground = game.add.group();

		this.stars = game.make.tileSprite(game.world.centerX + 30, game.world.centerY + 100, 1600, 1500, "starAtlas", "stars3", 0);
		this.stars.anchor.set(0.5);
		this.stars.scale.set(1.4);
		this.stars.alpha = 0.7;
		this.stars.angle = Math.random() * 360;

		game.add.existing(this.stars);
		game.world.sendToBack(this.stars);

		if(!music.isPlaying) {
			music.play("", 0, 0, true);
		}

		menusounds.fadeTo(1000, 0);
		music.fadeTo(1000, 0.6);

		game.universalTime = 0.3;
		//Escape button
		//PlayButton(game, x, y, key, callback, callbackContext, buttonFrame, buttonOver, text)
		this.esc = new PlayButton(game, game.width-20, 20, 'exit', exit, this, 'exitOff', 'exitOn', "");
		this.esc.anchor.setTo(1, 0);

		// Add in the planets
		this.reallySlow = new World(game, 0.33 * 400, 1 * Math.PI, 7, 'planets', 'RSlowP', 0.5, "green");
		this.slow = new World(game, 0.5 * 400, 0.2123523 * Math.PI, 8, 'planets', 'SlowP', 0.75, "yellow");
		this.medium = new World(game, 0.66 * 400, 1.897 * Math.PI, 6, 'planets', 'MedP', 1, "blue");
		this.fast = new World(game, 0.83 * 400, 1.23432 * Math.PI, 7, 'planets', 'FastP', 1.25, "red");
		this.reallyFast = new World(game, 1.0 * 400, 0.646 * Math.PI, 4, 'planets', 'RFastP', 1.75, "purple");

		// Put black hole on the screen
		this.blackHole = game.background.add(game.make.sprite(game.width/2, game.height/2, 'hole', 'blackHole01'));
		this.blackHole.anchor.setTo(0.5);
		this.blackHole.animations.add('swirl', Phaser.Animation.generateFrameNames('blackHole', 1, 15, '', 2), 24, true);
		this.blackHole.animations.play('swirl');
		this.blackHole.scale.setTo(0.09);
		game.background.sendToBack(this.blackHole);

		//add audio to be sent to character prefab
		this.clickCharacter = game.add.audio('clickCharacter');
		this.dropCharacter = game.add.audio('dropCharacter');
		this.characterDiesGood = game.add.audio("characterDiesGood");
		this.characterDiesBad = game.add.audio("characterDiesBad");
		this.message = game.add.audio("message");
		this.progressComplete = game.add.audio("progressComplete");
		this.audio = [this.clickCharacter, this.dropCharacter, this.characterDiesGood, this.characterDiesBad, this.message];

		
		this.planetList = [this.reallySlow, this.slow, this.medium, this.fast, this.reallyFast];

		//Add profile pics
		this.sPic = this.add.sprite(0, game.height, 'chars', 'Cameron');
		this.sPic.anchor.setTo(0,1);
		this.sPic.scale.setTo(0.7);
		this.sPic.alpha = 0;
		game.foreground.add(this.sPic);

		this.mPic = this.add.sprite(0, game.height, 'chars', 'Abigail');
		this.mPic.anchor.setTo(0,1);
		this.mPic.scale.setTo(0.7);
		this.mPic.alpha = 0;
		game.foreground.add(this.mPic);

		this.fPic = this.add.sprite(0, game.height, 'chars', 'Henry');
		this.fPic.anchor.setTo(0,1);
		this.fPic.scale.setTo(0.7);
		this.fPic.alpha = 0;
		game.foreground.add(this.fPic);

		//Add characters
		//Character(game, planet, planetList, key, frame, audio, name, profile)
		this.slowChar = new Character(game, this.slow, this.planetList, "chars", "smolCameron", this.audio, "Cameron", this.sPic);
		this.medChar = new Character(game, this.medium, this.planetList, "chars", "smolAbigail", this.audio, "Abigail", this.mPic);
		this.fastChar = new Character(game, this.fast, this.planetList, "chars", "smolHenry", this.audio, "Henry", this.fPic);

		this.characterList = [this.slowChar, this.medChar, this.fastChar];
		this.ProgressBarList = [this.reallySlow.job, this.slow.job, this.medium.job, this.fast.job, this.reallyFast.job];

		this.timeControlDisplay = game.make.text(10, 35, '1x speed', { font: '15px Courier', fill: '#fff'});
		game.foreground.add(this.timeControlDisplay);

		this.arrows = [];

		//Add arrows for time speed UI
		//SpeedUp(game, key, frame, arrows, value, index)
		for(i = 0; i < 5; i++){
			this.arrows.push(new SpeedUp(game, 'arrows', 'empty', this.timeControlDisplay.text, (i+2)*0.15, i, "speed"+(i+1)));
		}
		this.arrows[0].recent = 1;

		this.numPlanets = 0;

		this.pLeft = 0;


		// Add a MessageButton
		this.messageButton = new MessageButton();

		// Clear the MessageQueue
		MessageQueue = [];

		game.world.bringToTop(game.foreground);
	},

	update: function() {
		// run game loop

		this.stars.angle += (game.time.elapsed / 1000) * game.universalTime * 2;
		this.stars.tilePosition.x += (game.time.elapsed / 1000) * game.universalTime * 5;
		this.stars.tilePosition.y += (game.time.elapsed / 1000) * game.universalTime * 10;

		//Check which arrow was just clicked and set all the arrows to be filled behind it and update time
		for(var a in this.arrows){
			if(this.arrows[a].recent === 1){
				for(var r in this.arrows){
					if(this.arrows[r].index <= this.arrows[a].index){
						this.arrows[r].frame = 0;
					}
					else{
						this.arrows[r].frame = 1;
					}
				}
				game.universalTime = this.arrows[a].value;
				this.blackHole.animations.currentAnim.speed = this.arrows[a].value * 24/0.3;
				this.arrows[a].recent = 0;
				
			}
		}

		// if statement going to end screen: check character's dead and planet progress bars
		var allCharactersDead = true;
		var allJobsDone = true;
		this.numPlanets = 0;
		this.pLeft = 0;
		for (var i = 0; i < this.characterList.length; i++) {
			if(this.characterList[i].alive) {
				allCharactersDead = false;
				break;
			}
		}
		for (var i = 0; i < this.ProgressBarList.length; i++) {
			if(!this.ProgressBarList[i].bar.complete) {
				allJobsDone = false;
				this.pLeft += this.planetList[i].job.bar.percent; 
			}
			else{
				this.numPlanets++;
			}
		}
		if(allCharactersDead) { // all characters have died
			game.universalTime = 0;
			//this.esc.destroy();
			this.esc.pendingDestroy = true;
			this.messageButton.closeRemaining();
			//(won, numPlanets, pLeft, tutor)
			game.state.start('GameOver', false, false, 0, this.numPlanets, this.pLeft, false);

		}else if(allJobsDone) { // productivity has been completed
			game.universalTime = 0;
			//this.esc.destroy();
			this.esc.pendingDestroy = true;
			this.slowChar.hideProfile();
			this.medChar.hideProfile();
			this.fastChar.hideProfile();
			this.messageButton.closeRemaining();
			//(won, numPlanets, pLeft, tutor)
			game.state.start('GameOver', false, false, 1, this.numPlanets, this.pLeft, false);

		}


		this.timeControlDisplay.text = (Math.round(100 * game.universalTime / 0.3) / 100)+"x speed";

	},
	speedUp: function() {
		game.universalTime += 0.25 * 0.3;
		if(game.universalTime > 3.0 * 0.3) {
			game.universalTime = 3.0 * 0.3;
		}
	},
	speedDown: function() {
		game.universalTime -= 0.25 * 0.3;
		if(game.universalTime < 0.25 * 0.3) {
			game.universalTime = 0.25 * 0.3;
		}
	}
}
var exit = function(){
	game.universalTime = 0;
	//this.esc.destroy();
	this.esc.pendingDestroy = true;
	//(won, numPlanets, pLeft, tutor)
	game.state.start('GameOver', false, false, 2, this.numPlanets, this.pLeft, false);
}

var GameOver = function(game) {};
GameOver.prototype = {
	init: function(won, numPlanets, pLeft, tutor) {
		this.won = won;
		this.numPlanets = numPlanets;
		this.pLeft = pLeft/100;
		this.tutor = tutor;
	},
	preload: function() {
		// console.log('GameOver: preload');
		this.POPULATION = 7469377;
		this.totalPlanets = 5;
	},
	create: function() {
		//set outcome to fail by default
		this.outcome = "FAILURE";
		//the s in case you only save one planet not planets
		this.s = 's';
		//set the partial credit to all planets at 100% by default
		this.partial = "\nAll planets saved.\n"
		//default padding for the amount saved and casualties text
		this.padding = '\n\n';
		
		//Popup(game, x, y, xSize, ySize, key, frames)
		this.popup = new Popup(game, game.width/2, game.height/2, 450, 600, "UIAtlas", ["windowNW", "windowN", "windowNE", "windowW", "windowC", "windowE", "windowSW", "windowS", "windowSE"]);
		this.popup.anchor.setTo(0.5);

		//if from the tutorial, total planets is 3
		if(this.tutor === true){
			this.totalPlanets = 3;
		}

		//won: 1 = all saved, 2 = pressed escape, 0 = failed
		if(this.won === 1){
			this.outcome = "SUCCESS";
		}
		else if(this.won === 2){
			this.outcome = "ABORTED";
		}

		//remove s if only one planet saved
		if(this.numPlanets === 1){
			this.s = '';
		}

		//set saved to max by default
		this.saved = this.totalPlanets * this.POPULATION;

		if(this.numPlanets === 0){ //no planets saved :(
			this.partial = "";
			this.padding = "";
			this.saved = 0;
		}
		else if(this.numPlanets < this.totalPlanets){  //not all but some planets saved
			this.partial = "\nThe destroyed planets were slowed\ndown enough to allow \n" + Math.floor(this.pLeft * 6437289) + " people to escape.\n";
			this.padding = '\n\n\n\n';
			this.saved = Math.floor(this.numPlanets * this.POPULATION + this.pLeft * this.POPULATION);
		}

		this.report = game.make.text(game.width/2 - 250, game.height/6- 40, 'Mission Report: ' + this.outcome, { font: '32px Courier', fill: '#fff'});
		game.foreground.add(this.report);
		this.content = game.make.text(game.width/2 - 250, game.height/5, this.numPlanets + ' planet' + this.s + ' stabilized resulting in\n' + this.numPlanets * this.POPULATION + ' lives saved.\n' + this.partial + '\nTOTAL SAVED: \n\nTOTAL CASUALTIES: ', { font: '24px Courier', fill: '#fff'});
		game.foreground.add(this.content);

		//amount saved
		this.numbersS = game.make.text(game.width/2 + 250, game.height/5, this.padding + '\n\n\n' + this.saved, { font: '24px Courier', fill: '#fff'});
		this.numbersS.anchor.setTo(1, 0);
		game.foreground.add(this.numbersS);
		//amount dead
		this.numbersC = game.make.text(game.width/2 + 250, game.height/5, this.padding + '\n\n\n\n\n' + (this.totalPlanets * this.POPULATION - this.saved), { font: '24px Courier', fill: '#fff'});
		this.numbersC.anchor.setTo(1, 0);
		game.foreground.add(this.numbersC);

		this.buttonClick = game.add.audio("buttonClick");
		this.hover = game.add.audio("hover");
		
		//PlayButton(game, x, y, key, callback, callbackContext, buttonFrame, buttonOver, text)
		if(this.tutor === true){ //if from the tutorial
			//if they beat the tutorial let them continue to game
			if(this.won === 1){
				this.retry = new PlayButton(game, game.width/2, game.height/2 + 150, 'GObutton', start, this, 'GObuttonOff', 'GObuttonOn', "CONTINUE", "#000000", "#FFFFFF", "40px Courier");
			}
			else{ //if they lose the tutorial let them retry the tutorial
				this.retry = new PlayButton(game, game.width/2, game.height/2 + 150, 'GObutton', tutorial, this, 'GObuttonOff', 'GObuttonOn', "TRY AGAIN", "#000000", "#FFFFFF", "40px Courier");
			}
		}
		else{ //not from tutorial, can only try again
			this.retry = new PlayButton(game, game.width/2, game.height/2 + 150, 'GObutton', start, this, 'GObuttonOff', 'GObuttonOn', "TRY AGAIN", "#000000", "#FFFFFF", "40px Courier");
		}
		this.retry.anchor.setTo(0.5);

		//always have a return to menu button
		this.return = new PlayButton(game, game.width/2, game.height/2 + 280, 'GObutton', toMenu, this, 'GObuttonOff', 'GObuttonOn', "MAIN MENU", "#000000", "#FFFFFF", "40px Courier");
		this.return.anchor.setTo(0.5);

		//hide mission report items until popup is full sized
		this.missionReport = [this.report, this.content, this.numbersS, this.numbersC, this.retry, this.return];
		this.popup.textElements = this.missionReport;
		/*for(var property in this.missionReport){
			this.missionReport[property].alpha = 0;
		}*/
		this.popup.Open();
	},
	update: function() {
		/*//cool resize animation to make things snazzy
		if(this.popup.xSize < 450){
			this.popup.Resize(this.popup.xSize + 30, this.popup.ySize);
		}
		if(this.popup.ySize < 600 && this.popup.xSize >= 450){
			this.popup.Resize(this.popup.xSize, this.popup.ySize + 30);
		}*/

		//show mission report items now that popup is full sized
		/*if(this.popup.xSize >=450 && this.popup.ySize >=600){
			for(var property in this.missionReport){
				this.missionReport[property].alpha = 1;
			}
		}*/

	}
}

var toMenu = function(){
	game.state.start('MainMenu');
}

//game.state.add("RocketTest", RocketTest);
//game.state.start("RocketTest");

//add states to StateManager and start MainMenu
game.state.add('MainMenu', MainMenu);
game.state.add('Credits', Credits);
game.state.add('Tutorial', Tutorial);
game.state.add('Play', Play);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');
