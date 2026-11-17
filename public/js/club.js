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
      renderAddress(document.querySelector('[data-club="address"]'), data.address);
    })
    .catch(function () {});
})();
