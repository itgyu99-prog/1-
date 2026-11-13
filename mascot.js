const mascot = document.getElementById('mascot');
const mascotSpeech = mascot.querySelector('.mascot-speech');
const mascotFaces = [
  { x: 49, y: 47, eyes: 'M36 44q2 -4 4 0M60 44q2 -4 4 0', mouth: [49, 55] },
  { x: 45, y: 45, eyes: 'M28 44q3 -5 6 0M57 43q3 -5 6 0', mouth: [45, 53] },
  { x: 48, y: 40, eyes: 'M34 39q3 -5 6 0M55 37q3 -5 6 0', mouth: [48, 46] },
  { x: 46, y: 47, eyes: 'M32 45q2 -4 4 0M59 48q2 -4 4 0', mouth: [46, 51] }
];

for (const [index, face] of mascotFaces.entries()) {
  const sprite = document.createElement('span');
  sprite.className = 'mascot-sprite';
  const [x, y] = face.mouth;
  sprite.innerHTML = `
    <span class="mascot-body">
      <img src="character-base-0${index + 1}.png" alt="" draggable="false">
      <svg class="mascot-expression" viewBox="0 0 100 100">
        <g class="mascot-happy">
          <path d="${face.eyes}" />
          <path class="mascot-open-mouth" d="M${x - 4} ${y}h8q-4 9 -8 0Z" />
        </g>
        <g class="mascot-sad">
          <path d="M${face.x - 13} ${face.y - 7}l5 -3m16 0l5 3M${x - 4} ${y + 2}q4 -5 8 0" />
        </g>
      </svg>
      <span class="mascot-paw mascot-paw-left"></span>
      <span class="mascot-paw mascot-paw-right"></span>
    </span>`;
  mascot.querySelector('.mascot-cast').append(sprite);
}

const mascotCopy = {
  ko: {
    success: ['좋아! 잘하고 있어!', '오오! 제법인데?', '대단해! 계속 가보자!', '벌써 여기까지 왔어?', '우와! 엄청 빠른데?', '조금만 더 힘내!', '거의 다 왔어!'],
    fail: ['에구...', '앗! 아까워!', '괜찮아! 다시 해보자!', '아이쿠!'],
    complete: '해냈다! 정말 멋져!'
  },
  en: {
    success: ['Nice work!', 'You’ve got this!', 'Great! Keep going!', 'Look how far you’ve come!', 'Wow, you’re fast!', 'Keep it up!', 'Almost there!'],
    fail: ['Oops!', 'So close!', 'It’s okay. Try again!', 'Oh, nearly!'],
    complete: 'You did it! Amazing!'
  },
  ja: {
    success: ['いい調子！', 'おお、やるね！', 'すごい！その調子！', 'もうここまで来たの？', 'わあ、速いね！', 'あと少し、頑張って！', 'もうすぐだよ！'],
    fail: ['おっと…', 'あっ、惜しい！', '大丈夫！もう一回！', 'あらら！'],
    complete: 'やったね！すごい！'
  }
};

let mascotTimer;
let mascotExitTimer;
let lastMascotMilestone = 0;

function resetMascot() {
  clearTimeout(mascotTimer);
  clearTimeout(mascotExitTimer);
  lastMascotMilestone = 0;
  mascot.dataset.state = 'idle';
  mascot.classList.remove('mascot-leaving');
  mascotSpeech.textContent = '';
}

function reactMascot(state, progress, onComplete) {
  if (mascot.dataset.state === 'complete') return;
  if (state === 'success') {
    if (progress % 5 || progress <= lastMascotMilestone) return;
    lastMascotMilestone = progress;
  }
  clearTimeout(mascotTimer);
  clearTimeout(mascotExitTimer);
  mascot.classList.remove('mascot-leaving');
  mascot.dataset.state = 'idle';
  // Restart CSS animation for consecutive reactions of the same type.
  mascot.getBoundingClientRect();
  mascot.dataset.state = state;
  const copy = mascotCopy[language];
  mascotSpeech.textContent = state === 'complete' ? copy.complete :
    state === 'fail' ? copy.fail[(progress - 1) % copy.fail.length] :
    copy.success[(progress / 5 - 1) % copy.success.length];

  const duration = state === 'fail' ? 1500 : 2000;
  mascotExitTimer = setTimeout(() => mascot.classList.add('mascot-leaving'), duration - 220);
  mascotTimer = setTimeout(() => {
    mascot.dataset.state = 'idle';
    mascot.classList.remove('mascot-leaving');
    mascotSpeech.textContent = '';
    onComplete?.();
  }, duration);
}
