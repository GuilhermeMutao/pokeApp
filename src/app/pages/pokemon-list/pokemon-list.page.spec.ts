import { PokemonListPage } from './pokemon-list.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing'; 

describe('PokemonListPage', () => {
  let component: PokemonListPage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    component = TestBed.createComponent(PokemonListPage).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('checkScroll should update showScrollTopButton', () => {
    const event = { detail: { scrollTop: 2000 } };
    component.checkScroll(event);
    expect(component.showScrollTopButton).toBe(true);
  });
});