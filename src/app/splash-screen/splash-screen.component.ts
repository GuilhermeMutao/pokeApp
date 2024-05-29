import { Component, OnInit } from '@angular/core';
import { SplashScreenService } from '../services/splash-screen.service';


@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
})
export class SplashScreenComponent implements OnInit {
  show = true;

  
constructor(private splashScreenService: SplashScreenService) {}

ngOnInit() {
  this.splashScreenService.shouldShowSplash$.subscribe((shouldShowSplash) => {
    this.show = shouldShowSplash;
  });
}
}