import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pokemon-list',
    pathMatch: 'full'
  },
  {
    path: 'pokemon-list',
    loadChildren: () => import('./pages/pokemon-list/pokemon-list.module').then( m => m.PokemonListPageModule)
  },
  {
    path: 'pokemon-details',
    loadChildren: () => import('./pages/pokemon-details/pokemon-details.module').then( m => m.PokemonDetailsPageModule)
  },
  { 
    path: 'pokemon/:id', 
    loadChildren: () => import('./pages/pokemon-details/pokemon-details.module').then(m => m.PokemonDetailsPageModule) 
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
