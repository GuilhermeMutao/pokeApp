import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: 'pokemon-details.page.html',
  styleUrls: ['pokemon-details.page.scss']
})
export class PokemonDetailsPage implements OnInit {
  pokemon: any;
  pokemonColor: any;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private navCtrl: NavController,
    private renderer: Renderer2, 
    private elementRef: ElementRef 
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pokemonService.getPokemonDetails(id).subscribe((data: any) => {
      this.pokemon = data;
      this.pokemonColor = data.color;
      this.renderer.setStyle(this.elementRef.nativeElement, '--pokemon-color', this.pokemonColor);
    });
  }

  getTypeColor(type: string): string {
    switch (type.toLowerCase()) {
      case 'grass': return '#78C850';
      case 'fire': return '#F08030';
      case 'water': return '#6890F0';
      case 'bug': return '#A8B820';
      case 'normal': return '#A8A878';
      case 'poison': return '#A040A0';
      case 'electric': return '#F8D030';
      case 'ground': return '#E0C068';
      case 'fairy': return '#EE99AC';
      case 'fighting': return '#C03028';
      case 'psychic': return '#F85888';
      case 'rock': return '#B8A038';
      case 'ghost': return '#705898';
      case 'ice': return '#98D8D8';
      case 'dragon': return '#7038F8';
      case 'dark': return '#705848';
      case 'steel': return '#B8B8D0';
      case 'flying': return '#A890F0';
      default: return '#A8A878'; 
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}