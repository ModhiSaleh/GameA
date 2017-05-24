/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */
var Engine = (function(global) {
  /* Predefine the variables we'll be using within this scope,
   * create the canvas element, grab the 2D context for that canvas
   * set the canvas elements height/width and add it to the DOM.
   */
var doc = global.document,
    win = global.window,
    canvas = doc.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    lastTime;

  canvas.width = 810;
  canvas.height = 1010;
  doc.body.appendChild(canvas);


  var IMPASSABLE = 0,
    PASSABLE = 1,
    ITEM = 2,
    //ITEM to get on
    key = {
      sprite: "images/Key.png",
      type: ITEM
    },
    Gem_Blue = {
      sprite: "images/Gem_Blue.png",
      type: ITEM
    },
    //PASSABLE bugs can walk on
    grass = {
      sprite: "images/grass-block.png",
      type: PASSABLE
    },
    stone = {
      sprite: "images/stone-block.png",
      type: PASSABLE
    },
    //IMPASSABLE bugs can't walk on
    water = {
      sprite: "images/water-block.png",
      type: IMPASSABLE
    },
    Rock = {
      sprite: "images/Rock.png",
      type: IMPASSABLE
    },

    numRows,
    numCols,
    col,
    row,
    index,
    obstacle,
    item;


  //Tile variable, usedto aid in laying
  var Tile = function(tileInfo, x, y) {
    this.tileInfo = tileInfo;
    this.x = x;
    this.y = y;
  };
  var baseLayer = [
    [new Tile(water), new Tile(water), new Tile(water), new Tile(water), new Tile(water), new Tile(water), new Tile(water), new Tile(water)],
    [new Tile(stone), new Tile(stone), new Tile(stone), new Tile(stone), new Tile(stone), new Tile(stone), new Tile(stone), new Tile(stone)],
    [new Tile(stone), new Tile(stone), new Tile(stone), new Tile(stone), new Tile(stone), new Tile(stone), new Tile(stone), new Tile(stone)],
    [new Tile(stone), new Tile(stone), new Tile(stone), new Tile(stone), new Tile(stone), new Tile(stone), new Tile(stone), new Tile(stone)],
    [new Tile(grass), new Tile(grass), new Tile(grass), new Tile(grass), new Tile(grass), new Tile(grass), new Tile(grass), new Tile(grass)],
    [new Tile(grass), new Tile(grass), new Tile(grass), new Tile(grass), new Tile(grass), new Tile(grass), new Tile(grass), new Tile(grass)],
    [new Tile(grass), new Tile(grass), new Tile(grass), new Tile(grass), new Tile(grass), new Tile(grass), new Tile(grass), new Tile(grass)],
    [new Tile(grass), new Tile(grass), new Tile(grass), new Tile(grass), new Tile(grass), new Tile(grass), new Tile(grass), new Tile(grass)],
  ];

  var tileXSpan = 101,
      tileYSpan = 80;
  for (row = 0; row < 8; row++) {
    for (col = 0; col < 8; col++) {
      var tile = baseLayer[row][col];
      tile.y = tileYSpan * (row + 1.5);
      tile.x = tileXSpan * col;
    }
  }

  var obstacles = [
    new Tile(Rock, 520, 240),
    new Tile(Rock, 108, 650),
    new Tile(Rock, 501, 566),
  ];

  var items = [
    new Tile(key, 200, 500),
    new Tile(Gem_Blue, 300, 290)
  ];


  /* This function serves as the kickoff point for the game loop itself
   * and handles properly calling the update and render methods.
   */
  function main() {
    /* Get our time delta information which is required if your game
     * requires smooth animation. Because everyone's computer processes
     * instructions at different speeds we need a constant value that
     * would be the same for everyone (regardless of how fast their
     * computer is) - hurray time!
     */
    var now = Date.now(),
      dt = (now - lastTime) / 1000.0;

    /* Call our update/render functions, pass along the time delta to
     * our update function since it may be used for smooth animation.
     */
    update(dt);
    render();

    /* Set our lastTime variable which is used to determine the time delta
     * for the next time this function is called.
     */
    lastTime = now;

    /* Use the browser's requestAnimationFrame function to call this
     * function again as soon as the browser is able to draw another frame.
     */
    win.requestAnimationFrame(main);
  }

  /* This function does some initial setup that should only occur once,
   * particularly setting the lastTime variable that is required for the
   * game loop.
   */
  function init() {
    reset();
    lastTime = Date.now();
    main();
  }

  /* This function is called by main (our game loop) and itself calls all
   * of the functions which may need to update entity's data. Based on how
   * you implement your collision detection (when two entities occupy the
   * same space, for instance when your character should die), you may find
   * the need to add an additional function call here. For now, we've left
   * it commented out - you may or may not want to implement this
   * functionality this way (you could just implement collision detection
   * on the entities themselves within your app.js file).
   */
  function update(dt) {
    updateEntities(dt);
    checkCollisions();
  }



  var Rectangle = function(left, top, width, height) {
    this.left = left;
    this.top = top;
    this.right = this.left + width;
    this.bottom = this.top + height;

    this.width = width;
    this.height = height;
  };


  function checkCollisions() {
    var playerRec = new Rectangle(
      player.x + 28,
      player.y + 124,
      44,
      47);


    allEnemies.forEach(function(bug) {
      var bugRec = new Rectangle(
        bug.x + 28,
        bug.y + 124,
        44,
        47);

      if (recIntersect(bugRec, playerRec)) {
        player.x = 200;
        player.y = 800;
        console.log("player collided with a bug!");
      }

      obstacles.forEach(function(obstacle) {
        var obstacleRec = new Rectangle(
          obstacle.x + 28,
          obstacle.y + 124,
          44,
          47);

        if (recIntersect(obstacleRec, playerRec)) {
          console.log("Player collided with an obstacle!");
        } /*else {
          player.x = player.preLocation.x;
          player.y = player.preLocation.y;
        }*/
      });
    });


    for (index = 0; index < baseLayer[0].length; index++) {
      var waterTile = baseLayer[0][index];
      var waterRec = new Rectangle(
        waterTile.x + 28,
        waterTile.y + 80,
        44,
        47);
      if (recIntersect(playerRec, waterRec)) {
        console.log("player collided with water");
        // ********************************* Change Player to player
        player.x = Player.preLocation.x;
        player.y = Player.preLocation.y;
        break;
      }
    }

    keepItems = [];
    items.forEach(function(item) {
      var itemRec = new Rectangle(
        item.x,
        item.y,
        44,
        47);
      if (recIntersect(itemRec, playerRec)) {
        console.log("player get on an item!");
      } else {
        keepItems.push(item);
      }
    });
    items = keepItems;
    //}
  };

  function recIntersect(rect1, rect2) {
    return !(rect2.left > rect1.right || rect2.right < rect1.left || rect2.top > rect1.bottom || rect2.bottom < rect1.top);
  }
  /* This is called by the update function and loops through all of the
   * objects within your allEnemies array as defined in app.js and calls
   * their update() methods. It will then call the update function for your
   * player object. These update methods should focus purely on updating
   * the data/properties related to the object. Do your drawing in your
   * render methods.
   */
  function updateEntities(dt) {
    allEnemies.forEach(function(enemy) {
      enemy.update(dt);
    });
    player.update();
  }

  /* This function initially draws the "game level", it will then call
   * the renderEntities function. Remember, this function is called every
   * game tick (or loop of the game engine) because that's how games work -
   * they are flipbooks creating the illusion of animation but in reality
   * they are just drawing the entire screen over and over.
   */

  //Renders the level map on the canvas
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    numRows = baseLayer.length;
    for (row = 0; row < numRows; row++) {
      numCols = baseLayer[row].length;
      for (col = 0; col < numCols; col++) {
        var tile = baseLayer[row][col];
        ctx.drawImage(Resources.get(tile.tileInfo.sprite), tile.x, tile.y);
      }
    }

    //Objects in level (1)
    for (index = 0; index < obstacles.length; index++) {
      obstacle = obstacles[index];
      ctx.drawImage(Resources.get(obstacle.tileInfo.sprite), obstacle.x, obstacle.y);
    }

    //Items in level (1)
    for (index = 0; index < items.length; index++) {
      item = items[index];
      console.log(item.tileInfo.sprite)
      ctx.drawImage(Resources.get(item.tileInfo.sprite), item.x, item.y);
    }

    /* This array holds the relative URL to the image used
     * for that particular row of the game level.
     
    var rowImages = [
            'images/water-block.png',   // Top row is water
            'images/stone-block.png',   // Row 1 of 3 of stone
            'images/stone-block.png',   // Row 2 of 3 of stone
            'images/stone-block.png',   // Row 3 of 3 of stone
            'images/grass-block.png',   // Row 1 of 2 of grass
            'images/grass-block.png'    // Row 2 of 2 of grass
        ],
        numRows = 6,
        numCols = 5,
        row, col;
    /* Loop through the number of rows and columns we've defined above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
     
    for (row = 0; row < numRows; row++) {
        for (col = 0; col < numCols; col++) {
            /* The drawImage function of the canvas' context element
             * requires 3 parameters: the image to draw, the x coordinate
             * to start drawing and the y coordinate to start drawing.
             * We're using our Resources helpers to refer to our images
             * so that we get the benefits of caching these images, since
             * we're using them over and over.
             
            ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83); 
        }
    }*/

    renderEntities();
  }

  /* This function is called by the render function and is called on each game
   * tick. Its purpose is to then call the render functions you have defined
   * on your enemy and player entities within app.js
   */
  function renderEntities() {
    /* Loop through all of the objects within the allEnemies array and call
     * the render function you have defined.
     */
    allEnemies.forEach(function(enemy) {
      enemy.render();
    });

    player.render();
  }

  /* This function does nothing but it could have been a good place to
   * handle game reset states - maybe a new game menu or a game over screen
   * those sorts of things. It's only called once by the init() method.
   */
  function reset() {
    // noop
  }

  /* Go ahead and load all of the images we know we're going to need to
   * draw our game level. Then set init as the callback method, so that when
   * all of these images are properly loaded our game will start.
   */
  Resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png',
    'images/enemy-bug.png',
    'images/char-horn-girl.png',
    'images/Rock.png',
    'images/Key.png',
    'images/Gem_Blue.png'
  ]);
  Resources.onReady(init);

  /* Assign the canvas' context object to the global variable (the window
   * object when run in a browser) so that developers can use it more easily
   * from within their app.js files.
   */
  global.ctx = ctx;
})(this);