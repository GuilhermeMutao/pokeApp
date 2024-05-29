import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SplashScreenService {
  public shouldShowSplash$ = new BehaviorSubject<boolean>(true);
}