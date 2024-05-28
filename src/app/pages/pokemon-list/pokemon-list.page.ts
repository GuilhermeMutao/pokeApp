import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.page.html',
  styleUrls: ['./pokemon-list.page.scss'],
})
export class PokemonListPage implements OnInit, OnDestroy {
  pokemons: any[] = [];
  filteredPokemons: any[] = [];
  limit: number = 1000;
  offset: number = 0;
  total: number = 0;
  searchText: string = '';
  private unsubscribe$ = new Subject<void>();

  isLoading = new BehaviorSubject<boolean>(false);
  isLoadingFavorites = new BehaviorSubject<boolean>(false);
  showFavorites: boolean = false;

  constructor(
    private pokemonService: PokemonService,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    this.total = await this.pokemonService.getTotalPokemons().toPromise() || 0; 
    this.limit = this.total;
    this.offset += this.limit;
    await this.loadPokemons();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async loadPokemons(isFavorites: boolean = false) {
    this.isLoading.next(true);
    this.isLoadingFavorites.next(isFavorites);

    try {
      const pokemons = await this.pokemonService.getPokemons(this.limit, this.offset, this.searchText)
        .pipe(takeUntil(this.unsubscribe$))
        .toPromise();

      this.pokemons = pokemons || []; 
      this.filterPokemons(isFavorites);
    } catch (error) {
      console.error('Error loading Pokemons', error);
    } finally {
      this.isLoading.next(false);
      this.isLoadingFavorites.next(false);
    }
  }

  toggleFavorite(event: any, pokemon: any) {
    event.stopPropagation();
    this.pokemonService.toggleFavorite(pokemon);
  }


  toggleShowFavorites() {
    this.showFavorites = !this.showFavorites;
    this.loadPokemons(this.showFavorites);
    this.filterPokemons(this.showFavorites);
  }

  loadFavoritePokemons() {
    this.pokemons = this.pokemonService.getFavoritePokemons();
  }

  async loadMore(event: any) {
    this.offset += this.limit;
    this.isLoading.next(true);

    try {
      const result = await this.pokemonService.getPokemons(this.limit, this.offset, this.searchText)
        .pipe(takeUntil(this.unsubscribe$))
        .toPromise();

      this.pokemons = this.pokemons.concat(result);
      this.filteredPokemons = [...this.pokemons];
      event.target.complete();

      if (this.pokemons.length >= this.total) {
        event.target.disabled = true;
      }
    } catch (error) {
      console.error(error);
      event.target.complete();
    } finally {
      this.isLoading.next(false);
    }
  }

  openDetails(pokemon: any) {
    this.router.navigate(['/pokemon', pokemon.id]);
  }

  filterPokemons(isFavorites: boolean = false) {
    if (isFavorites) {
      this.filteredPokemons = this.pokemons.filter(pokemon => pokemon.isFavorite);
    } else {
      this.filteredPokemons = this.pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(this.searchText.toLowerCase()));
    }
  }

  isNameTooLong(name: string): boolean {
    const maxLength = 10;
    return name.length > maxLength;
  }
}