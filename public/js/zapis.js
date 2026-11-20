(function () {
  var form = document.querySelector('.zapis__form');
  var success = document.querySelector('.zapis__success');
  var DEFAULT_DISCIPLINE = 'Nie wiem, od czego zacząć';
  var disciplineDropdown = createDisciplineDropdown();

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (success) {
        success.hidden = false;
      }

      form.reset();

      if (disciplineDropdown) {
        disciplineDropdown.setValue(DEFAULT_DISCIPLINE);
      }
    });
  }

  function createDisciplineDropdown() {
    var root = document.querySelector('.zapis__select-wrap');
    if (!root) {
      return null;
    }

    var button = root.querySelector('.zapis__select');
    var valueEl = root.querySelector('.zapis__select-value');
    var list = root.querySelector('.zapis__options');
    var hidden = root.querySelector('input[type="hidden"]');
    var options = ['Nie wiem, od czego zacząć', 'Boks', 'Kickboxing', 'MMA', 'Muay Thai', 'BJJ'];
    var items = [];
    var current = options[0];

    function close() {
      list.hidden = true;
      button.setAttribute('aria-expanded', 'false');
    }

    function open() {
      list.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      var selected = null;
      for (var i = 0; i < items.length; i += 1) {
        if (items[i].getAttribute('aria-selected') === 'true') {
          selected = items[i];
          break;
        }
      }
      (selected || items[0]).focus();
    }

    function setValue(value) {
      current = value;
      items.forEach(function (item) {
        var isSelected = item.getAttribute('data-value') === value;
        item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      });
      valueEl.textContent = value;
      if (hidden) {
        hidden.value = value;
      }
    }

    options.forEach(function (label) {
      var item = document.createElement('li');
      item.setAttribute('role', 'option');
      item.setAttribute('data-value', label);
      item.setAttribute('aria-selected', label === current ? 'true' : 'false');
      item.tabIndex = -1;
      item.textContent = label;
      item.addEventListener('click', function () {
        setValue(label);
        close();
        button.focus();
      });
      list.appendChild(item);
      items.push(item);
    });

    if (hidden) {
      hidden.value = current;
    }

    button.addEventListener('click', function () {
      if (list.hidden) {
        open();
      } else {
        close();
      }
    });

    button.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        open();
      } else if (event.key === 'Escape') {
        close();
      }
    });

    list.addEventListener('keydown', function (event) {
      var index = items.indexOf(document.activeElement);
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        items[Math.min(index + 1, items.length - 1)].focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        items[Math.max(index - 1, 0)].focus();
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (index >= 0) {
          setValue(items[index].getAttribute('data-value'));
          close();
          button.focus();
        }
      } else if (event.key === 'Escape') {
        event.preventDefault();
        close();
        button.focus();
      } else if (event.key === 'Tab') {
        close();
      }
    });

    document.addEventListener('click', function (event) {
      if (!root.contains(event.target)) {
        close();
      }
    });

    return { setValue: setValue };
  }

  var HEIGHT_MS = 300;
  var TEXT_MS = 200;

  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.zapis__faq-item'));
  var faqOpen = null;
  var faqAnimating = false;

  function getFaqParts(details) {
    return {
      body: details.querySelector('.zapis__faq-body'),
      inner: details.querySelector('.zapis__faq-body-inner')
    };
  }

  function resetFaqItem(details) {
    var parts = getFaqParts(details);
    details.classList.remove('is-open');
    details.open = false;
    if (parts.body) {
      parts.body.style.transition = '';
      parts.body.style.height = '';
      parts.body.style.overflow = '';
    }
    if (parts.inner) {
      parts.inner.style.transition = '';
      parts.inner.style.opacity = '';
    }
  }

  function openFaqItem(details, parts) {
    faqAnimating = true;
    details.classList.add('is-open');
    details.open = true;
    parts.body.style.overflow = 'hidden';
    parts.body.style.height = '0px';
    parts.inner.style.transition = 'none';
    parts.inner.style.opacity = '0';

    var target = parts.inner.offsetHeight;
    void parts.body.offsetHeight;

    parts.body.style.transition = 'height ' + HEIGHT_MS + 'ms linear';
    parts.body.style.height = target + 'px';
    parts.inner.style.transition = 'opacity ' + TEXT_MS + 'ms linear ' + HEIGHT_MS + 'ms';
    parts.inner.style.opacity = '1';

    window.setTimeout(function () {
      parts.body.style.transition = '';
      parts.body.style.height = 'auto';
      parts.body.style.overflow = '';
      parts.inner.style.transition = '';
      parts.inner.style.opacity = '';
      faqAnimating = false;
    }, HEIGHT_MS + TEXT_MS + 20);
  }

  function closeFaqItem(details, parts) {
    faqAnimating = true;
    details.classList.remove('is-open');

    var current = parts.body.offsetHeight;
    parts.body.style.overflow = 'hidden';
    parts.body.style.height = current + 'px';
    void parts.body.offsetHeight;
    parts.body.style.transition = 'height ' + HEIGHT_MS + 'ms linear';
    parts.body.style.height = '0px';
    parts.inner.style.transition = 'opacity 150ms linear';
    parts.inner.style.opacity = '0';

    window.setTimeout(function () {
      details.open = false;
      parts.body.style.transition = '';
      parts.body.style.height = '';
      parts.body.style.overflow = '';
      parts.inner.style.transition = '';
      parts.inner.style.opacity = '';
      faqAnimating = false;
    }, HEIGHT_MS + 20);
  }

  faqItems.forEach(function (details) {
    var parts = getFaqParts(details);
    var summary = details.querySelector('summary');

    if (!summary || !parts.body || !parts.inner) {
      return;
    }

    if (details.open) {
      faqOpen = details;
    }

    summary.addEventListener('click', function (event) {
      event.preventDefault();

      if (faqAnimating) {
        return;
      }

      if (details.open) {
        faqOpen = null;
        closeFaqItem(details, parts);
      } else {
        if (faqOpen && faqOpen !== details) {
          resetFaqItem(faqOpen);
        }
        faqOpen = details;
        openFaqItem(details, parts);
      }
    });
  });
})();
