import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiButtonComponent } from './ui-button.component';

@Component({
  standalone: true,
  imports: [UiButtonComponent],
  template: `
    <app-ui-button
      [disabled]="isDisabled()"
      [variant]="variant()"
      [type]="type()"
      [label]="label()"
      [icon]="icon()"
      (btnClick)="onClicked()"
    >
      @if (!label()) {
        Jugar
      }
    </app-ui-button>
  `,
})
class TestHostComponent {
  readonly isDisabled = signal(false);
  readonly variant = signal<'primary' | 'secondary' | 'danger'>('primary');
  readonly type = signal<'button' | 'submit'>('submit');
  readonly label = signal<string | null>(null);
  readonly icon = signal<string | null>(null);
  clicked = false;

  onClicked(): void {
    this.clicked = true;
  }
}

describe('UiButtonComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should project button text content', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent.trim()).toBe('Jugar');
  });

  it('should apply primary variant class by default', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('c-btn--primary')).toBe(true);
  });
});
