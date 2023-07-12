import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'atow';

  Start() {
    console.log('Start!');
  }

  Load(e: any) {
    console.log('Load! ', e.target.files);
  }
}
