export default {
    sounds: {
      swordSlash: new AudioClip('sounds/sword_slash.mp3')
    },
    models: {
        hexRed: new GLTFShape('models/hexRed.glb'),
        hexOrange: new GLTFShape('models/hexOrange.glb'),
        hexGreen: new GLTFShape('models/hexGreen.glb'),
        hexBlue: new GLTFShape('models/hexBlue.glb'),
        hexBlack: new GLTFShape('models/hexBlack.glb')
    },
    images: {
      healthBarImage: new Texture('images/healthBarImage.png',{samplingMode:0}),
      slashImage: new Texture('images/swordSlash.png',{samplingMode:0}),
      aetheriaMap: new Texture('images/aetheriaMap.png',{samplingMode:0}),
      hexPlane: new Texture('images/hexOutline.png',{samplingMode:0}),
      hexAttack: new Texture('images/hexAttack.png',{samplingMode:0}),
      hexMove: new Texture('images/hexMove.png',{samplingMode:0}),
      playerIcon: new Texture('images/cybercircle.png',{samplingMode:0})

    }
}
