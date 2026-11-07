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

  Array.prototype.forEach.call(document.querySelectorAll('.zapis__faq-item'), function (details) {
    var summary = details.querySelector('summary');
    var body = details.querySelector('.zapis__faq-body');
    var inner = details.querySelector('.zapis__faq-body-inner');

    if (!summary || !body || !inner) {
      return;
    }

    var animating = false;

    function openItem() {
      animating = true;
      details.open = true;
      body.style.overflow = 'hidden';
      body.style.height = '0px';
      inner.style.transition = 'none';
      inner.style.opacity = '0';

      var target = inner.offsetHeight;
      void body.offsetHeight;

      body.style.transition = 'height ' + HEIGHT_MS + 'ms linear';
      body.style.height = target + 'px';
      inner.style.transition = 'opacity ' + TEXT_MS + 'ms linear ' + HEIGHT_MS + 'ms';
      inner.style.opacity = '1';

      window.setTimeout(function () {
        body.style.transition = '';
        body.style.height = 'auto';
        body.style.overflow = '';
        inner.style.transition = '';
        inner.style.opacity = '';
        animating = false;
      }, HEIGHT_MS + TEXT_MS + 20);
    }

    function closeItem() {
      animating = true;

      var current = body.offsetHeight;
      body.style.overflow = 'hidden';
      body.style.height = current + 'px';
      void body.offsetHeight;
      body.style.transition = 'height ' + HEIGHT_MS + 'ms linear';
      body.style.height = '0px';
      inner.style.transition = 'opacity 150ms linear';
      inner.style.opacity = '0';

      window.setTimeout(function () {
        details.open = false;
        body.style.transition = '';
        body.style.height = '';
        body.style.overflow = '';
        inner.style.transition = '';
        inner.style.opacity = '';
        animating = false;
      }, HEIGHT_MS + 20);
    }

    summary.addEventListener('click', function (event) {
      event.preventDefault();

      if (animating) {
        return;
      }

      if (details.open) {
        closeItem();
      } else {
        openItem();
      }
    });
  });
})();
