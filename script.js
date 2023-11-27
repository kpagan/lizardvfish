class Example extends Phaser.Scene {
  constructor() {
    super("levelGenerator");
  }
  init(data) {
    this.map = data.map;
    if (!this.map) {
      this.map = "Chase2";
    }
  }
  preload() {
    this.load.plugin(
      "rexvirtualjoystickplugin",
      "rexVirtualJoystick.min.js",
      true
    );
    this.load.aseprite(
      "bodySegment",
      "assets/sprites/bodysegment.png",
      "assets/sprites/bodysegment.json"
    );
    this.load.aseprite(
      "axolotlBodySegment",
      "assets/sprites/axolotlbodysegment.png",
      "assets/sprites/axolotlbodysegment.json"
    );
    this.load.tilemapTiledJSON("TitleDrop", "assets/maps/TitleDrop.tmj");
    this.load.tilemapTiledJSON("Tutorial", "assets/maps/Tutorial.tmj");
    this.load.tilemapTiledJSON("Level1", "assets/maps/Level1.tmj");
    this.load.tilemapTiledJSON("Level2", "assets/maps/Level2.tmj");
    this.load.tilemapTiledJSON("Level3", "assets/maps/Level3.tmj");
    this.load.tilemapTiledJSON("Level4", "assets/maps/Level4.tmj");
    this.load.tilemapTiledJSON("Level5", "assets/maps/Level5.tmj");
    this.load.tilemapTiledJSON("Level6", "assets/maps/Level6.tmj");
    this.load.tilemapTiledJSON("Level7", "assets/maps/Level7.tmj");
    this.load.tilemapTiledJSON("Level8", "assets/maps/Level8.tmj");
    this.load.tilemapTiledJSON("Level9", "assets/maps/Level9.tmj");
    this.load.tilemapTiledJSON("Chase", "assets/maps/Chase.tmj");
    this.load.tilemapTiledJSON("Chase2","assets/maps/Chase2.tmj");
    this.load.tilemapTiledJSON(
      "bossEncounter",
      "assets/maps/bossEncounter.tmj"
    );
    this.load.image("AquaTile", "assets/StaticImages/tilesheet.png");
    this.load.aseprite(
      "head",
      "assets/sprites/head.png",
      "assets/sprites/head.json"
    );
    this.load.aseprite(
      "axolotlHead",
      "assets/sprites/axolotlhead.png",
      "assets/sprites/axolotlhead.json"
    );
    this.load.aseprite(
      "legs",
      "assets/sprites/legs.png",
      "assets/sprites/legs.json"
    );
    this.load.aseprite(
      "axolotlLegs",
      "assets/sprites/axolotllegs.png",
      "assets/sprites/axolotllegs.json"
    );
    this.load.aseprite(
      "pirahna",
      "assets/sprites/Pirahna.png",
      "assets/sprites/Pirahna.json"
    );
    this.load.aseprite(
      "spikePirahna",
      "assets/sprites/spikePirahna.png",
      "assets/sprites/spikePirahna.json"
    );
    this.load.aseprite(
      "multiPirahna",
      "assets/sprites/multiPirahna.png",
      "assets/sprites/multiPirahna.json"
    );
    this.load.image("Background", "assets/waterBG.png");
    this.load.image("spike", "assets/sprites/spike.png");
    this.load.aseprite(
      "urchin",
      "assets/sprites/urchin.png",
      "assets/sprites/urchin.json"
    );
    this.load.aseprite(
      "lever",
      "assets/sprites/lever.png",
      "assets/sprites/lever.json"
    );
    this.load.aseprite(
      "door",
      "assets/sprites/door.png",
      "assets/sprites/door.json"
    );
    this.load.image("bubble", "assets/StaticImages/o2bubble.png");
    this.load.aseprite(
      "enemyDoor",
      "assets/sprites/enemydoor.png",
      "assets/sprites/enemydoor.json"
    );
    this.load.aseprite(
      "jellyHead",
      "assets/sprites/jellyhead.png",
      "assets/sprites/jellyhead.json"
    );
    this.load.aseprite(
      "anglerFish",
      "assets/sprites/anglerfish.png",
      "assets/sprites/anglerfish.json"
    );
    this.load.aseprite(
      "anglerLure",
      "assets/sprites/anglerLure.png",
      "assets/sprites/anglerLure.json"
    );
  }

  create() {
    let bg = this.add
      .image(620, 400, "Background")
      .setScrollFactor(0.01, 0.01)
      .setPipeline("Light2D")
      .setScale(1.4);
    //this.lights.enable();
    this.emitter = new Phaser.Events.EventEmitter();
    this.emitter.on("lizardDeath", () => {
      setTimeout(() => {
        this.scene.start("levelGenerator", { map: this.map });
      }, 3000);
    });
    this.joystick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
      x: 140,
      y: config.scale.height - 90,
      radius: 100,
      base: this.add.circle(0, 0, 100, 0x888888, 0.5).setDepth(2),
      thumb: this.add.circle(0, 0, 50, 0xcccccc, 0.5).setDepth(2),
      dir: "8dir", // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
      forceMin: 16,
      enable: true,
    });
    if (this.sys.game.device.os.desktop) {
      this.joystick.setVisible(false);
    } else {
      this.input.addPointer(1);
      this.input.on("pointerdown", (pointer) => {
        if (pointer.downX > window.innerWidth / 2) {
          this.lizardHead.attack();
        }
      });
    }
    this.joystickKeys = this.joystick.createCursorKeys();

    this.raycaster = this.raycasterPlugin.createRaycaster({ debug: false });
    this.heroRaycaster = this.raycasterPlugin.createRaycaster({ debug: false });
    const map = this.make.tilemap({ key: this.map });
    const tileset = map.addTilesetImage("AquaTile");
    const groundLayer = map.createLayer("Ground", tileset, 0, 0);
    groundLayer
      .setCollisionByProperty({ collides: true })
      .setPipeline("Light2D");
    this.lights.setAmbientColor(0x070918);
    this.raycaster.mapGameObjects(groundLayer, false, {
      collisionTiles: [...Array(64).keys()],
    });
    this.matter.world.convertTilemapLayer(groundLayer);

    const lizardCoords = { x: 0, y: 0, xOrient: 1, yOrient: 1 };
    map.objects[0].objects.forEach((object) => {
      //extrapolate the weird array of properties on this object and convert it to more accessible properties on the object itself
      if (object.properties) {
        object.properties.forEach((property) => {
          object[property.name] = property.value;
        });
      }
      console.log(object);
      switch (object.name) {
        case "Lizard":
          (lizardCoords.x = object.x), (lizardCoords.y = object.y);
          break;
        case "Pirahna":
          const pirahna = createPirahna(
            this,
            object.x,
            object.y,
            object.rotation,
            { type: "pirahna", id: object.id }
          );
          if (object.health) {
            pirahna.health = object.health;
          }
          break;
        case "spikePirahna":
          const spikePirahna = createPirahna(
            this,
            object.x,
            object.y,
            object.rotation,
            { type: "spikePirahna", id: object.id }
          );
          if (object.health) {
            spikePirahna.health = object.health;
          }
          break;
        case "multiPirahna":
          const multiBoy = createPirahna(
            this,
            object.x,
            object.y,
            object.rotation,
            { type: "multiPirahna", id: object.id }
          );
          multiBoy.health = object.health;
          break;
        case "Urchin":
          const urchin = this.matter.add.sprite(
            object.x,
            object.y,
            "urchin",
            0,
            {
              isStatic: true,
              shape: "circle",
              circleRadius: 10,
              restitution: "40",
              onCollideCallback: provideDamage,
            }
          );
          urchin.anims.createFromAseprite("urchin");
          urchin.anims.play({ key: "Idle", repeat: -1 });
          //this.lights.addLight(object.x,object.y,128,0xbf0b0b,6);
          break;
        case "Lever":
          createLever(this, object.x, object.y, object.id, object.rotation);
          break;
        case "Door":
          createDoor(this, object.x + 16, object.y + 16, object.Lever);
          break;
        case "Lizard":
          lizardCoords.x = object.x;
          lizardCoords.y = object.y;
          break;
        case "SceneSwitch":
          this.matter.add.rectangle(object.x, object.y, 40, 40, {
            isStatic: true,
            isSensor: true,
            onCollideCallback: (e) => {
              if (isLizardBodyPart(e.bodyA) || isLizardBodyPart(e.bodyB)) {
                console.log(`Switching to scene ${object.Level}`);
                this.scene.start("levelGenerator", { map: object.Level });
              }
            },
          });
          break;
        case "Light":
          this.lights.addLight(
            object.x,
            object.y,
            object.radius,
            0xffffff,
            object.intensity
          );
          break;
        case "Bubble":
          createBubble(this, object.x, object.y);
          break;
        case "EnemyDoor":
          createDoor(this, object.x + 16, object.y + 16, object.enemy, "enemy");
          break;
        case "Text":
          if(object.mobileContent && !this.sys.game.device.os.desktop){
            object.content = object.mobileContent;
          }
          
          this.add.text(object.x, object.y, object.content);
          break;
        case "CollisionSquare":
          console.log("square", object);
          this.matter.add.rectangle(
            object.x + object.width / 2,
            object.y + object.height / 2,
            object.width,
            object.height,
            { isStatic: true }
          );
          break;
        case "Jelly":
          createJelly(this, object.x, object.y, object.ceiling, object.floor);
          break;
        case "bgm":
          if(this.registry.bgm.key != object.key){
            console.log("Background music detected");
            this.sound.stopByKey(this.registry.bgm.key);
            this.bgm = this.sound.add(object.key);
            this.bgm.setLoop(true);
            this.bgm.play();
            this.registry.bgm = this.bgm;
          }
          break;
        case "AnglerFish":
          createAnglerfish(
            this,
            object.x,
            object.y,
            object.lureX,
            object.lureY,
            object.realAxolotl
          );
          break;
        case "escapeAxolotl":
          console.log("henlo")
          createEscapeAxolotl(this,
            object.x,
            object.y,
            object.id)
      }
    });
    //We tried making the lizard a custom class that extended Matter.Sprite, but we got all kinds of errors for some reason so instead we made a function that creates the lizard and returns it (no issue with this)
    this.lizardHead = createLizard(
      this,
      lizardCoords.x,
      lizardCoords.y,
      lizardCoords.xOrient,
      lizardCoords.yOrient,
      false
    );
    createHUD(this, this.lizardHead);
    this.raycaster.mapGameObjects(this.lizardHead.bodyParts.head, true);
    this.lizardLight = this.lights.addLight(0, 0, 500).setIntensity(3);
    this.lizardLight.setColor(0xffffff);
    this.emitter.on("lizardHurt", () => {
      this.lizardLight.setColor(0xbf0b0b).setIntensity(30);
      setTimeout(() => {
        this.lizardLight.setColor(0xfffff).setIntensity(3);
      }, 750);
    });
    console.log(this.lizardLight);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.lizardHead, false, 0.2, 0.2);
    this.cameras.main.setBounds(0, 0, map.width * 32, map.height * 32);
    this.cameras.main.useBounds = true;
    this.lights.enable();
    console.log(this.lights);

    this.input.gamepad.on("down", (pad, button, value) => {
      this.lizardHead.attack();
    });
    console.log(this.graphics);

    //this allows dynamic graphics without the need for each entity to have it's own graphics object
    this.matter.world.on("beforeupdate", () => {
      this.graphics.clear();
    });
    //this.lights.debug();
  }
  update() {
    this.lizardLight.x = this.lizardHead.x;
    this.lizardLight.y = this.lizardHead.y;
    //console.log(this.lizardLight.x, this.lizardLight.y);
    document.getElementById(
      "fpsmeter"
    ).innerHTML = `FPS: ${this.sys.game.loop.actualFps} LizardSticking: ${this.lizardHead.sticking.isSticking} ${this.lizardHead.breakingInformation}`;

    //keyboard controls
    if (this.cursors.space.isDown) {
      this.lizardHead.attack();
    }
    if (this.cursors.left.isDown || this.joystickKeys.left.isDown) {
      this.lizardHead.moveLizard(-1, 0);
    } else if (this.cursors.right.isDown || this.joystickKeys.right.isDown) {
      this.lizardHead.moveLizard(1, 0);
    }
    if (this.cursors.down.isDown || this.joystickKeys.down.isDown) {
      this.lizardHead.moveLizard(0, 1);
    } else if (this.cursors.up.isDown || this.joystickKeys.up.isDown) {
      this.lizardHead.moveLizard(0, -1);
    }
    //gamepad controls
    if (this.input.gamepad.total === 0) {
      return;
    }

    const pad = this.input.gamepad.getPad(0);

    if (pad.axes.length) {
      const axisH = pad.axes[0].getValue();
      const axisV = pad.axes[1].getValue();
      if (axisH || axisV) {
        this.lizardHead.moveLizard(axisH, axisV);
      }
    }
  }
}

const config = {
  type: Phaser.WEBGL,
  width: 960,
  height: 540,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "game",
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    width: 960,
    height: 540,
  },

  backgroundColor: "#090f33",
  parent: "game",
  pixelArt: true,
  maxLights: 10,
  physics: {
    default: "matter",
    matter: {
      gravity: {
        y: 0.5,
      },
      fps: {
        target: 60,
        forceSetTimeout: true,
      },
      debug: false,
    },
  },

  plugins: {
    scene: [
      {
        key: "PhaserRaycaster",
        plugin: PhaserRaycaster,
        mapping: "raycasterPlugin",
      },
    ],
  },
  input: {
    gamepad: true,
  },
  //scene: [Intro, Example],
  scene: [Example]
};

const game = new Phaser.Game(config);
