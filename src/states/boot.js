import Phaser from 'phaser'

export default class Boot extends Phaser.State {
  preload () {
    this.game.load.image('cake', './assets/cake.png')
    this.game.load.physics('cakePhysics', './assets/cakeCollider.json')
    this.game.load.image('donatt', './assets/donatt.png')
    this.game.load.physics('cakePhysics', './assets/donatt.json')
    this.game.load.image('leaf', './assets/leaf.png')
    this.game.load.physics('cakePhysics', './assets/leaf.json')

    this.game.load.image('gameField', './assets/gameField.png')
    this.game.load.image('leaf', './assets/leaf.png')
    this.game.load.image('donatt', './assets/donatt.png')
    this.game.load.image('packet', './assets/packet.png')
    this.game.load.physics('gameFieldPolygon', './assets/gameField.json')
    this.game.load.physics('gameObjectsPhysics', './assets/gameObjectsPhysics.json')
  }

  create () {
    this.objectNamesArr = ['donatt', 'leaf', 'packet']
    this.objectsSelection = []
    this.isSelection = false

    this.game.stage.backgroundColor = '#ccddff'
    this.countObject = 0
    this.maxCountObject = 35
    this.game.physics.startSystem(Phaser.Physics.P2JS)
    this.game.physics.p2.gravity.y = 1000

    const seed = Date.now()
    this.random = new Phaser.RandomDataGenerator([seed])
    this.game.time.events.loop(10, this.generateObject, this)

    this.createField()

    this.game.physics.p2.gravity.y = 300
  }

  objectSpawner (x, y, name) {
    const obj = this.game.add.sprite(x, y, name)
    obj.anchor.set(0.5)

    this.game.physics.p2.enable([obj], false)
    obj.body.clearShapes()
    obj.body.loadPolygon('gameObjectsPhysics', name)
    obj.inputEnabled = true
    obj.events.onInputDown.add(this.onClickHandler, this)
    obj.events.onInputOver.add(this.onOverObjHandler, this)
    obj.events.onInputUp.add(this.onUpHandler, this)
    // self.block.events.onInputDown.add(self.changeRope, this)
  }

  onUpHandler () {
    if (this.objectsSelection.length >= 3) {
      this.objectsSelection.forEach(obj => obj.destroy())
    }
    this.objectsSelection.forEach(obj => obj.tint = 0xffffff)
    this.isSelection = false
    this.objectsSelection = []
  }

  onClickHandler (sprite, pointer) {
    console.log('onclick', sprite, pointer)
    this.isSelection = true
    sprite.tint = 0xff0000
    this.objectsSelection.push(sprite)
    // sprite.destroy()
  }

  onOverObjHandler (sprite) {
    if (!this.isSelection) return
    const name = this.objectsSelection[0].key
    if (name === sprite.key) {
      sprite.tint = 0xff0000
      this.objectsSelection.push(sprite)
    }
    console.log(name)
  }

  createField () {
    const self = this
    self.field = self.game.add.sprite(this.game.world.width / 2, this.game.world.height / 2, 'gameField')
    self.field.anchor.set(0.5)

    self.game.physics.p2.enable([self.field], true)
    self.field.body.clearShapes()
    self.field.body.loadPolygon('gameFieldPolygon', 'gameField')
    self.field.body.static = true

    const lif = self.game.add.bitmapData(self.game.world.width, 50)
    lif.ctx.rect(0, 0, self.game.world.width, 50)
    lif.ctx.fillStyle = '000'
    lif.ctx.fill()

    self.lif = self.game.add.sprite(self.field.x - self.field.width / 2, self.field.y - self.field.height / 2, lif)
    self.game.physics.p2.enable([self.lif])
    self.lif.body.static = true
  }

  generateObject () {
    if (this.countObject >= this.maxCountObject) {
      this.game.time.events.stop(true)
      setTimeout(() => {
        const cake = this.game.add.sprite(this.field.x, 150, 'cake')
        this.game.physics.p2.enable([cake], false)
        this.lif.destroy()
      }, 1000)
    }
    const objName = this.objectNamesArr[this.random.between(0, this.objectNamesArr.length - 1)]
    const x = this.field.x
    const y = this.field.y
    this.objectSpawner(x, y, objName)
    this.countObject++
  }

  createBlock () {
    const self = this
    const blockShape = self.game.add.bitmapData(self.game.world.width, 200)
    blockShape.ctx.rect(0, 0, self.game.world.width, 200)
    blockShape.ctx.fillStyle = '000'
    blockShape.ctx.fill()

    self.block = self.game.add.sprite(0, 0, blockShape)

    self.game.physics.p2.enable(self.block)
    self.block.body.static = true
    self.block.anchor.setTo(0, 0)

    self.block.inputEnabled = true
    self.block.events.onInputDown.add(self.changeRope, this)
  }

  update () {
    // this.drawRope()
  }
}
