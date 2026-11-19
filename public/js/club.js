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

  function renderAll(selector, render, data) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), function (el) {
      render(el, data);
    });
  }

  function routeUrl(lines) {
    if (!lines || lines.length === 0) {
      return '';
    }
    return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(lines.join(', '));
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
      setHrefs('[data-club="facebook"]', data.facebook);
      setHrefs('[data-club="instagram"]', data.instagram);
      renderAll('[data-club="address"]', renderAddress, data.address);
      renderAll('[data-club="opening-hours"]', renderHours, data.openingHours);

      var destination = routeUrl(data.address);
      if (destination) {
        setHrefs('[data-club="route"]', destination);
        var mapImage = document.querySelector('[data-club="map-image"]');
        if (mapImage) {
          mapImage.alt = 'Mapa dojazdu: ' + data.address.join(', ');
        }
      }
    })
    .catch(function () {});
})();
