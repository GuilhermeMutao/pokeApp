import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.page.html',
  styleUrls: ['./pokemon-list.page.scss'],
})
export class PokemonListPage implements OnInit {
  pokemons: any[] = [];
  filteredPokemons: any[] = [];
  limit: number = 200;
  offset: number = 0;
  searchText: string = '';

  constructor(private pokemonService: PokemonService, private router: Router) { }

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.pokemonService.getPokemons(this.limit, this.offset, this.searchText).subscribe(result => {
      this.pokemons = result;
      this.filteredPokemons = [...this.pokemons];
    }, error => {
      console.error(error);
    });
  }

  loadMore(event: any) {
    this.offset += this.limit;
    this.pokemonService.getPokemons(this.limit, this.offset, this.searchText).subscribe(result => {
      this.pokemons = this.pokemons.concat(result);
      this.filteredPokemons = [...this.pokemons];
      event.target.complete();
  
      if (this.pokemons.length >= this.pokemons.length) {
        event.target.disabled = true;
      }
    }, error => {
      console.error(error);
      event.target.complete();
    });
  }

  openDetails(pokemon: any) {
    this.router.navigate(['/pokemon', pokemon.id]);
  }

  filterPokemons() {
    this.filteredPokemons = this.pokemons.filter(pokemon => pokemon.name.includes(this.searchText));
  }
}