document.addEventListener('DOMContentLoaded', function () {
  var imgHtml = '<img src="/assets/images/brigadres-logo.svg" alt="БригАдрес" />';
  var selectors = ['.logo-badge', '.brand-badge', '.site-logo', '.brand', '.logo', '.header-logo'];
  var replaced = 0;

  selectors.forEach(function(sel) {
    var els = document.querySelectorAll(sel);
    els.forEach(function(el) {
      var text = (el.textContent || '').trim();
      if (text === 'БА' || text.indexOf('БА') !== -1 || el.classList.contains('logo-badge') || el.getAttribute('aria-label') === 'БригАдрес') {
        el.innerHTML = imgHtml;
        el.classList.add('brigadres-logo-replaced');
        replaced++;
      }
    });
  });

  if (replaced === 0) {
    var all = document.querySelectorAll('div, a, span');
    all.forEach(function(el) {
      if ((el.childElementCount === 0) && (el.textContent || '').trim() === 'БА') {
        el.innerHTML = imgHtml;
        el.classList.add('brigadres-logo-replaced');
        replaced++;
      }
    });
  }
});
