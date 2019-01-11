import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZestawienieComponent } from './zestawienie.component';

describe('ZestawienieComponent', () => {
  let component: ZestawienieComponent;
  let fixture: ComponentFixture<ZestawienieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZestawienieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZestawienieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
