import { Container, Sprite } from 'pixi.js'

import { FIXED_DELTA_TIME } from '../constants.js'

export class DudeEmoteSpitter {
  public view: Container = new Container()

  private emotes: Sprite[] = []

  private gapTime = 1000
  private currentGapTime = 0

  private moveSpeed = 50
  private alphaSpeed = 1
  private scaleSpeed = 0.5

  public add(url: string) {
    const sprite = Sprite.from(url)
    sprite.anchor.set(0.5, 0.5)
    sprite.scale.set(0, 0)
    this.emotes.push(sprite)
  }

  public update() {
    for (const child of this.view.children) {
      child.position.y -= (FIXED_DELTA_TIME * this.moveSpeed) / 1000
      child.scale.x += (FIXED_DELTA_TIME * this.scaleSpeed) / 1000
      child.scale.y += (FIXED_DELTA_TIME * this.scaleSpeed) / 1000

      if (child.scale.x > 1) {
        child.alpha -= (FIXED_DELTA_TIME * this.alphaSpeed) / 1000
      }

      if (child.alpha <= 0) {
        this.view.removeChild(child)
      }
    }

    if (this.currentGapTime >= 0) {
      this.currentGapTime -= FIXED_DELTA_TIME
    } else {
      if (this.emotes.length > 0) {
        const sprite = this.emotes.shift()
        this.view.addChild(sprite!)
        this.currentGapTime = this.gapTime
      }
    }
  }
}
