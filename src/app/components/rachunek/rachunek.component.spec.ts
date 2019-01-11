import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RachunekComponent } from './rachunek.component';

describe('RachunekComponent', () => {
  let component: RachunekComponent;
  let fixture: ComponentFixture<RachunekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RachunekComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RachunekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
