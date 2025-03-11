import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelDetialsComponent } from './hotel-detials.component';

describe('HotelDetialsComponent', () => {
  let component: HotelDetialsComponent;
  let fixture: ComponentFixture<HotelDetialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelDetialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelDetialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
