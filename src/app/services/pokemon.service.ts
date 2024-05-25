import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable, forkJoin, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

interface PokemonDetails {
  id: number;
  name: string;
  image: string;
  abilities: string[];
  types: string[];
  stats: { name: string; value: number }[];
  moves: string[];
}

interface PokemonSummary {
  id: number;
  name: string;
  image: string;
}

const API_URL = 'https://pokeapi.co/api/v2/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  constructor(private http: HttpClient) { }

  getPokemonDetails(id: number): Observable<PokemonDetails> {
    return this.http.get<PokemonDetails>(`${API_URL}/${id}`).pipe(
      map((pokemonDetails: any) => ({
        id: pokemonDetails.id,
        name: pokemonDetails.name,
        image: pokemonDetails.sprites.front_default,
        abilities: pokemonDetails.abilities.map((a: any) => a.ability.name),
        types: pokemonDetails.types.map((t: any) => t.type.name),
        stats: pokemonDetails.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat })),
        moves: pokemonDetails.moves.map((m: any) => m.move.name)
      })),
      catchError(error => {
        console.error('Error fetching Pokemon details', error);
        return throwError(error);
      })
    );
  }

  getPokemons(limit: number, offset: number, searchText: string): Observable<PokemonSummary[]> {
  return this.http.get<any[]>(`${API_URL}?limit=${limit}&offset=${offset}`).pipe(
    switchMap((response: any): Observable<PokemonSummary[]> => {
      if (response && response.results) {
        const requests = response.results.map((pokemon: any) => 
          this.http.get(pokemon.url).pipe(
            map((pokemonDetails: any) => ({
              id: pokemonDetails.id,
              name: pokemonDetails.name,
              image: pokemonDetails.sprites.front_default
            }))
          )
        );
        return forkJoin<PokemonSummary[]>(requests);
      } else {
        return of([]);
      }
    }),
    map((pokemons: PokemonSummary[]) => {
      if (searchText) {
        return pokemons.filter((pokemon: PokemonSummary) => pokemon.name.toLowerCase().includes(searchText.toLowerCase()));
      } else {
        return pokemons;
      }
    }),
    catchError(error => {
      console.error('Error fetching Pokemons', error);
      return of([]);
    })
  );
}
}