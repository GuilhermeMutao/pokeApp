import { Component, OnInit } from '@angular/core';
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

  constructor(private route: ActivatedRoute, private pokemonService: PokemonService, private navCtrl: NavController) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id')); // Convert the id to a number
    this.pokemonService.getPokemonDetails(id).subscribe((data: any) => {
      this.pokemon = data;
    });
  }

  goBack() {
    this.navCtrl.back();
  }
}