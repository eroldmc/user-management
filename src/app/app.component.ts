import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, MatSlideToggleModule, MatButtonToggleModule, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private translate = inject(TranslateService);

  title = 'user-management';

  constructor() {
    this.translate.addLangs(['fr', 'en']);
    this.translate.setDefaultLang('en');
  }

  onLanguageChange(event: MatButtonToggleChange): void {
    const language = event.value;
    this.translate.use(language);
  }
}
