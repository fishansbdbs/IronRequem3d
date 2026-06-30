export class DialogueUI {
  constructor(host) {
    this.host = host;
    this.el = document.createElement('div');
    this.el.className = 'dialogue hidden';
    host.appendChild(this.el);
  }

  open(lines, { choices = [], onChoice, onComplete } = {}) {
    this.lines = lines;
    this.index = 0;
    this.choices = choices;
    this.onChoice = onChoice;
    this.onComplete = onComplete;
    this.el.classList.remove('hidden');
    this.render();
    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  render() {
    const line = this.lines[this.index];
    const atEnd = this.index >= this.lines.length - 1;
    this.el.innerHTML = `
      <div class="portrait-sigil"></div>
      <div class="dialogue-copy">
        <span>${line.speaker}</span>
        <p>${line.text}</p>
        <div class="dialogue-actions"></div>
      </div>
    `;
    const actions = this.el.querySelector('.dialogue-actions');
    if (atEnd && this.choices.length) {
      this.choices.forEach((choice) => {
        const button = document.createElement('button');
        button.className = 'ui-button secondary';
        button.innerHTML = `<span>${choice.label}</span><small>${choice.tone}</small>`;
        button.addEventListener('click', () => this.finish(choice));
        actions.appendChild(button);
      });
    } else {
      const button = document.createElement('button');
      button.className = 'ui-button primary';
      button.textContent = atEnd ? 'Close' : 'Continue';
      button.addEventListener('click', () => (atEnd ? this.finish(null) : this.next()));
      actions.appendChild(button);
    }
  }

  next() {
    this.index += 1;
    this.render();
  }

  finish(choice) {
    this.el.classList.add('hidden');
    if (choice) this.onChoice?.(choice);
    this.onComplete?.();
    this.resolve?.(choice);
  }
}
