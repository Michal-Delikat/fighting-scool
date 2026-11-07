(function () {
  function setText(selector, value) {
    if (!value) {
      return;
    }
    Array.prototype.forEach.call(document.querySelectorAll(selector), function (el) {
      el.textContent = value;
    });
  }

  function setHrefs(selector, value) {
    if (!value) {
      return;
    }
    Array.prototype.forEach.call(document.querySelectorAll(selector), function (el) {
      el.href = value;
    });
  }

  function setPhone(value) {
    if (!value) {
      return;
    }
    var href = 'tel:' + value.replace(/[^\d+]/g, '');
    Array.prototype.forEach.call(document.querySelectorAll('[data-club="phone"]'), function (el) {
      el.textContent = value;
      el.href = href;
    });
  }

  function renderAddress(el, lines) {
    if (!el || !lines || lines.length === 0) {
      return;
    }
    el.textContent = '';
    lines.forEach(function (line, index) {
      if (index > 0) {
        el.appendChild(document.createElement('br'));
      }
      el.appendChild(document.createTextNode(line));
    });
  }

  function renderHours(el, entries) {
    if (!el || !entries || entries.length === 0) {
      return;
    }
    el.textContent = '';
    entries.forEach(function (entry) {
      var p = document.createElement('p');
      p.textContent = entry.label + ' ' + entry.hours;
      el.appendChild(p);
    });
  }

  fetch('data/club.json')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      setText('[data-club="h1"]', data.h1);
      setText('[data-club="slogan"]', data.slogan);
      setPhone(data.phone);
      setHrefs('[data-club="facebook"]', data.facebook);
      setHrefs('[data-club="instagram"]', data.instagram);
      renderAddress(document.querySelector('[data-club="address"]'), data.address);
      renderHours(document.querySelector('[data-club="opening-hours"]'), data.openingHours);
    })
    .catch(function () {});
})();
