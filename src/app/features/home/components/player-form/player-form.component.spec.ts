import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerFormComponent } from './player-form.component';

describe('PlayerFormComponent', () => {
  let component: PlayerFormComponent;
  let fixture: ComponentFixture<PlayerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial form state', () => {
    it('should have label correctly bound to input via for and id', () => {
      const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;
      expect(label.getAttribute('for')).toBe('playerName');
      expect(label.textContent?.trim()).toBe('Crear nuevo jugador');
    });
  });

  describe('Form Submission', () => {
    it('should emit playerSubmit with trimmed name on valid submission', () => {
      const emitSpy = jest.spyOn(component.playerSubmit, 'emit');

      component.nameControl.setValue('  SpeedGamer  ');
      fixture.detectChanges();

      component.onSubmit();

      expect(emitSpy).toHaveBeenCalledWith('SpeedGamer');
    });

    it('should not emit playerSubmit when form is invalid', () => {
      const emitSpy = jest.spyOn(component.playerSubmit, 'emit');

      component.nameControl.setValue('bad!');
      fixture.detectChanges();

      component.onSubmit();

      expect(emitSpy).not.toHaveBeenCalled();
      expect(component.nameControl.touched).toBe(true);
    });
  });
});
