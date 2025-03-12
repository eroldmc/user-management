import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfSelectComponent } from './mf-select.component';
import { TranslateModule } from '@ngx-translate/core';

describe('MfSelectComponent', () => {
  let component: MfSelectComponent<any>;
  let fixture: ComponentFixture<MfSelectComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MfSelectComponent,TranslateModule.forRoot()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MfSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
