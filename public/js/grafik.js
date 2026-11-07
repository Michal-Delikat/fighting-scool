(function () {
  var section = document.querySelector('.grafik');
  if (!section) {
    return;
  }

  var tabsEl = section.querySelector('.grafik__tabs');
  var daysEl = section.querySelector('.grafik__days');
  var disciplineRoot = section.querySelector('[data-filter="discipline"]');
  var groupRoot = section.querySelector('[data-filter="group"]');

  var state = {
    discipline: '',
    group: '',
    activeDay: null
  };

  var data = null;

  function todayIndex() {
    return (new Date().getDay() + 6) % 7;
  }

  function matches(entry) {
    if (state.discipline && entry.discipline !== state.discipline) {
      return false;
    }
    if (state.group === 'dorosli' && entry.group !== 'dorośli') {
      return false;
    }
    if (state.group === 'dzieci' && entry.group !== 'dzieci' && entry.group !== 'młodzież') {
      return false;
    }
    return true;
  }

  function createClassItem(entry) {
    var li = document.createElement('li');
    li.className = 'grafik__class';

    var time = document.createElement('span');
    time.className = 'grafik__time';
    time.textContent = entry.start + '–' + entry.end;

    var discipline = document.createElement('span');
    discipline.className = 'grafik__discipline';
    discipline.textContent = entry.discipline;

    var meta = document.createElement('span');
    meta.className = 'grafik__meta';

    var level = document.createElement('span');
    level.className = 'grafik__level';
    level.textContent = entry.level;

    var group = document.createElement('span');
    group.className = 'grafik__group';
    group.textContent = entry.group;

    meta.appendChild(level);
    meta.appendChild(group);

    if (entry.room) {
      var room = document.createElement('span');
      room.className = 'grafik__room';
      room.textContent = entry.room;
      meta.appendChild(room);
    }

    li.appendChild(time);
    li.appendChild(discipline);

    if (entry.note) {
      var note = document.createElement('span');
      note.className = 'grafik__note';
      note.textContent = entry.note;
      li.appendChild(note);
    }

    li.appendChild(meta);

    if (entry.level === 'początkujący') {
      var first = document.createElement('a');
      first.className = 'grafik__first';
      first.href = '#trening-probny';
      first.textContent = 'Dobre na pierwszy trening';
      li.appendChild(first);
    }

    return li;
  }

  function renderDays() {
    daysEl.innerHTML = '';

    data.days.forEach(function (day) {
      var dayEl = document.createElement('div');
      dayEl.className = 'grafik__day';
      dayEl.setAttribute('data-day', day.id);

      if (day.id === state.activeDay) {
        dayEl.classList.add('is-active');
      }

      var heading = document.createElement('h3');
      heading.className = 'grafik__day-name';
      heading.textContent = day.label;
      dayEl.appendChild(heading);

      var list = document.createElement('ul');
      list.className = 'grafik__list';

      var visible = day.classes.filter(matches);

      if (visible.length === 0) {
        var empty = document.createElement('li');
        empty.className = 'grafik__empty';
        empty.textContent = 'Brak zajęć';
        list.appendChild(empty);
      } else {
        visible.forEach(function (entry) {
          list.appendChild(createClassItem(entry));
        });
      }

      dayEl.appendChild(list);
      daysEl.appendChild(dayEl);
    });
  }

  function setActiveDay(id) {
    state.activeDay = id;

    Array.prototype.forEach.call(tabsEl.children, function (tab) {
      var selected = tab.getAttribute('data-day') === id;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
    });

    Array.prototype.forEach.call(daysEl.children, function (dayEl) {
      if (dayEl.getAttribute('data-day') === id) {
        dayEl.classList.add('is-active');
      } else {
        dayEl.classList.remove('is-active');
      }
    });
  }

  function renderTabs() {
    tabsEl.innerHTML = '';

    data.days.forEach(function (day) {
      var tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'grafik__tab';
      tab.setAttribute('role', 'tab');
      tab.setAttribute('data-day', day.id);
      tab.setAttribute('aria-selected', day.id === state.activeDay ? 'true' : 'false');
      tab.textContent = day.short;

      tab.addEventListener('click', function () {
        setActiveDay(day.id);
      });

      tabsEl.appendChild(tab);
    });
  }

  function createDropdown(root, options, onSelect) {
    var button = root.querySelector('.grafik__select');
    var valueEl = root.querySelector('.grafik__select-value');
    var list = root.querySelector('.grafik__options');
    var items = [];

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
      var label = '';
      items.forEach(function (item) {
        var isSelected = item.getAttribute('data-value') === value;
        item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        if (isSelected) {
          label = item.textContent;
        }
      });
      valueEl.textContent = label;
      onSelect(value);
    }

    options.forEach(function (option) {
      var item = document.createElement('li');
      item.setAttribute('role', 'option');
      item.setAttribute('data-value', option.value);
      item.setAttribute('aria-selected', option.value === '' ? 'true' : 'false');
      item.tabIndex = -1;
      item.textContent = option.label;
      item.addEventListener('click', function () {
        setValue(option.value);
        close();
        button.focus();
      });
      list.appendChild(item);
      items.push(item);
    });

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
  }

  function initFilters() {
    var disciplineOptions = [{ value: '', label: 'Wszystkie' }];
    data.disciplines.forEach(function (name) {
      disciplineOptions.push({ value: name, label: name });
    });

    createDropdown(disciplineRoot, disciplineOptions, function (value) {
      state.discipline = value;
      applyFilters();
    });

    createDropdown(groupRoot, [
      { value: '', label: 'Wszystkie' },
      { value: 'dorosli', label: 'Dorośli' },
      { value: 'dzieci', label: 'Dzieci' }
    ], function (value) {
      state.group = value;
      applyFilters();
    });
  }

  function applyFilters() {
    renderDays();
  }

  fetch('data/grafik.json')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }
      return response.json();
    })
    .then(function (json) {
      data = json;
      var today = todayIndex();
      state.activeDay = data.days[today] ? data.days[today].id : data.days[0].id;
      initFilters();
      renderTabs();
      renderDays();
    })
    .catch(function () {
      daysEl.textContent = 'Nie udało się wczytać grafiku.';
    });
})();
