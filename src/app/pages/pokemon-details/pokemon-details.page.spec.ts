import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PokemonDetailsPageRoutingModule } from './pokemon-details-routing.module';
import { SharedModule } from '../../shared.module';
import { PokemonDetailsPageModule } from './pokemon-details.module';
import { PokemonDetailsPage } from './pokemon-details.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('PokemonDetailsPageModule', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PokemonDetailsPageRoutingModule,
        SharedModule,
        PokemonDetailsPageModule,
        HttpClientTestingModule 
      ],
      declarations: [PokemonDetailsPage],
      providers: [ 
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => 'value', 
              },
            },
            params: of({ id: 'testId' }) 
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the PokemonDetailsPage', () => {
    const fixture = TestBed.createComponent(PokemonDetailsPage);
    const page = fixture.componentInstance;
    expect(page).toBeTruthy();
  });
});