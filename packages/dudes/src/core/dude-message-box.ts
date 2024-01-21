import { Container, Graphics, Text, TextMetrics } from 'pixi.js'

import { FIXED_DELTA_TIME } from '../constants.js'

export class DudeMessageBox {
  public view: Container = new Container()

  private container: Container = new Container()
  private box?: Graphics

  private padding: number = 10
  private borderRadius: number = 10
  private boxColor: number = 0xeeeeee
  private textColor: number = 0x333333
  private fontFamily: string = 'Arial'
  private fontSize: number = 20

  private animationTime = 500
  private currentAnimationTime = 0
  private shift = 30

  private showTime = 10000
  private currentShowTime = 0

  private messageQueue: string[] = []

  constructor() {
    this.view.addChild(this.container)
  }

  private trim(text: Text): string {
    const metrics = TextMetrics.measureText(text.text, text.style)

    return metrics.lines.length > 4
      ? metrics.lines.slice(0, 4).join(' ').slice(0, -3) + '...'
      : text.text
  }

  public update() {
    if (this.currentAnimationTime >= 0) {
      this.currentAnimationTime -= FIXED_DELTA_TIME

      this.container.alpha += FIXED_DELTA_TIME / this.animationTime
      this.container.position.y -=
        (this.shift * FIXED_DELTA_TIME) / this.animationTime
    } else {
      this.container.alpha = 1
    }

    if (this.currentShowTime <= 0) {
      if (this.container.children.length > 0) {
        this.container.removeChildren()
      }

      if (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift()

        if (message) {
          this.show(message)
        }

        this.currentShowTime = this.showTime
        this.currentAnimationTime = this.animationTime
      }
    } else {
      this.currentShowTime -= FIXED_DELTA_TIME
    }
  }

  public bounds() {
    return {
      x: this.box?.x,
      y: this.box?.y,
      width: this.box?.width,
      height: this.box?.height
    }
  }

  public add(message: string) {
    this.messageQueue.push(message)
  }

  private show(message: string) {
    const text = new Text(message, {
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fill: this.textColor,
      align: 'left',
      breakWords: true,
      wordWrap: true,
      wordWrapWidth: 200
    })

    text.anchor.set(0.5, 1)
    text.position.set(0, -this.padding)
    text.text = this.trim(text)

    this.box = new Graphics()
    this.box.beginFill(this.boxColor)
    this.box.drawRoundedRect(
      text.x - this.padding - text.width * text.anchor.x,
      text.y - this.padding - text.height * text.anchor.y,
      text.width + this.padding * 2,
      text.height + this.padding * 2,
      this.borderRadius
    )
    this.box.endFill()

    this.container.alpha = 0
    this.container.position.y = this.shift

    this.container.addChild(this.box, text)
  }
}
