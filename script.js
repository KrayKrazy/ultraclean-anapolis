/**
 * UltraClean Anápolis - Estética para Estofados
 * Interactive JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initBeforeAfterSlider();
  initCalculator();
  initFaqAccordion();
  initHeaderScroll();
});

/* ==========================================================================
   1. Header & Mobile Menu
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    toggleBtn.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.classList.remove('active');

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.background = 'rgba(6, 9, 15, 0.96)';
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.7)';
    } else {
      header.style.background = 'rgba(8, 12, 20, 0.88)';
      header.style.boxShadow = 'none';
    }
  });
}

/* ==========================================================================
   2. Interactive Before & After Slider
   ========================================================================== */
function initBeforeAfterSlider() {
  const slider = document.getElementById('ba-slider');
  const afterImg = document.getElementById('ba-after-img');
  const handle = document.getElementById('ba-handle');

  if (!slider || !afterImg || !handle) return;

  let isDragging = false;

  function setSliderPosition(x) {
    const rect = slider.getBoundingClientRect();
    let position = ((x - rect.left) / rect.width) * 100;

    // Constrain position between 5% and 95%
    if (position < 5) position = 5;
    if (position > 95) position = 95;

    afterImg.style.width = `${position}%`;
    handle.style.left = `${position}%`;
  }

  // Mouse Events
  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });

  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Events (Mobile Support)
  handle.addEventListener('touchstart', (e) => {
    isDragging = true;
  }, { passive: true });

  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* ==========================================================================
   3. Interactive Budget Calculator (1-Minute WhatsApp Dispatch)
   ========================================================================== */
function initCalculator() {
  const itemOptions = document.querySelectorAll('.calc-option');
  const serviceOptions = document.querySelectorAll('.service-option');
  const bairroSelect = document.getElementById('bairro-select');

  const sumItem = document.getElementById('sum-item');
  const sumService = document.getElementById('sum-service');
  const sumBairro = document.getElementById('sum-bairro');
  const sumPrice = document.getElementById('sum-price');
  const btnWhatsApp = document.getElementById('btn-send-whatsapp');

  if (!itemOptions.length || !serviceOptions.length || !bairroSelect) return;

  let currentItem = {
    key: 'sofa-retratil',
    label: 'Sofá Retrátil/Reclinável',
    base: 280
  };

  let currentService = {
    service: 'Combo Ouro (Limpeza + Blindagem)',
    mult: 1.7,
    discount: 15
  };

  let currentBairro = bairroSelect.value;

  function updatePriceAndSummary() {
    let price = currentItem.base * currentService.mult;
    if (currentService.discount) {
      price = price * (1 - currentService.discount / 100);
    }
    const finalPrice = Math.round(price / 10) * 10; // Round to friendly 10s

    // Update labels in UI
    sumItem.textContent = currentItem.label;
    sumService.textContent = currentService.service;
    sumBairro.textContent = currentBairro;
    sumPrice.textContent = `R$ ${finalPrice}`;

    // Generate Pre-formatted WhatsApp Message
    const whatsappPhone = '5562991426532';
    const message = `Olá, equipe UltraClean Anápolis! 🛋️✨

Gostaria de agendar / confirmar o orçamento que simulei no site:
• *Estofado:* ${currentItem.label}
• *Tratamento Escolhido:* ${currentService.service}
• *Localização:* ${currentBairro} (Anápolis - GO)
• *Estimativa do Site:* A partir de R$ ${finalPrice}

Poderiam me informar os próximos horários disponíveis para atendimento a domicílio?`;

    const encodedMessage = encodeURIComponent(message);
    btnWhatsApp.href = `https://wa.me/${whatsappPhone}?text=${encodedMessage}`;
  }

  // Handle Item selection
  itemOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      itemOptions.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentItem = {
        key: btn.dataset.item,
        label: btn.dataset.label,
        base: parseFloat(btn.dataset.base)
      };

      updatePriceAndSummary();
    });
  });

  // Handle Service selection
  serviceOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceOptions.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentService = {
        service: btn.dataset.service,
        mult: parseFloat(btn.dataset.mult),
        discount: btn.dataset.discount ? parseFloat(btn.dataset.discount) : 0
      };

      updatePriceAndSummary();
    });
  });

  // Handle Bairro change
  bairroSelect.addEventListener('change', () => {
    currentBairro = bairroSelect.value;
    updatePriceAndSummary();
  });

  // Initial Calculation Run
  updatePriceAndSummary();
}

/* ==========================================================================
   4. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherAns = other.querySelector('.faq-answer');
        if (otherAns) otherAns.style.maxHeight = null;
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = `${answer.scrollHeight + 30}px`;
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });
}
