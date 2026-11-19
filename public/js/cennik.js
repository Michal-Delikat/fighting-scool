(function () {
  var section = document.querySelector('.cennik');
  if (!section) {
    return;
  }

  var chips = section.querySelectorAll('.cennik__chip');
  if (chips.length === 0) {
    return;
  }

  function setCategory(value) {
    section.setAttribute('data-category', value);
    Array.prototype.forEach.call(chips, function (chip) {
      chip.setAttribute('aria-pressed', chip.getAttribute('data-category') === value ? 'true' : 'false');
    });
  }

  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener('click', function () {
      setCategory(chip.getAttribute('data-category'));
    });
  });

  setCategory('normalny');
})();
