import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/boot'

class Game extends Phaser.Game {
  constructor () {
    super(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game')

    this.state.add('BootState', BootState, true)
  }
}

new Game() // eslint-disable-line
