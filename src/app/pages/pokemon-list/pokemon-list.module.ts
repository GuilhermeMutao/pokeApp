import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PokemonListPageRoutingModule } from './pokemon-list-routing.module';
import { SharedModule } from '../../shared.module'; // Add this import

import { PokemonListPage } from './pokemon-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule, 
    PokemonListPageRoutingModule
  ],
  declarations: [PokemonListPage]
})
export class PokemonListPageModule {}