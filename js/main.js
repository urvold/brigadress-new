
// Discount timer
(function () {
  var el = document.getElementById('discount-timer');
  if (!el) return;
  var deadlineStr = el.getAttribute('data-deadline');
  var deadline = deadlineStr ? new Date(deadlineStr) : null;

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function updateTimer() {
    if (!deadline) return;
    var now = new Date();
    var diff = deadline - now;
    if (diff <= 0) {
      el.textContent = 'акция завершена';
      return;
    }
    var totalSeconds = Math.floor(diff / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    el.textContent = days + ' д ' + pad(hours) + ' ч ' + pad(minutes) + ' м';
  }

  updateTimer();
  setInterval(updateTimer, 60000);
})();

// Projects slider
(function () {
  var slider = document.querySelector('.projects-slider');
  if (!slider) return;

  var cards = slider.querySelectorAll('.project-card');
  if (!cards.length) return;
  var left = slider.querySelector('.slider-arrow-left');
  var right = slider.querySelector('.slider-arrow-right');
  var index = 0;

  function show(i) {
    cards.forEach(function (card, idx) {
      card.classList.toggle('active', idx === i);
    });
    index = i;
  }

  left && left.addEventListener('click', function () {
    var i = index - 1;
    if (i < 0) i = cards.length - 1;
    show(i);
  });

  right && right.addEventListener('click', function () {
    var i = index + 1;
    if (i >= cards.length) i = 0;
    show(i);
  });

  // Project details toggle
  cards.forEach(function (card) {
    var btn = card.querySelector('.project-more');
    if (!btn) return;
    btn.addEventListener('click', function () {
      card.classList.toggle('open');
    });
  });
})();

// Reviews accordion
(function () {
  var reviews = document.querySelectorAll('.review-card');
  if (!reviews.length) return;

  reviews.forEach(function (card) {
    var header = card.querySelector('.review-header');
    var toggleBtn = card.querySelector('.review-toggle');
    if (!header) return;

    header.addEventListener('click', function () {
      var isOpen = card.classList.contains('open');
      reviews.forEach(function (c) {
        c.classList.remove('open');
        var btn = c.querySelector('.review-toggle');
        if (btn) btn.textContent = '+';
      });
      if (!isOpen) {
        card.classList.add('open');
        if (toggleBtn) toggleBtn.textContent = '−';
      } else {
        if (toggleBtn) toggleBtn.textContent = '+';
      }
    });
  });
})();

// Generic lead forms (prevent full submit on static site)
(function () {
  var forms = document.querySelectorAll('.lead-form');
  if (!forms.length) return;

  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = form.querySelector('.form-success');
      if (success) {
        success.hidden = false;
      }
    });
  });
})();

// Smart calculator logic
(function () {
  var form = document.getElementById('smart-calculator');
  if (!form) return;
  var resultBlock = document.getElementById('calc-result');
  var resultContent = resultBlock && resultBlock.querySelector('.calc-result-content');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!resultBlock || !resultContent) return;

    var data = new FormData(form);
    var object = data.get('object');
    var workType = data.get('work_type');
    var area = data.get('area');
    var timeframe = data.get('timeframe');
    var contactMethod = data.get('contact_method');
    var extra = data.get('extra');

    var parts = [];
    parts.push('Объект: ' + object + '.');
    parts.push('Тип работ: ' + workType + '.');
    if (area) {
      parts.push('Площадь: ' + area + ' м².');
    }
    if (timeframe) {
      parts.push('Планируемый старт: ' + timeframe + '.');
    }
    if (extra) {
      parts.push('Дополнительные пожелания: ' + extra.trim());
    }

    resultContent.innerHTML = '<p>' + parts.join(' ') + '</p>' +
      '<p><strong>Что будет дальше:</strong> мы уточним детали по телефону или в выбранном мессенджере (' +
      contactMethod + '), подберем проверенных подрядчиков и подготовим для вас сравнение по рыночной цене.</p>';

    resultBlock.hidden = false;
    resultBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
