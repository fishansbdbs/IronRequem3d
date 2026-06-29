export class DialogueSystem {
  constructor(dialogueUI) {
    this.dialogueUI = dialogueUI;
  }

  play(lines, options = {}) {
    return this.dialogueUI.open(lines, options);
  }
}
