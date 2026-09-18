import { Component, ElementRef, viewChild, afterNextRender } from '@angular/core';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';

@Component({
  standalone: true,
  selector: 'app-terminal-component',
  styleUrl: './terminal-component.css',
  templateUrl: './terminal-component.html',
})
export class TerminalComponent {
  private terminalcontainer = viewChild.required<ElementRef<HTMLDivElement>>('terminalcontainer');

  constructor() {
    afterNextRender(() => {
      const terminal = new Terminal(
        {
          theme: {
            background: '#1B1B1A',
            foreground: '#EAECED'
          }
        }
      );
      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);

      terminal.open(this.terminalcontainer().nativeElement);

      fitAddon.fit();

      const ws = new WebSocket('ws://localhost:8080');

      ws.onmessage = (event) => {
        terminal.write(event.data.toString());
      };

      terminal.onData((data) => {
        ws.send(data);
      });
    });
  }
}
