var game={data:{score:0,steps:0,start:!1,newHiScore:!1,muted:!1},onload:function(){return me.video.init("screen",900,600,!0,"auto")?(me.audio.init("mp3,ogg"),me.loader.onload=this.loaded.bind(this),me.loader.preload(game.resources),void me.state.change(me.state.LOADING)):void alert("Your browser does not support HTML5 canvas.")},loaded:function(){me.state.set(me.state.MENU,new game.TitleScreen),me.state.set(me.state.PLAY,new game.PlayScreen),me.state.set(me.state.GAME_OVER,new game.GameOverScreen),me.input.bindKey(me.input.KEY.SPACE,"fly",!0),me.input.bindKey(me.input.KEY.M,"mute",!0),me.input.bindPointer(me.input.KEY.SPACE),me.pool.register("clumsy",BirdEntity),me.pool.register("pipe",PipeEntity,!0),me.pool.register("hit",HitEntity,!0),me.game.viewport.setBounds(0,0,900,600),me.state.change(me.state.MENU)}};game.resources=[{name:"bg",type:"image",src:"data/img/bg.png"},{name:"clumsy",type:"image",src:"data/img/clumsy.png"},{name:"pipe",type:"image",src:"data/img/pipe.png"},{name:"logo",type:"image",src:"data/img/logo.png"},{name:"ground",type:"image",src:"data/img/ground.png"},{name:"gameover",type:"image",src:"data/img/gameover.png"},{name:"gameoverbg",type:"image",src:"data/img/gameoverbg.png"},{name:"hit",type:"image",src:"data/img/hit.png"},{name:"getready",type:"image",src:"data/img/getready.png"},{name:"new",type:"image",src:"data/img/new.png"},{name:"share",type:"image",src:"data/img/share.png"},{name:"tweet",type:"image",src:"data/img/tweet.png"},{name:"theme",type:"audio",src:"data/bgm/"},{name:"hit",type:"audio",src:"data/sfx/"},{name:"lose",type:"audio",src:"data/sfx/"},{name:"wing",type:"audio",src:"data/sfx/"}];var BirdEntity=me.ObjectEntity.extend({init:function(a,b){var c={};c.image=me.loader.getImage("clumsy"),c.width=85,c.height=60,c.spritewidth=85,c.spriteheight=60,this.parent(a,b,c),this.alwaysUpdate=!0,this.gravity=.2,this.gravityForce=.01,this.maxAngleRotation=Number.prototype.degToRad(30),this.maxAngleRotationDown=Number.prototype.degToRad(90),this.renderable.addAnimation("flying",[0,1,2]),this.renderable.addAnimation("idle",[0]),this.renderable.setCurrentAnimation("flying"),this.renderable.anchorPoint=new me.Vector2d(.2,.5),this.animationController=0,this.addShape(new me.Rect(new me.Vector2d(5,5),70,50)),this.flyTween=new me.Tween(this.pos),this.flyTween.easing(me.Tween.Easing.Exponential.InOut),this.endTween=new me.Tween(this.pos),this.flyTween.easing(me.Tween.Easing.Exponential.InOut)},update:function(a){if(!game.data.start)return this.parent(a);if(me.input.isKeyPressed("fly")){me.audio.play("wing"),this.gravityForce=.02;var b=this.pos.y;this.flyTween.stop(),this.flyTween.to({y:b-72},100),this.flyTween.start(),this.renderable.angle=-this.maxAngleRotation}else this.gravityForce+=.2,this.pos.y+=me.timer.tick*this.gravityForce,this.renderable.angle+=Number.prototype.degToRad(3)*me.timer.tick,this.renderable.angle>this.maxAngleRotationDown&&(this.renderable.angle=this.maxAngleRotationDown);var c=me.game.world.collide(this),d=!1;c&&(("pipe"===c.obj.type||"ground"===c.obj.type)&&(me.device.vibrate(500),d=!0),"hit"===c.obj.type&&(me.game.world.removeChildNow(c.obj),game.data.steps++,me.audio.play("hit")));var e=-80;return this.pos.y<=e||d?(game.data.start=!1,me.audio.play("lose"),this.endAnimation(),!1):this.parent(a)},endAnimation:function(){me.game.viewport.fadeOut("#fff",100);var a=this,b=this.pos.y;return this.flyTween.stop(),this.renderable.angle=this.maxAngleRotationDown,this.endTween.to({y:b-72},1500).to({y:me.video.getHeight()-96-a.renderable.width},500).onComplete(function(){me.state.change(me.state.GAME_OVER)}),this.endTween.start(),!1}}),PipeEntity=me.ObjectEntity.extend({init:function(a,b){var c={};c.image=me.loader.getImage("pipe"),c.width=148,c.height=1664,c.spritewidth=148,c.spriteheight=1664,this.parent(a,b,c),this.alwaysUpdate=!0,this.gravity=5,this.updateTime=!1,this.type="pipe"},update:function(a){return game.data.start?(this.pos.add(new me.Vector2d(-this.gravity*me.timer.tick,0)),this.pos.x<-148&&me.game.world.removeChild(this),this.parent(a)):this.parent(a)}}),PipeGenerator=me.Renderable.extend({init:function(){this.parent(new me.Vector2d,me.game.viewport.width,me.game.viewport.height),this.alwaysUpdate=!0,this.generate=0,this.pipeFrequency=92,this.pipeHoleSize=1240,this.posX=me.game.viewport.width},update:function(){if(this.generate++%this.pipeFrequency==0){var a=Number.prototype.random(me.video.getHeight()-100,200),b=a-me.video.getHeight()-this.pipeHoleSize,c=new me.pool.pull("pipe",this.posX,a),d=new me.pool.pull("pipe",this.posX,b),e=a-100,f=new me.pool.pull("hit",this.posX,e);c.renderable.flipY(),me.game.world.addChild(c,10),me.game.world.addChild(d,10),me.game.world.addChild(f,11)}return!0}}),HitEntity=me.ObjectEntity.extend({init:function(a,b){var c={};c.image=me.loader.getImage("hit"),c.width=148,c.height=60,c.spritewidth=148,c.spriteheight=60,this.parent(a,b,c),this.alwaysUpdate=!0,this.gravity=5,this.updateTime=!1,this.type="hit",this.renderable.alpha=0,this.ac=new me.Vector2d(-this.gravity,0)},update:function(){return this.pos.add(this.ac),this.pos.x<-148&&me.game.world.removeChild(this),!0}}),Ground=me.ObjectEntity.extend({init:function(a,b){var c={};c.image=me.loader.getImage("ground"),c.width=900,c.height=96,this.parent(a,b,c),this.alwaysUpdate=!0,this.gravity=0,this.updateTime=!1,this.accel=new me.Vector2d(-4,0),this.type="ground"},update:function(a){return game.data.start?(this.pos.add(this.accel),this.pos.x<-this.renderable.width&&(this.pos.x=me.video.getWidth()-10),this.parent(a)):this.parent(a)}});game.HUD=game.HUD||{},game.HUD.Container=me.ObjectContainer.extend({init:function(){this.parent(),this.isPersistent=!0,this.collidable=!1,this.z=1/0,this.name="HUD",this.addChild(new game.HUD.ScoreItem(5,5))}}),game.HUD.ScoreItem=me.Renderable.extend({init:function(a,b){this.parent(new me.Vector2d(a,b),10,10),this.stepsFont=new me.Font("gamefont",80,"#000","center"),this.floating=!0},update:function(){return!0},draw:function(a){game.data.start&&me.state.isCurrent(me.state.PLAY)&&this.stepsFont.draw(a,game.data.steps,me.video.getWidth()/2,10)}});var BackgroundLayer=me.ImageLayer.extend({init:function(a,b){name=a,width=900,height=600,ratio=1,this.parent(name,width,height,a,b,ratio)},update:function(){return me.input.isKeyPressed("mute")&&(game.data.muted=!game.data.muted,game.data.muted?me.audio.disable():me.audio.enable()),!0}}),Share=me.GUI_Object.extend({init:function(a,b){var c={};c.image="share",c.spritewidth=150,c.spriteheight=75,this.parent(a,b,c)},onClick:function(){var a="Just made "+game.data.steps+" steps on Clumsy Bird! Can you beat me? Try online here!",b="http://ellisonleao.github.io/clumsy-bird/";return FB.ui({method:"feed",name:"My Clumsy Bird Score!",caption:"Share to your friends",description:a,link:b,picture:"http://ellisonleao.github.io/clumsy-bird/data/img/clumsy.png"}),!1}}),Tweet=me.GUI_Object.extend({init:function(a,b){var c={};c.image="tweet",c.spritewidth=152,c.spriteheight=75,this.parent(a,b,c)},onClick:function(){var a="Just made "+game.data.steps+" steps on Clumsy Bird! Can you beat me? Try online here!",b="http://ellisonleao.github.io/clumsy-bird/",c="clumsybird,melonjs";return window.open("https://twitter.com/intent/tweet?text="+a+"&hashtags="+c+"&count="+b+"&url="+b,"Tweet!","height=300,width=400"),!1}});game.TitleScreen=me.ScreenObject.extend({init:function(){this.font=null,this.logo=null},onResetEvent:function(){me.audio.stop("theme"),game.data.newHiScore=!1,me.game.world.addChild(new BackgroundLayer("bg",1)),me.input.bindKey(me.input.KEY.ENTER,"enter",!0),me.input.bindKey(me.input.KEY.SPACE,"enter",!0),me.input.bindPointer(me.input.mouse.LEFT,me.input.KEY.ENTER),this.handler=me.event.subscribe(me.event.KEYDOWN,function(a){"enter"===a&&me.state.change(me.state.PLAY)});var a=me.loader.getImage("logo");this.logo=new me.SpriteObject(me.game.viewport.width/2-170,-a,a),me.game.world.addChild(this.logo,10);new me.Tween(this.logo.pos).to({y:me.game.viewport.height/2-100},1e3).easing(me.Tween.Easing.Exponential.InOut).start();this.ground1=new Ground(0,me.video.getHeight()-96),this.ground2=new Ground(me.video.getWidth(),me.video.getHeight()-96),me.game.world.addChild(this.ground1,11),me.game.world.addChild(this.ground2,11),me.game.world.addChild(new(me.Renderable.extend({init:function(){this.parent(new me.Vector2d,100,100),this.text=me.device.touch?"Tap to start":'PRESS SPACE OR CLICK LEFT MOUSE BUTTON TO START \n											PRESS "M" TO MUTE SOUND',this.font=new me.Font("gamefont",20,"#000")},update:function(){return!0},draw:function(a){var b=this.font.measureText(a,this.text);this.font.draw(a,this.text,me.game.viewport.width/2-b.width/2,me.game.viewport.height/2+50)}})),12)},onDestroyEvent:function(){me.event.unsubscribe(this.handler),me.input.unbindKey(me.input.KEY.ENTER),me.input.unbindKey(me.input.KEY.SPACE),me.input.unbindPointer(me.input.mouse.LEFT),this.ground1=null,this.ground2=null,this.logo=null}}),game.PlayScreen=me.ScreenObject.extend({init:function(){me.audio.play("theme",!0);var a=me.device.ua.contains("Firefox")?.3:.5;me.audio.setVolume(a),this.parent(this)},onResetEvent:function(){me.audio.stop("theme"),game.data.muted||me.audio.play("theme",!0),me.input.bindKey(me.input.KEY.SPACE,"fly",!0),game.data.score=0,game.data.steps=0,game.data.start=!1,game.data.newHiscore=!1,me.game.world.addChild(new BackgroundLayer("bg",1)),this.ground1=new Ground(0,me.video.getHeight()-96),this.ground2=new Ground(me.video.getWidth(),me.video.getHeight()-96),me.game.world.addChild(this.ground1,11),me.game.world.addChild(this.ground2,11),this.HUD=new game.HUD.Container,me.game.world.addChild(this.HUD),this.bird=me.pool.pull("clumsy",60,me.game.viewport.height/2-100),me.game.world.addChild(this.bird,10),me.input.bindPointer(me.input.mouse.LEFT,me.input.KEY.SPACE),this.getReady=new me.SpriteObject(me.video.getWidth()/2-200,me.video.getHeight()/2-100,me.loader.getImage("getready")),me.game.world.addChild(this.getReady,11);new me.Tween(this.getReady).to({alpha:0},2e3).easing(me.Tween.Easing.Linear.None).onComplete(function(){game.data.start=!0,me.game.world.addChild(new PipeGenerator,0)}).start()},onDestroyEvent:function(){me.audio.stopTrack("theme"),this.HUD=null,this.bird=null,this.ground1=null,this.ground2=null,me.input.unbindKey(me.input.KEY.SPACE),me.input.unbindPointer(me.input.mouse.LEFT)}}),game.GameOverScreen=me.ScreenObject.extend({init:function(){this.savedData=null,this.handler=null},onResetEvent:function(){this.savedData={score:game.data.score,steps:game.data.steps},me.save.add(this.savedData),me.save.topSteps||me.save.add({topSteps:game.data.steps}),game.data.steps>me.save.topSteps&&(me.save.topSteps=game.data.steps,game.data.newHiScore=!0),me.input.bindKey(me.input.KEY.ENTER,"enter",!0),me.input.bindKey(me.input.KEY.SPACE,"enter",!1),me.input.bindPointer(me.input.mouse.LEFT,me.input.KEY.ENTER),this.handler=me.event.subscribe(me.event.KEYDOWN,function(a){"enter"===a&&me.state.change(me.state.MENU)});var a=me.loader.getImage("gameover");me.game.world.addChild(new me.SpriteObject(me.video.getWidth()/2-a.width/2,me.video.getHeight()/2-a.height/2-100,a),12);var b=me.loader.getImage("gameoverbg");me.game.world.addChild(new me.SpriteObject(me.video.getWidth()/2-b.width/2,me.video.getHeight()/2-b.height/2,b),10),me.game.world.addChild(new BackgroundLayer("bg",1)),this.ground1=new Ground(0,me.video.getHeight()-96),this.ground2=new Ground(me.video.getWidth(),me.video.getHeight()-96),me.game.world.addChild(this.ground1,11),me.game.world.addChild(this.ground2,11);var c=me.video.getHeight()/2+200;if(this.share=new Share(me.video.getWidth()/2-180,c),me.game.world.addChild(this.share,12),this.tweet=new Tweet(this.share.pos.x+170,c),me.game.world.addChild(this.tweet,12),game.data.newHiScore){var d=new me.SpriteObject(235,355,me.loader.getImage("new"));me.game.world.addChild(d,12)}this.dialog=new(me.Renderable.extend({init:function(){this.parent(new me.Vector2d,100,100),this.font=new me.Font("gamefont",40,"black","left"),this.steps="Steps: "+game.data.steps.toString(),this.topSteps="Higher Step: "+me.save.topSteps.toString()},update:function(a){return this.parent(a)},draw:function(a){{var b=this.font.measureText(a,this.steps);this.font.measureText(a,this.topSteps),this.font.measureText(a,this.score)}this.font.draw(a,this.steps,me.game.viewport.width/2-b.width/2-60,me.game.viewport.height/2),this.font.draw(a,this.topSteps,me.game.viewport.width/2-b.width/2-60,me.game.viewport.height/2+50)}})),me.game.world.addChild(this.dialog,12)},onDestroyEvent:function(){me.event.unsubscribe(this.handler),me.input.unbindKey(me.input.KEY.ENTER),me.input.unbindKey(me.input.KEY.SPACE),me.input.unbindPointer(me.input.mouse.LEFT),me.game.world.removeChild(this.ground1),me.game.world.removeChild(this.ground2),this.font=null,me.audio.stop("theme")}});