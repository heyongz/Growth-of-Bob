/*
 * File: GameEndThis is the logic of our game.
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  Renderable, TextureRenderable, FontRenderable, SpriteRenderable, LightRenderable, IllumRenderable,
  GameObject, TiledGameObject, ParallaxGameObject, Hero, Minion, Dye, Light */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Level0() {
    // The camera to view the scene
    this.mCamera = null;
    this.mMsg = null;
    this.mRestart = false;
    this.kBackground = "assets/pictures/begin.png";

    this.kBgClip = "assets/sounds/BGClip.mp3";
    this.kCue = "assets/sounds/cue.wav";
    this.kEat = "assets/sounds/eat.wav";
}
gEngine.Core.inheritPrototype(Level0, Scene);

Level0.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kBackground);

    gEngine.AudioClips.loadAudio(this.kBgClip);
    gEngine.AudioClips.loadAudio(this.kEat);
    gEngine.AudioClips.loadAudio(this.kCue);
};

Level0.prototype.unloadScene = function () {
    gEngine.LayerManager.cleanUp();

    gEngine.Textures.unloadTexture(this.kBackground);

    gEngine.AudioClips.unloadAudio(this.kBgClip);
    gEngine.AudioClips.unloadAudio(this.kEat);
    gEngine.AudioClips.unloadAudio(this.kCue);

    if (this.mRestart === true)
    {
        var nextLevel = new Level1();  // next level to be loaded
        gEngine.Core.startScene(nextLevel);
    }
};


Level0.prototype.initialize = function () {
    this.width = 800;
    this.height = 600;

    this.mCamera = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        1024,                     // width of camera
        [0, 0, this.width, this.height]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([1, 1, 1, 1]);
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    this.mBackground = new Fail(this.kBackground);

    this.mTextConS = new FontRenderable("START");
    this._initText(this.mTextConS, 0, -150, [0.5, 0.5, 0.5, 0.5], 50);

    this.mTextConH = new FontRenderable("HELP");
    this._initText(this.mTextConH, 0, -220, [0.5, 0.5, 0.5, 1], 50);

    this.mTextConC = new FontRenderable("Choose > ");
    this._initText(this.mTextConC, -250, -150, [0.5, 0.5, 0.5, 0.5], 50);

};

Level0.prototype._initText = function (font, posX, posY, color, textH) {
    font.setColor(color);
    font.getXform().setPosition(posX, posY);
    font.setTextHeight(textH);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Level0.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([1, 1, 1, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.mBackground.draw(this.mCamera);
    this.mTextConS.draw(this.mCamera);
    this.mTextConH.draw(this.mCamera);
    this.mTextConC.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Level0.prototype.update = function () {
    if(this.mTextConC.getXform().getYPos()===this.mTextConS.getXform().getYPos())
    {
        this.mTextConS.setColor([0, 0, 0, 1]);

        if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Down))
        {   this.mTextConC.getXform().setYPos(-220);
            this.mTextConS.setColor([0.5, 0.5, 0.5, 1]);
            this.mTextConH.setColor([0, 0, 0, 1]);
        }
        //start
        else if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Backspace)){
            this.mRestart = true;
            gEngine.GameLoop.stop();
        }
    }

    else if(this.mTextConC.getXform().getYPos()===this.mTextConH.getXform().getYPos())
    {


        if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Up)){
            this.mTextConC.getXform().setYPos(-150);
            this.mTextConH.setColor([0.5, 0.5, 0.5, 1]);
            this.mTextConS.setColor([0, 0, 0, 1]);
        }
        //TODO:control
        // else if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)){
        //     this.mState = 2;
        //     gEngine.GameLoop.stop();
        // }
    }
};