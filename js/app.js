// Enemies our player must avoid
var Enemy = function(x, y, speed, direction) {
    this.x = x;
    this.y = y;
    // ***********************  This sets the speed randomly using method below
    // this.speed = (Math.floor(Math.random()));

    this.randomSpeed();
    //    this.speed = (Math.floor(Math.random()));
    // *********************** Change direction so bugs start going right
    // this.direction = -1;

    this.direction = 1;
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
Enemy.prototype.movement = function(dt) {
   if (this.direction ===  1 ) {
       this.direction = -1;
   }  else {
     this.direction = 1;
   }
};

     // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x = this.x + (dt * this.speed * this.direction);
    // ***************  OPTION 1: if bug goes off screen to the right, reset the x position
    /* commmented out for now 
    if (this.x > 750) {
        this.x = -100;
        this.randomSpeed();
    }
    */
    // **************   OPTION 2: if bug hits the edge of the canvas, reverse direction
    if (this.x > 750 || this.x < 0) {
        this.movement();
        this.randomSpeed();
    } 
    
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.randomSpeed = function() {
    this.speed = (Math.floor(Math.random() * 200));
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x, y) {
    this.x = 400;
    this.y = 800;
    this.sprite = "images/char-horn-girl.png";
    this.preLocation = {
        x: this.x,
        y: this.y};
};

//Update player class
Player.prototype.update = function() {

};

//Renders the player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//HandleInput of player
//Paramater: player's direction 
Player.prototype.handleInput = function(direction) {
    this.preLocation.x = this.x;
    this.preLocation.y = this.y;

    // *************   Change left boundary to 0 to allow player to hit left of canvas
    if (direction === "left" && this.x > 0) {
        this.x -= 100;
    }   
    if (direction === "up" && this.y > 100) {
        this.y -= 80;
    }
    // *************   Change right boundary to 700 to keep player on screen
    if (direction === "right" && this.x > -100 && this.x < 700) {
        this.x += 100;
    }
    if (direction === "down" && this.y > 0 && this.y < 750) {
        this.y += 80;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var player = new Player();

var allEnemies = [
    new Enemy(50, 540),
    new Enemy(300, 590),
    new Enemy(200, 250),
    new Enemy(300, 400),
];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
