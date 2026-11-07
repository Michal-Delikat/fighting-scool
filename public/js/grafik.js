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

  function matches(entry) {
    if (state.discipline && entry.discipline !== state.discipline) {
      return false;
    }
    if (state.group && entry.group !== state.group) {
      return false;
    }
    return true;
  }

  function createClassItem(entry) {
    var li = document.createElement('li');
    li.className = 'grafik__class';

    var time = document.createElement('span');
    time.className = 'grafik__time';
    time.textContent = entry.end ? entry.start + '–' + entry.end : entry.start;

    var discipline = document.createElement('span');
    discipline.className = 'grafik__discipline';
    discipline.textContent = entry.discipline;

    var meta = document.createElement('span');
    meta.className = 'grafik__meta';

    if (entry.group) {
      var group = document.createElement('span');
      group.className = 'grafik__group';
      group.textContent = 'Gr. ' + entry.group;
      meta.appendChild(group);
    }

    if (entry.room) {
      var room = document.createElement('span');
      room.className = 'grafik__room';
      room.textContent = entry.room;
      meta.appendChild(room);
    }

    li.appendChild(time);
    li.appendChild(discipline);
    li.appendChild(meta);

    return li;
  }

  function renderDays() {
    daysEl.innerHTML = '';

    data.days.forEach(function (day) {
      var dayEl = document.createElement('div');
      dayEl.className = 'grafik__day';
      dayEl.setAttribute('data-day', day.id);

      var visible = day.classes.filter(matches);

      if (state.activeDay === null) {
        if (visible.length > 0) {
          dayEl.classList.add('is-active');
        }
      } else if (day.id === state.activeDay) {
        dayEl.classList.add('is-active');
      }
      dayEl.classList.toggle('is-empty', visible.length === 0);

      var heading = document.createElement('h3');
      heading.className = 'grafik__day-name';
      heading.textContent = day.label;
      dayEl.appendChild(heading);

      var list = document.createElement('ul');
      list.className = 'grafik__list';

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

    daysEl.classList.toggle('is-all', state.activeDay === null);
  }

  function setActiveDay(id) {
    state.activeDay = id;

    Array.prototype.forEach.call(tabsEl.children, function (tab) {
      var selected = id !== null && tab.getAttribute('data-day') === id;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
    });

    Array.prototype.forEach.call(daysEl.children, function (dayEl) {
      if (id === null) {
        if (dayEl.classList.contains('is-empty')) {
          dayEl.classList.remove('is-active');
        } else {
          dayEl.classList.add('is-active');
        }
      } else if (dayEl.getAttribute('data-day') === id) {
        dayEl.classList.add('is-active');
      } else {
        dayEl.classList.remove('is-active');
      }
    });

    daysEl.classList.toggle('is-all', id === null);
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
        setActiveDay(state.activeDay === day.id ? null : day.id);
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

    var groupOptions = [{ value: '', label: 'Wszystkie' }];
    var groupNames = [];
    data.days.forEach(function (day) {
      day.classes.forEach(function (entry) {
        if (entry.group && groupNames.indexOf(entry.group) === -1) {
          groupNames.push(entry.group);
        }
      });
    });
    groupNames.forEach(function (name) {
      groupOptions.push({ value: name, label: name });
    });

    if (groupNames.length === 0) {
      groupRoot.hidden = true;
      groupRoot.style.display = 'none';
      return;
    }

    createDropdown(groupRoot, groupOptions, function (value) {
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
      initFilters();
      renderTabs();
      renderDays();
    })
    .catch(function () {
      daysEl.textContent = 'Nie udało się wczytać grafiku.';
    });
})();
