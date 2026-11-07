(function () {
  var hero = document.querySelector('.hero');
  var video = hero ? hero.querySelector('video') : null;
  var isMobile = window.matchMedia('(max-width: 768px)').matches;
  var base = isMobile ? 'video/hero-mobile' : 'video/hero';
  var poster = isMobile ? 'video/hero-mobile-poster.jpg' : 'video/hero-poster.jpg';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);

  if (reduceMotion || saveData) {
    if (video) {
      video.remove();
    }
    if (hero) {
      hero.style.backgroundImage = 'url("' + poster + '")';
      hero.style.backgroundSize = 'cover';
      hero.style.backgroundPosition = isMobile ? 'center' : '65% center';
    }
  } else if (video) {
    video.poster = poster;
    video.src = video.canPlayType('video/webm') ? base + '.webm' : base + '.mp4';
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  var header = document.querySelector('.site-header');

  function closeMenu() {
    if (!toggle || !nav) {
      return;
    }
    nav.removeAttribute('data-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (header && header.classList.contains('is-menu-open')) {
      header.style.transition = 'none';
      header.classList.remove('is-menu-open');
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(function () {
          header.style.transition = '';
        });
      }
    }
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.getAttribute('data-open') === 'true';
      if (isOpen) {
        closeMenu();
      } else {
        nav.setAttribute('data-open', 'true');
        toggle.setAttribute('aria-expanded', 'true');
        if (header) {
          header.classList.add('is-menu-open');
        }
      }
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });
  }

  var SCROLL_THRESHOLD = 50;

  function updateHeader() {
    if (!header) {
      return;
    }
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
})();
