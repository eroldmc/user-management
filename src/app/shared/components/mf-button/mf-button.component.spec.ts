import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MfButtonComponent } from './mf-button.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatButtonModule } from '@angular/material/button';
import { provideHttpClient } from '@angular/common/http';

describe('MfButtonComponent', () => {
  let component: MfButtonComponent;
  let fixture: ComponentFixture<MfButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatButtonModule,MfButtonComponent],
      declarations: [],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(MfButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show label', () => {
    component.label = 'Click me';
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('Click me');
  });

  it('should emit clicked event', () => {
    spyOn(component.clicked, 'emit');
    component.handleClick();
    expect(component.clicked.emit).toHaveBeenCalled();
  });
});
