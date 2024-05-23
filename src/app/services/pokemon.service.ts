import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private url = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) { }

  getPokemonList(offset = 0) {
    return this.http.get(`${this.url}?offset=${offset}&limit=25`);
  }

  getPokemonDetails(name: string) {
    return this.http.get(`${this.url}/${name}`);
  }
}