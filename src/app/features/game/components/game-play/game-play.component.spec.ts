import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GamePlayComponent } from './game-play.component';

describe('GamePlayComponent', () => {
  let fixture: ComponentFixture<GamePlayComponent>;
  let component: GamePlayComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamePlayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GamePlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render default High score 0 and Score 0', () => {
    const highScoreEl = fixture.nativeElement.querySelector('.c-game-play__high-score');
    const scoreEl = fixture.nativeElement.querySelector('.c-game-play__score');

    expect(highScoreEl.textContent).toContain('High score:');
    expect(highScoreEl.textContent).toContain('0');
    expect(scoreEl.textContent).toContain('Score:');
    expect(scoreEl.textContent).toContain('0');
  });

  it('should update High score and Score when inputs change', () => {
    fixture.componentRef.setInput('highScore', 120);
    fixture.componentRef.setInput('currentScore', 45);
    fixture.detectChanges();

    const highScoreValue = fixture.nativeElement.querySelector(
      '.c-game-play__high-score-value'
    );
    const scoreValue = fixture.nativeElement.querySelector('.c-game-play__score-value');

    expect(highScoreValue.textContent.trim()).toBe('120');
    expect(scoreValue.textContent.trim()).toBe('45');
  });

  it('should emit stepLeft when Izquierda button is clicked', () => {
    let leftClicked = false;
    component.stepLeft.subscribe(() => (leftClicked = true));

    const buttons = fixture.nativeElement.querySelectorAll('app-ui-button button');
    // Button 0: Izquierda, Button 1: Derecha
    buttons[0].click();

    expect(leftClicked).toBe(true);
  });

  it('should emit stepRight when Derecha button is clicked', () => {
    let rightClicked = false;
    component.stepRight.subscribe(() => (rightClicked = true));

    const buttons = fixture.nativeElement.querySelectorAll('app-ui-button button');
    buttons[1].click();

    expect(rightClicked).toBe(true);
  });
});
