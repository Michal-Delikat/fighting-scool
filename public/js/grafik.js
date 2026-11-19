(function () {
  var section = document.querySelector('.grafik');
  if (!section) {
    return;
  }

  var daysEl = section.querySelector('.grafik__days');
  var disciplineRoot = section.querySelector('[data-filter="discipline"]');
  var groupRoot = section.querySelector('[data-filter="group"]');

  var state = {
    discipline: '',
    group: ''
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
    time.textContent = entry.start + '–' + entry.end;

    var discipline = document.createElement('span');
    discipline.className = 'grafik__discipline';
    discipline.textContent = entry.discipline;

    var meta = document.createElement('span');
    meta.className = 'grafik__meta';

    var group = document.createElement('span');
    group.className = 'grafik__group';
    group.textContent = 'Gr. ' + entry.group;

    meta.appendChild(group);

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

      if (visible.length > 0) {
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

    daysEl.classList.add('is-all');
  }

  function createChips(root, options, getValue, onSelect) {
    var container = root.querySelector('.grafik__chips');
    var buttons = [];

    function setValue(value) {
      buttons.forEach(function (button) {
        button.setAttribute('aria-pressed', button.getAttribute('data-value') === value ? 'true' : 'false');
      });
      onSelect(value);
    }

    options.forEach(function (option) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'grafik__chip';
      button.setAttribute('data-value', option.value);
      button.setAttribute('aria-pressed', option.value === getValue() ? 'true' : 'false');
      button.textContent = option.label;
      button.addEventListener('click', function () {
        setValue(option.value === getValue() ? '' : option.value);
      });
      container.appendChild(button);
      buttons.push(button);
    });
  }

  function initFilters() {
    var disciplineOptions = [{ value: '', label: 'Wszystkie' }];
    data.disciplines.forEach(function (name) {
      disciplineOptions.push({ value: name, label: name });
    });

    createChips(disciplineRoot, disciplineOptions, function () {
      return state.discipline;
    }, function (value) {
      state.discipline = value;
      applyFilters();
    });

    createChips(groupRoot, [
      { value: '', label: 'Wszystkie' },
      { value: 'początkująca', label: 'Początkująca' },
      { value: 'mieszana', label: 'Mieszana' },
      { value: 'zaawansowana', label: 'Zaawansowana' }
    ], function () {
      return state.group;
    }, function (value) {
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
      renderDays();
    })
    .catch(function () {
      daysEl.textContent = 'Nie udało się wczytać grafiku.';
    });
})();
