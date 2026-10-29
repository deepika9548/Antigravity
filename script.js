/* ============================================================
   DEEPIKA PAL - PORTFOLIO INTERACTIVITY SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initTypewriter();
  initNavbar();
  initStatsCounter();
  initCodeTerminal();
  initDSALab();
  initResumeModal();
  initContactForm();
});

/* ============================================================
   1. AMBIENT PARTICLE CANVAS
   ============================================================ */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(width > 768 ? 45 : 20, 50);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 102, 241, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ============================================================
   2. TYPEWRITER EFFECT
   ============================================================ */
function initTypewriter() {
  const textEl = document.getElementById('typewriter-text');
  if (!textEl) return;

  const roles = [
    'Software Developer',
    'Java & OOP Programmer',
    'C & Data Structures Enthusiast',
    'Algorithmic Problem Solver'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      textEl.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 50;
    } else {
      textEl.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 1800; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before typing next
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ============================================================
   3. NAVBAR & ACTIVE NAVIGATION
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');

  // Sticky background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // Active section spy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const secHeight = sec.offsetHeight;
      const secTop = sec.offsetTop - 120;
      const secId = sec.getAttribute('id');

      if (scrollY > secTop && scrollY <= secTop + secHeight) {
        links.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${secId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ============================================================
   4. STATS COUNTER ANIMATION
   ============================================================ */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(num => {
          const target = +num.getAttribute('data-target');
          let count = 0;
          const increment = Math.ceil(target / 40);

          const updateCount = () => {
            count += increment;
            if (count >= target) {
              num.textContent = target;
            } else {
              num.textContent = count;
              requestAnimationFrame(updateCount);
            }
          };

          updateCount();
        });
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.stats-bar');
  if (statsSection) observer.observe(statsSection);
}

/* ============================================================
   5. INTERACTIVE HERO TERMINAL
   ============================================================ */
function initCodeTerminal() {
  const runBtn = document.getElementById('run-code-btn');
  const outputText = document.getElementById('terminal-output-text');
  if (!runBtn || !outputText) return;

  const messages = [
    "Compiling DeepikaPal.java... [OK]",
    "Running test suite: All 250+ DSA tests passed (100% test coverage).",
    "Candidate verified: Deepika Pal is ready for Campus Placements!",
    "Memory allocated: 0 leaks. Output: Efficient & Clean Code."
  ];
  let msgIdx = 0;

  runBtn.addEventListener('click', () => {
    runBtn.disabled = true;
    runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Running...';
    outputText.textContent = "Executing bytecode...";

    setTimeout(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      outputText.textContent = messages[msgIdx];
      runBtn.disabled = false;
      runBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run';
    }, 600);
  });
}

/* ============================================================
   6. INTERACTIVE DSA LAB (SORTING & STACK)
   ============================================================ */
function initDSALab() {
  // Tab Switcher
  const tabBtns = document.querySelectorAll('.lab-tab-btn');
  const tabContents = document.querySelectorAll('.lab-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = `tab-${btn.getAttribute('data-tab')}`;
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // --- SORTING VISUALIZER ---
  const barsContainer = document.getElementById('visualizer-bars');
  const btnGenArray = document.getElementById('btn-generate-array');
  const btnBubbleSort = document.getElementById('btn-bubble-sort');
  const btnSelectionSort = document.getElementById('btn-selection-sort');
  const sortStatus = document.getElementById('sort-status-display');
  const algoName = document.getElementById('algo-name-display');
  const algoTime = document.getElementById('algo-time-display');
  const algoSpace = document.getElementById('algo-space-display');
  const algoComps = document.getElementById('algo-comparisons');

  let array = [];
  let isSorting = false;
  const arraySize = 12;

  function generateArray() {
    if (isSorting) return;
    array = [];
    barsContainer.innerHTML = '';
    algoComps.textContent = '0';
    sortStatus.textContent = 'Status: New array generated. Select an algorithm.';

    for (let i = 0; i < arraySize; i++) {
      const val = Math.floor(Math.random() * 85) + 15;
      array.push(val);

      const bar = document.createElement('div');
      bar.classList.add('dsa-bar');
      bar.style.height = `${val * 2.2}px`;
      bar.textContent = val;
      barsContainer.appendChild(bar);
    }
  }

  generateArray();
  btnGenArray.addEventListener('click', generateArray);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Bubble Sort
  btnBubbleSort.addEventListener('click', async () => {
    if (isSorting) return;
    isSorting = true;
    algoName.textContent = 'Bubble Sort';
    algoTime.textContent = 'O(N²)';
    algoSpace.textContent = 'O(1)';
    sortStatus.textContent = 'Sorting in progress (Bubble Sort)...';

    const bars = document.querySelectorAll('.dsa-bar');
    let comparisons = 0;
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        bars[j].classList.add('comparing');
        bars[j + 1].classList.add('comparing');
        comparisons++;
        algoComps.textContent = comparisons;

        await sleep(150);

        if (array[j] > array[j + 1]) {
          bars[j].classList.add('swapping');
          bars[j + 1].classList.add('swapping');

          // Swap logic
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;

          bars[j].style.height = `${array[j] * 2.2}px`;
          bars[j].textContent = array[j];
          bars[j + 1].style.height = `${array[j + 1] * 2.2}px`;
          bars[j + 1].textContent = array[j + 1];

          await sleep(150);
          bars[j].classList.remove('swapping');
          bars[j + 1].classList.remove('swapping');
        }

        bars[j].classList.remove('comparing');
        bars[j + 1].classList.remove('comparing');
      }
      bars[n - i - 1].classList.add('sorted');
    }
    bars[0].classList.add('sorted');
    sortStatus.textContent = `Completed! Array is now sorted. Total comparisons: ${comparisons}`;
    isSorting = false;
  });

  // Selection Sort
  btnSelectionSort.addEventListener('click', async () => {
    if (isSorting) return;
    isSorting = true;
    algoName.textContent = 'Selection Sort';
    algoTime.textContent = 'O(N²)';
    algoSpace.textContent = 'O(1)';
    sortStatus.textContent = 'Sorting in progress (Selection Sort)...';

    const bars = document.querySelectorAll('.dsa-bar');
    let comparisons = 0;
    const n = array.length;

    for (let i = 0; i < n; i++) {
      let minIdx = i;
      bars[i].classList.add('comparing');

      for (let j = i + 1; j < n; j++) {
        bars[j].classList.add('comparing');
        comparisons++;
        algoComps.textContent = comparisons;

        await sleep(100);

        if (array[j] < array[minIdx]) {
          if (minIdx !== i) bars[minIdx].classList.remove('swapping');
          minIdx = j;
          bars[minIdx].classList.add('swapping');
        } else {
          bars[j].classList.remove('comparing');
        }
      }

      if (minIdx !== i) {
        let temp = array[i];
        array[i] = array[minIdx];
        array[minIdx] = temp;

        bars[i].style.height = `${array[i] * 2.2}px`;
        bars[i].textContent = array[i];
        bars[minIdx].style.height = `${array[minIdx] * 2.2}px`;
        bars[minIdx].textContent = array[minIdx];

        await sleep(150);
        bars[minIdx].classList.remove('swapping');
      }

      bars[i].classList.remove('comparing');
      bars[i].classList.add('sorted');
    }

    sortStatus.textContent = `Completed! Selection sort finished with ${comparisons} comparisons.`;
    isSorting = false;
  });

  // --- STACK VISUALIZER ---
  const stackBox = document.getElementById('stack-box');
  const stackInput = document.getElementById('stack-input');
  const btnPush = document.getElementById('btn-stack-push');
  const btnPop = document.getElementById('btn-stack-pop');
  const btnClear = document.getElementById('btn-stack-clear');
  const stackStatus = document.getElementById('stack-status-display');
  const stackSizeDisplay = document.getElementById('stack-size-display');
  const stackTopDisplay = document.getElementById('stack-top-display');

  const stack = ['BCA', 'Java', 'DSA'];
  const MAX_STACK = 6;

  function renderStack() {
    stackBox.innerHTML = '';
    stack.forEach((item, idx) => {
      const node = document.createElement('div');
      node.classList.add('stack-node');
      node.textContent = `[${idx}] ${item}`;
      if (idx === stack.length - 1) {
        node.classList.add('top-element');
      }
      stackBox.appendChild(node);
    });

    stackSizeDisplay.textContent = `Size: ${stack.length} / Max ${MAX_STACK}`;
    stackTopDisplay.textContent = stack.length > 0 ? `Index ${stack.length - 1} (${stack[stack.length - 1]})` : 'NULL (Empty)';
  }

  renderStack();

  btnPush.addEventListener('click', () => {
    const val = stackInput.value.trim();
    if (!val) {
      stackStatus.textContent = 'Please enter a value to push.';
      return;
    }
    if (stack.length >= MAX_STACK) {
      stackStatus.textContent = '⚠️ Stack Overflow! Max capacity reached.';
      return;
    }

    stack.push(val);
    stackInput.value = '';
    renderStack();
    stackStatus.textContent = `Pushed "${val}" onto top of stack in O(1) time.`;
  });

  btnPop.addEventListener('click', () => {
    if (stack.length === 0) {
      stackStatus.textContent = '⚠️ Stack Underflow! Stack is already empty.';
      return;
    }

    const popped = stack.pop();
    renderStack();
    stackStatus.textContent = `Popped "${popped}" from top of stack in O(1) time.`;
  });

  btnClear.addEventListener('click', () => {
    stack.length = 0;
    renderStack();
    stackStatus.textContent = 'Stack cleared to empty state.';
  });
}

/* ============================================================
   7. RESUME MODAL & PRINT
   ============================================================ */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const triggerBtn = document.getElementById('resume-trigger-btn');
  const closeBtn = document.getElementById('close-modal-btn');
  const printBtn = document.getElementById('print-resume-btn');

  if (!modal || !triggerBtn) return;

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  triggerBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close when clicking overlay backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Print / Save PDF
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ============================================================
   8. CONTACT FORM & TOAST
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const toast = document.getElementById('toast');

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();

      const submitBtn = document.getElementById('submit-message-btn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Message Sent!</span> <i class="fa-solid fa-check"></i>';

        feedback.innerHTML = `<span class="form-feedback success">Thank you ${name}! Your inquiry regarding "${subject}" has been recorded. Deepika will reach out shortly.</span>`;
        showToast(`Message sent successfully from ${email}!`);

        form.reset();

        setTimeout(() => {
          submitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
          feedback.innerHTML = '';
        }, 5000);
      }, 1000);
    });
  }
}
