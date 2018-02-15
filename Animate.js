
//START OF ANIMATION CODE SNIPPET
	var animateMap = new Map()
	var currentAnimationKey
	var currentAnimationIndex
	var animationLoop


	
	function addAnimation(key, spriteSheet, texturePosArray, sleepTime){
		if(key==null){return}
		if(spriteSheet==null){return}
		if(sleepTime<=0){return}
		if(texturePosArray==null){return}
		if(animateMap.get(key)!=null){return}
		if(texturePosArray[0].x == null || texturePosArray[0].y == null || texturePosArray[0].w == null || texturePosArray[0].h == null){return}
		animateMap.set(key, {spriteSheet: spriteSheet, texturePosArray: texturePosArray, sleepTime: sleepTime})
	}

	function changeAnimation(key){
		if(key==null){return}
		if(animateMap.get(key)==null){return}
		if(currentAnimationKey==key){return}
		currentAnimationKey = key
		currentAnimationIndex = 0
		clearInterval(animationLoop)
		animationLoop = setInterval(changeAnimationIndex, animateMap.get(currentAnimationKey).sleepTime)	
	}


	function changeAnimationIndex(){
		if(currentAnimationIndex < animateMap.get(currentAnimationKey).texturePosArray.length-1){
			currentAnimationIndex++
		}else{
			currentAnimationIndex = 0
		}
	}


	function drawAnimation(context,x,y,reverse){
		if(context==null){return}
		var animateElement = animateMap.get(currentAnimationKey)
		if(animateElement==null){return}
		context.fillStyle="#FFFFFF";
		context.fillRect(0,0,canvas.width,canvas.height)

		if(reverse){
			context.drawImage(animateElement.spriteSheet,
			animateElement.texturePosArray[currentAnimationIndex].x,
			animateElement.texturePosArray[currentAnimationIndex].y,
			animateElement.texturePosArray[currentAnimationIndex].w,
			animateElement.texturePosArray[currentAnimationIndex].h,
			x,y,animateElement.texturePosArray[currentAnimationIndex].w  ,animateElement.texturePosArray[currentAnimationIndex].h )
		}else{
			context.translate(x+animateElement.texturePosArray[currentAnimationIndex].w,y)
			context.scale(-1,1)
			context.drawImage(animateElement.spriteSheet,
			animateElement.texturePosArray[currentAnimationIndex].x,
			animateElement.texturePosArray[currentAnimationIndex].y,
			animateElement.texturePosArray[currentAnimationIndex].w,
			animateElement.texturePosArray[currentAnimationIndex].h,
			0,0,animateElement.texturePosArray[currentAnimationIndex].w  ,animateElement.texturePosArray[currentAnimationIndex].h )
			context.setTransform(1,0,0,1,0,0);
		}
	}

//END OF ANIMATION CODE SNIPPET


//BEGIN OF TEST CODE

class Cat{
	constructor(x,y,scale){
		//POSITIONS
		this.x = x
		this.y = y
		this.dx = 0
		this.dy = 0
		this.scale = scale
		this.facingRight = true

		this.isJumping = false
		this.jumpIndex = 0
		this.maxJumpIndex = 100
		this.JUMP_SLEEP = 100

		this.spriteSheetRight = document.getElementById("catSpriteSheetRight")
		this.spriteSheetRight.onload = this.setUpAnimations()
	}

	setUpAnimations(){
		const SLEEP_TIMES = {idle: 200, walk: 100, jump: 120, lieDown: 100}
		addAnimation("catIdleRight", this.spriteSheetRight, [  {x:20,y:24,w:19,h:30}, {x:84,y:25,w:19,h:29}, {x:148,y:24,w:19,h:30}, {x:212,y:23,w:19,h:31}], SLEEP_TIMES.idle )
		addAnimation("catWalkRight", this.spriteSheetRight, [  {x:20,y:88,w:19,h:30}, {x:84,y:88,w:19,h:30}, {x:149,y:87,w:18,h:31}, {x:213,y:87,w:18,h:31}, {x:276,y:88,w:19,h:30}, {x:341,y:88,w:18,h:30}], SLEEP_TIMES.walk)
		addAnimation("catJumpRight", this.spriteSheetRight, [   {x:20,y:152,w:19,h:30}, {x:84,y:152,w:17,h:28}, {x:148,y:150,w:18,h:31}, {x:214,y:150,w:16,h:31}, {x:276,y:152,w:17,h:28}, {x:340,y:154,w:18,h:28}, {x:404,y:155,w:16,h:27}, {x:468,y:154,w:18,h:28}], SLEEP_TIMES.jump)
		changeAnimation("catIdleRight")
	}

	move(delta){


		if(!((this.x < 0 && this.dx < 0) || (this.x + animateMap.get(currentAnimationKey).texturePosArray[currentAnimationIndex].w > canvas.width && this.dx > 0 ))){
			this.x += (this.dx * delta)
		}

		
		this.y += (this.dy * delta)


		if(this.y + animateMap.get(currentAnimationKey).texturePosArray[currentAnimationIndex].h < canvas.height){ //gravity
			this.dy += 0.01
		}else{
			this.dy = 0
			if(currentAnimationKey=="catJumpRight"){
				changeAnimation("catIdleRight")
				this.dx = 0
			}
		}
		
	}

	draw(context){
		drawAnimation(context, this.x, this.y, this.facingRight)
	}


}



const canvas = document.getElementById("window")
const context = canvas.getContext("2d")
context.imageSmoothingEnabled = false;


var cat


window.addEventListener("keydown", function (event) {
	
switch(event.key){
	case "a":
	if(currentAnimationKey!="catJumpRight"){
	cat.dx = -.09
	cat.facingRight = false
	changeAnimation("catWalkRight")
	}
	break;
	case "d":
	if(currentAnimationKey!="catJumpRight"){
	cat.dx = .09
	cat.facingRight = true
	changeAnimation("catWalkRight")
	}
	break;
	case "w":
	if(cat.dy == 0){ // meaning no jump
	cat.dy = -.1
	changeAnimation("catJumpRight")
	}
	break
	break
	default:
	break;
}


event.preventDefault();
}, true);

window.addEventListener("keyup", function (event) {
	
switch(event.key){
	case "a":
	if(currentAnimationKey!="catJumpRight"){
	cat.dx = 0
	changeAnimation("catIdleRight")
	}
	break;
	case "d":
	if(currentAnimationKey!="catJumpRight"){
	cat.dx = 0
	changeAnimation("catIdleRight")
	}
	break;
	default:
	break;
}


event.preventDefault();
}, true);



function startTest(){
	cat = new Cat(canvas.width/2,canvas.height/2)
	MainLoop.setUpdate(update).setDraw(draw).start()
	MainLoop.setMaxAllowedFPS(50)
}

function update(delta){
	cat.move(delta)
}

function draw(){
	cat.draw(context)
}

startTest()


function verbose(args){
	console.log(args)
}




