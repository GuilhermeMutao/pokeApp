import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  pokemons: { name: string, image: string }[] = [];

  constructor(private pokemonService: PokemonService, private router: Router) { }

  ngOnInit() {
    this.pokemonService.getPokemons().subscribe((data: any) => {
      this.pokemons = data;
    });
  }

  openDetails(pokemon: any) {
    this.router.navigate(['/pokemon', pokemon.id]);
  }
}