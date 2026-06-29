export class Modal {
  constructor(host) {
    this.host = host;
    this.el = document.createElement('div');
    this.el.className = 'modal-shell hidden';
    this.host.appendChild(this.el);
  }

  open({ title, subtitle = '', body = '', actions = [] }) {
    this.el.classList.remove('hidden');
    this.el.innerHTML = `
      <div class="modal-panel">
        <div class="modal-header">
          <span class="eyebrow">Arc-12 Interface</span>
          <button class="icon-button" data-close title="Close">X</button>
        </div>
        <h2>${title}</h2>
        ${subtitle ? `<p class="modal-subtitle">${subtitle}</p>` : ''}
        <div class="modal-body">${body}</div>
        <div class="modal-actions"></div>
      </div>
    `;
    this.el.querySelector('[data-close]').addEventListener('click', () => this.close());
    const actionHost = this.el.querySelector('.modal-actions');
    actions.forEach((action) => {
      const button = document.createElement('button');
      button.className = `ui-button ${action.kind || 'secondary'}`;
      button.textContent = action.label;
      button.addEventListener('click', () => action.onClick?.());
      actionHost.appendChild(button);
    });
  }

  close() {
    this.el.classList.add('hidden');
  }
}
