
document.addEventListener('DOMContentLoaded', () => {
  // Discount timer
  const timerEl = document.getElementById('discount-timer');
  if (timerEl) {
    const deadline = new Date(timerEl.dataset.deadline);
    const updateTimer = () => {
      const now = new Date();
      const diff = deadline - now;
      if (diff <= 0) {
        timerEl.textContent = 'Акция завершена';
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      timerEl.textContent = `${days} д ${hours} ч ${minutes} мин`;
    };
    updateTimer();
    setInterval(updateTimer, 60000);
  }

  // Projects slider on главной
  const slider = document.querySelector('.projects-slider');
  if (slider) {
    const cards = Array.from(slider.querySelectorAll('.project-card'));
    const leftBtn = slider.querySelector('.slider-arrow-left');
    const rightBtn = slider.querySelector('.slider-arrow-right');
    const counter = document.querySelector('.projects-counter span');
    let index = 0;

    const updateSlider = () => {
      cards.forEach((card, idx) => card.classList.toggle('active', idx === index));
      if (counter) {
        counter.textContent = `Показан ${index + 1} из ${cards.length} проектов`;
      }
    };

    if (leftBtn && rightBtn && cards.length > 0) {
      leftBtn.addEventListener('click', () => {
        index = (index - 1 + cards.length) % cards.length;
        updateSlider();
      });
      rightBtn.addEventListener('click', () => {
        index = (index + 1) % cards.length;
        updateSlider();
      });
      updateSlider();
    }
  }

  // Проекты: раскрытие деталей
  document.querySelectorAll('.project-more').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      if (card) {
        card.classList.toggle('open');
      }
    });
  });

  // Reviews accordion
  document.querySelectorAll('.review-card').forEach((card) => {
    const header = card.querySelector('.review-header');
    const toggleBtn = card.querySelector('.review-toggle');
    header.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');
      document.querySelectorAll('.review-card').forEach((c) => {
        c.classList.remove('open');
        const t = c.querySelector('.review-toggle');
        if (t) t.textContent = '+';
      });
      if (!isOpen) {
        card.classList.add('open');
        if (toggleBtn) toggleBtn.textContent = '−';
      } else if (toggleBtn) {
        toggleBtn.textContent = '+';
      }
    });
  });

  // Простая имитация отправки форм
  document.querySelectorAll('form.lead-form, form.smart-calculator').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = form.querySelector('.form-success');
      if (success) {
        success.hidden = false;
        setTimeout(() => {
          success.hidden = true;
        }, 6000);
      }
      form.reset();
    });
  });

  // Умный калькулятор — генерация результата
  const smartCalc = document.getElementById('smart-calculator');
  if (smartCalc) {
    smartCalc.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(smartCalc);
      const object = formData.get('object');
      const area = formData.get('area');
      const workType = formData.get('work_type');
      const timeframe = formData.get('timeframe');
      const contactMethod = formData.get('contact_method');
      const extra = formData.get('extra');
      const resultSection = document.getElementById('calc-result');
      const resultContainer = document.querySelector('.calc-result-content');

      if (resultSection && resultContainer) {
        let areaText = area ? `${area} м²` : 'площадь уточняется';
        let approxBudget = '';
        if (area && workType) {
          const a = Number(area);
          let coef = 8000;
          if (workType.includes('Капитальный')) coef = 12000;
          if (workType.includes('под ключ')) coef = 15000;
          approxBudget = `Ориентировочный бюджет: ~${(a * coef).toLocaleString('ru-RU')} ₽ (черновой расчёт).`;
        }
        const html = `
          <p><strong>Объект:</strong> ${object}, ${areaText}.</p>
          <p><strong>Тип работ:</strong> ${workType}.</p>
          <p><strong>Планируемый старт:</strong> ${timeframe}.</p>
          ${approxBudget ? `<p>${approxBudget}</p>` : ''}
          <p><strong>Связаться с вами удобнее через:</strong> ${contactMethod}.</p>
          ${extra ? `<p><strong>Дополнительно:</strong> ${extra}</p>` : ''}
          <p>На основе этих данных мы подберём подрядчиков и подготовим варианты смет.</p>
        `;
        resultContainer.innerHTML = html;
        resultSection.hidden = false;
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Тайм‑калькулятор
  const timecalc = document.getElementById('timecalc');
  if (timecalc) {
    const progressFill = document.getElementById('timecalc-progress-fill');
    const progressSteps = Array.from(timecalc.querySelectorAll('.timecalc-progress-steps span'));
    const steps = Array.from(timecalc.querySelectorAll('.timecalc-step'));
    const startBtn = document.getElementById('timecalc-start');
    const toResultBtn = document.getElementById('timecalc-to-result');
    const totalAnimatedEl = document.getElementById('timecalc-total-animated');
    const totalFinalEl = document.getElementById('timecalc-total-final');
    const resultTextEl = document.getElementById('timecalc-result-text');

    let selectedType = null;
    let selectedMaterials = null;
    const baseTotal = 30 + 20 + 15 + 35 + 80 + 15; // 195

    const setStep = (idx) => {
      steps.forEach((s, i) => s.classList.toggle('active', i === idx));
      const pct = ((idx + 1) / steps.length) * 100;
      if (progressFill) progressFill.style.width = pct + '%';
      progressSteps.forEach((s, i) => s.classList.toggle('active', i <= idx));
    };

    // выбор опций
    timecalc.querySelectorAll('.timecalc-options').forEach((group) => {
      group.addEventListener('click', (e) => {
        const btn = e.target.closest('.timecalc-option');
        if (!btn) return;
        group.querySelectorAll('.timecalc-option').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const name = group.dataset.name;
        if (name === 'type') selectedType = btn.dataset.value;
        if (name === 'materials') selectedMaterials = btn.dataset.value;
      });
    });

    const calcTotal = () => {
      let factorType = 1;
      if (selectedType === 'cosmetic') factorType = 0.7;
      if (selectedType === 'capital') factorType = 1.0;
      if (selectedType === 'full') factorType = 1.2;
      let factorMaterials = 1;
      if (selectedMaterials === 'yes') factorMaterials = 1.15;
      const total = Math.round(baseTotal * factorType * factorMaterials);
      return total;
    };

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (!selectedType || !selectedMaterials) {
          startBtn.textContent = 'Выберите ответы выше';
          setTimeout(() => {
            startBtn.textContent = 'Перейти к расчёту';
          }, 1500);
          return;
        }
        setStep(1);

        const tasks = Array.from(document.querySelectorAll('#timecalc-task-list li'));
        const targetTotal = calcTotal();
        let currentTotal = 0;
        const perStep = Math.max(1, Math.round(targetTotal / tasks.length));

        tasks.forEach((li) => li.classList.remove('visible'));

        tasks.forEach((li, idx) => {
          setTimeout(() => {
            li.classList.add('visible');
            currentTotal = idx === tasks.length - 1 ? targetTotal : Math.min(targetTotal, currentTotal + perStep);
            if (totalAnimatedEl) {
              totalAnimatedEl.textContent = `${currentTotal} часов`;
            }
          }, 350 * (idx + 1));
        });

        if (totalFinalEl && resultTextEl) {
          totalFinalEl.textContent = `~${targetTotal} часов`;
          const days = Math.round(targetTotal / 24);
          resultTextEl.textContent =
            `${targetTotal} часов — это примерно ${days} полных суток вашей жизни. ` +
            'Столько времени обычно уходит не на сам ремонт, а на организацию: звонки, поездки, согласования и контроль.';
        }
      });
    }

    if (toResultBtn) {
      toResultBtn.addEventListener('click', () => {
        setStep(2);
      });
    }
  }
});
