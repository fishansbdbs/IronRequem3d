export class InteractionSystem {
  constructor(radius = 2.35) {
    this.radius = radius;
    this.current = null;
  }

  update(player, interactables) {
    let nearest = null;
    let nearestDistance = Infinity;
    for (const item of interactables) {
      const distance = player.position.distanceTo(item.group.position);
      if (distance < this.radius && distance < nearestDistance) {
        nearest = item;
        nearestDistance = distance;
      }
    }
    this.current = nearest;
    return nearest;
  }
}
