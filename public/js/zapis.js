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

  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.zapis__faq-item'));
  var faqOpen = null;

  faqItems.forEach(function (details) {
    var summary = details.querySelector('summary');

    if (!summary) {
      return;
    }

    if (details.open) {
      faqOpen = details;
    }

    summary.addEventListener('click', function (event) {
      event.preventDefault();

      if (details.open) {
        details.open = false;
        details.classList.remove('is-open');
        faqOpen = null;
      } else {
        if (faqOpen && faqOpen !== details) {
          faqOpen.open = false;
          faqOpen.classList.remove('is-open');
        }
        details.open = true;
        details.classList.add('is-open');
        faqOpen = details;
      }
    });
  });
})();
