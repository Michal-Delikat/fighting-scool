(function () {
  var mapRoot = document.querySelector('[data-map-query]');
  var mapQuery = mapRoot ? mapRoot.getAttribute('data-map-query') : '';

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

  function renderAddressInline(el, lines) {
    if (!el || !lines || lines.length === 0) {
      return;
    }
    el.textContent = lines.join(', ');
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

  function initMap() {
    if (!mapRoot || !mapQuery) {
      return;
    }
    var container = mapRoot.querySelector('.dojazd__map');
    var button = mapRoot.querySelector('[data-map-load]');
    var fallback = mapRoot.querySelector('.dojazd__map-fallback');
    if (fallback) {
      fallback.hidden = true;
    }
    if (!container || !button) {
      return;
    }
    button.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps?q=' + encodeURIComponent(mapQuery) + '&output=embed&hl=pl';
      iframe.title = 'Mapa dojazdu do klubu';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.allowFullscreen = true;
      iframe.setAttribute('style', 'border:0');
      iframe.width = '100%';
      iframe.height = '100%';
      container.textContent = '';
      container.appendChild(iframe);
      iframe.focus();
      iframe.addEventListener('load', function () {
        iframe.focus();
      });
    });
  }

  initMap();

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
      renderAll('[data-club="address-inline"]', renderAddressInline, data.address);
      renderAll('[data-club="opening-hours"]', renderHours, data.openingHours);

      var destination = mapQuery
        ? 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(mapQuery)
        : routeUrl(data.address);
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
