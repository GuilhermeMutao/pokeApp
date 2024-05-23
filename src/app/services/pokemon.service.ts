import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private url = 'https://pokeapi.co/api/v2/pokemon?limit=25';

  constructor(private http: HttpClient) { }

  getPokemonDetails(id: number): Observable<any> {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${id}`).pipe(
      map((pokemonDetails: any) => ({
        id: pokemonDetails.id,
        name: pokemonDetails.name,
        image: pokemonDetails.sprites.front_default,
        abilities: pokemonDetails.abilities.map((a: any) => a.ability.name),
        types: pokemonDetails.types.map((t: any) => t.type.name),
        stats: pokemonDetails.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat })),
        moves: pokemonDetails.moves.map((m: any) => m.move.name)
      }))
    );
  }

  getPokemons(): Observable<any> {
    return this.http.get<any>(this.url).pipe(
      mergeMap(response => {
        const requests = response.results.map((pokemon: any) => 
          this.http.get(pokemon.url).pipe(
            map((pokemonDetails: any) => ({
              id: pokemonDetails.id,
              name: pokemonDetails.name,
              image: pokemonDetails.sprites.front_default
            }))
          )
        );
        return forkJoin(requests);
      })
    );
  }
}