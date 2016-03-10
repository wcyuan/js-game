// Based on http://www.w3schools.com/games/
// things that Snap does that are hard with this setup
// 1. broadcasts
// 2. detecting clicks / dragging components
// 3. detecting collisions for other shapes, or arbitrary shapes
(function() {
//}());

    function component(gamearea, width, height, color, x, y, type) {
	this.gamearea = gamearea;
	this.type = type;
	this.width = width;
	this.height = height;
	this.angle = 0;
	this.x = x;
	this.y = y;
	this.speedX = 0;
	this.speedY = 0;
	this.speed = 0;
	this.gravity = 0;
	this.gravitySpeed = 0;
	if (type == "image") {
	    this.image = new Image();
	    this.image.src = color;
	}
	if (type == "text") {
		this.text = "";
	}
	this.newPos = function() {
	    this.gravitySpeed += this.gravity;
	    this.x += this.speedX + this.speed * Math.sin(this.angle);
	    this.y += this.speedY + this.gravitySpeed - this.speed * Math.cos(this.angle);
	    this.hitBottom();
	};
	this.hitBottom = function() {
	    var rockbottom = this.gamearea.canvas.height - this.height;
	    if (this.y > rockbottom) {
		this.y = rockbottom;
		this.gravitySpeed = 0;
	    }
	};
	this.update = function() {
	    this.speedX = 0;
	    this.speedY = 0;
	    this.speed = 0;
	    if (this.gamearea.keys && this.gamearea.keys[37]) { this.rotateccw(); }
	    if (this.gamearea.keys && this.gamearea.keys[39]) { this.rotatecw(); }
	    if (this.gamearea.keys && this.gamearea.keys[38]) { this.moveforward(); }
	    if (this.gamearea.keys && this.gamearea.keys[40]) { this.movebackward(); }
	    this.newPos();
	    var ctx = this.gamearea.context;
	    if (this.type == "text") {
			ctx.font = this.width + " " + this.height;
			ctx.fillStyle = color;
			ctx.fillText(this.text, this.x, this.y);
	    } else {
		    ctx.save();
	        ctx.translate(this.x, this.y); 
	        ctx.rotate(this.angle);
		    if (this.type == "image") {
				ctx.drawImage(this.image,
							  this.width / -2, this.height / -2,
					          this.width, this.height);
		    } else {
				ctx.fillStyle = color;
				ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height); 
		    }
	    }
        ctx.restore(); 
	};
	this.crashWith = function(otherobj) {
	    var myleft = this.x;
	    var myright = this.x + (this.width);
	    var mytop = this.y;
	    var mybottom = this.y + (this.height);
	    var otherleft = otherobj.x;
	    var otherright = otherobj.x + (otherobj.width);
	    var othertop = otherobj.y;
	    var otherbottom = otherobj.y + (otherobj.height);
	    var crash = true;
	    if ((mybottom < othertop) ||
		(mytop > otherbottom) ||
		(myright < otherleft) ||
		(myleft > otherright)) {
		crash = false;
	    }
	    return crash;
	};
	this.moveup = function() {
	    this.speedY -= 1;
	};
	this.movedown = function() {
	    this.speedY += 1;
	};
	this.moveleft = function() {
	    this.speedX -= 1;
	};
	this.moveright = function() {
	    this.speedX += 1;
	};
	this.moveforward = function() {
	    this.speed += 1;
	};
	this.movebackward = function() {
	    this.speed -= 1;
	};
	this.rotatecw = function() {
		this.angle += Math.PI / 180;
	}
	this.rotateccw = function() {
		this.angle -= Math.PI / 180;
	}
	this.stopmove = function() {
	    this.speedX = 0;
	    this.speedY = 0;
	};
    }

    function sound(src) {
		this.sound = document.createElement("audio");
		this.sound.src = src;
		this.sound.setAttribute("preload", "auto");
		this.sound.setAttribute("controls", "none");
		this.sound.style.display = "none";
		document.body.appendChild(this.sound);
		this.play = function(){
		    this.sound.play();
		};
		this.stop = function(){
		    this.sound.pause();
		};
    }

    var myGameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
	    this.canvas.width = 480;
	    this.canvas.height = 360;
	    this.context = this.canvas.getContext("2d");
	    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
	    this.interval = setInterval(updateGame, 20);
	    this.components = [];
	    this.components.push(new component(this, 30, 30, "red", 10, 120));
	    this.components.push(new component(this, 30, 30, "https://raw.githubusercontent.com/wcyuan/snap/master/Costumes/dog2-b.png", 100, 120, "image"));
		this.components.push(new component(this, "30px", "Consolas", "black", 140, 120, "text"));
		this.components[2].text = "Hello";
	    //this.components[0].gravity = 0.06;
	    window.addEventListener('keydown', function (e) {
		    myGameArea.keys = (myGameArea.keys || []);
		    myGameArea.keys[e.keyCode] = true;
		});
	    window.addEventListener('keyup', function (e) {
		    myGameArea.keys[e.keyCode] = false;
		});
		window.addEventListener('mousemove', function (e) {
            myGameArea.mousex = e.pageX;
            myGameArea.mousey = e.pageY;
        });
	},
	clear : function() {
	    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	update : function() {
	    this.clear();
	    for (var ii = 0; ii < this.components.length; ii++) {
		this.components[ii].update();
	    }
	},
	stop : function() {
	    clearInterval(this.interval);
	}
    };

    function updateGame() {
	//myGamePiece.gravity = 0.05;
	//myScore = new component("30px", "Consolas", "black", 280, 40, "text");
	myGameArea.update();
    }

    myGameArea.start();

//(function() {
}());
