import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendlyNamePipe } from './utils/friendly-name.pipe';

@NgModule({
  declarations: [FriendlyNamePipe],
  imports: [CommonModule],
  exports: [FriendlyNamePipe]
})
export class SharedModule { }