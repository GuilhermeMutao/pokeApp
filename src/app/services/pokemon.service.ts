import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable, forkJoin, throwError } from 'rxjs';
import { map, switchMap, catchError, mergeMap } from 'rxjs/operators';

interface PokemonDetails {
  id: number;
  name: string;
  image: string;
  abilities: string[];
  types: string[];
  stats: { name: string; value: number }[];
  moves: string[];
  color: string;
}

interface PokemonSummary {
  id: number;
  name: string;
  image: string;
  color: string;
}

const API_URL = 'https://pokeapi.co/api/v2';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  constructor(private http: HttpClient) { }

  getPokemonDetails(id: number): Observable<PokemonDetails> {
    return this.http.get<PokemonDetails>(`${API_URL}/pokemon/${id}`).pipe(
      switchMap((pokemonDetails: any) => {
        return this.getPokemonColor(id).pipe(
          map((color: string) => ({
            id: pokemonDetails.id,
            name: pokemonDetails.name,
            image: pokemonDetails.sprites.front_default,
            abilities: pokemonDetails.abilities.map((a: any) => a.ability.name),
            types: pokemonDetails.types.map((t: any) => t.type.name),
            stats: pokemonDetails.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat })),
            moves: pokemonDetails.moves.map((m: any) => m.move.name),
            color: color
          }))
        );
      }),
      catchError(error => {
        console.error('Error fetching Pokemon details', error);
        return throwError(error);
      })
    );
  }

  getPokemons(limit: number, offset: number, searchText: string): Observable<PokemonSummary[]> {
    return this.getTotalPokemons().pipe(
      switchMap(total => {
        if (offset > total - limit) {
          offset = Math.max(0, total - limit);
        }

        return this.http.get<any[]>(`${API_URL}/pokemon?limit=${limit}&offset=${offset}`).pipe(
          catchError(error => {
            console.error('Error fetching Pokemon list', error);
            return of([]);
          }),
          switchMap((response: any): Observable<PokemonSummary[]> => {
            if (response && response.results) {
              const requests = response.results.map((pokemon: any) => {
                const id = Number(pokemon.url.split('/')[6]);
                if (isNaN(id) || id > total || id < 1) {
                  return of(null);
                } else {
                  return this.http.get(pokemon.url).pipe(
                    catchError(error => {
                      console.error('Error fetching Pokemon details', error);
                      return of(null);
                    }),
                    mergeMap((details: any) => {
                      if (details && details.id && details.name && details.sprites && details.sprites.front_default) {
                        return this.getPokemonColor(id).pipe(
                          map((color: string) => ({
                            id: details.id,
                            name: details.name,
                            image: details.sprites.front_default,
                            color: color
                          })),
                          catchError(error => {
                            console.error('Error fetching Pokemon color', error);
                            return of({
                              id: details.id,
                              name: details.name,
                              image: details.sprites.front_default,
                              color: 'unknown'
                            });
                          })
                        );
                      } else {
                        console.error('Invalid Pokemon details', details);
                        return of(null);
                      }
                    })
                  );
                }
              });
              return forkJoin<PokemonSummary[]>(requests).pipe(
                map((pokemons: PokemonSummary[]) => pokemons.filter(pokemon => pokemon !== null))
              );
            } else {
              return of([]);
            }
          }),
          map((pokemons: PokemonSummary[]) => {
            if (searchText) {
              return pokemons.filter((pokemon: PokemonSummary) => pokemon && pokemon.name.toLowerCase().includes(searchText.toLowerCase()));
            } else {
              return pokemons;
            }
          }),
          catchError(error => {
            console.error('Error fetching Pokemons', error);
            return of([]);
          })
        );
      })
    );
  }

  getTotalPokemons(): Observable<number> {
    return this.http.get<{ count: number }>(`${API_URL}/pokemon`).pipe(
      map(response => response.count)
    );
  }

  getPokemonColor(id: number) {
    return this.http.get(`${API_URL}/pokemon-species/${id}`).pipe(
      map((species: any) => species.color.name),
      catchError(error => {
        console.error('Error fetching Pokemon color', error);
        return of('unknown');
      })
    );
  }
}