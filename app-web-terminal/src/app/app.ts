// Componente que implementa o xterm.js

import { Component, ElementRef, viewChild, afterNextRender } from '@angular/core';
import { Terminal } from '@xterm/xterm';

@Component({
  selector: 'app-root',
  template: `
    <div #terminalcontainer></div>
  `
})
export class App {
  private terminalcontainer = viewChild.required<ElementRef<HTMLDivElement>>('terminalcontainer');

  constructor() {
    afterNextRender(() => {
      const terminal = new Terminal();
      terminal.open(this.terminalcontainer().nativeElement);

      const ws = new WebSocket('ws://localhost:8080');

      ws.onmessage = (event) => {
        terminal.write(event.toString());
      };

      terminal.onData((data) => {
        ws.send(data);
      });
    });
  }
}
