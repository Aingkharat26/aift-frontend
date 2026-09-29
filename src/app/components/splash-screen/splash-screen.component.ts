import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SicThemeService } from 'sic-ng';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
})
export class SplashScreenComponent implements OnInit {
  themeService = inject(SicThemeService);
  isVisible = signal<boolean>(true);
  isFadingOut = signal<boolean>(false);

  ngOnInit(): void {
    // Clear any previous session storage lock so user can always see it on fresh load
    try {
      sessionStorage.removeItem('aift_splash_dismissed');
    } catch (e) {}

    // Display for 2.0s then fade out smoothly
    setTimeout(() => {
      this.isFadingOut.set(true);
      setTimeout(() => {
        this.isVisible.set(false);
      }, 450);
    }, 2000);
  }

  dismissImmediately(): void {
    this.isFadingOut.set(true);
    setTimeout(() => {
      this.isVisible.set(false);
    }, 200);
  }
}
