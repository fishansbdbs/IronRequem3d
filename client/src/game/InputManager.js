export class InputManager {
  constructor(target = window) {
    this.target = target;
    this.keys = new Set();
    this.pressed = new Set();
    this.mousePressed = new Set();
    this.mouseHeld = new Set();
    this.pointer = { x: 0, y: 0, dx: 0, dy: 0, dragging: false };
    this.bound = {
      keydown: (event) => this.onKeyDown(event),
      keyup: (event) => this.onKeyUp(event),
      mousedown: (event) => this.onMouseDown(event),
      mouseup: (event) => this.onMouseUp(event),
      mousemove: (event) => this.onMouseMove(event),
      contextmenu: (event) => event.preventDefault(),
      blur: () => this.reset()
    };
  }

  attach(canvas) {
    this.canvas = canvas;
    window.addEventListener('keydown', this.bound.keydown);
    window.addEventListener('keyup', this.bound.keyup);
    window.addEventListener('mousedown', this.bound.mousedown);
    window.addEventListener('mouseup', this.bound.mouseup);
    window.addEventListener('mousemove', this.bound.mousemove);
    window.addEventListener('contextmenu', this.bound.contextmenu);
    window.addEventListener('blur', this.bound.blur);
  }

  detach() {
    window.removeEventListener('keydown', this.bound.keydown);
    window.removeEventListener('keyup', this.bound.keyup);
    window.removeEventListener('mousedown', this.bound.mousedown);
    window.removeEventListener('mouseup', this.bound.mouseup);
    window.removeEventListener('mousemove', this.bound.mousemove);
    window.removeEventListener('contextmenu', this.bound.contextmenu);
    window.removeEventListener('blur', this.bound.blur);
  }

  onKeyDown(event) {
    if (event.repeat) return;
    this.keys.add(event.code);
    this.pressed.add(event.code);
  }

  onKeyUp(event) {
    this.keys.delete(event.code);
  }

  onMouseDown(event) {
    this.mouseHeld.add(event.button);
    this.mousePressed.add(event.button);
    this.pointer.dragging = true;
  }

  onMouseUp(event) {
    this.mouseHeld.delete(event.button);
    if (this.mouseHeld.size === 0) this.pointer.dragging = false;
  }

  onMouseMove(event) {
    this.pointer.x = event.clientX;
    this.pointer.y = event.clientY;
    if (this.pointer.dragging) {
      this.pointer.dx += event.movementX || 0;
      this.pointer.dy += event.movementY || 0;
    }
  }

  isDown(code) {
    return this.keys.has(code);
  }

  consumePressed(code) {
    const has = this.pressed.has(code);
    this.pressed.delete(code);
    return has;
  }

  consumeMouse(button) {
    const has = this.mousePressed.has(button);
    this.mousePressed.delete(button);
    return has;
  }

  movementVector() {
    let x = 0;
    let z = 0;
    if (this.isDown('KeyA')) x -= 1;
    if (this.isDown('KeyD')) x += 1;
    if (this.isDown('KeyW')) z -= 1;
    if (this.isDown('KeyS')) z += 1;
    const length = Math.hypot(x, z) || 1;
    return { x: x / length, z: z / length };
  }

  frameEnd() {
    this.pressed.clear();
    this.mousePressed.clear();
    this.pointer.dx = 0;
    this.pointer.dy = 0;
  }

  reset() {
    this.keys.clear();
    this.pressed.clear();
    this.mousePressed.clear();
    this.mouseHeld.clear();
    this.pointer.dragging = false;
  }
}
