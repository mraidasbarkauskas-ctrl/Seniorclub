document.addEventListener('DOMContentLoaded', function () {
  var burger = document.querySelector('.burger');
  var navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    var setOpen = function (open) {
      navLinks.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-open', open);
    };
    burger.addEventListener('click', function () {
      setOpen(!navLinks.classList.contains('open'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) setOpen(false);
    });
    // Close the panel after choosing a real page link on mobile
    navLinks.querySelectorAll('a[href]').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.innerWidth <= 1080 && !a.parentElement.classList.contains('nav-dropdown')) setOpen(false);
      });
    });
  }

  // Mobile-friendly dropdown toggle (tap to open on small screens)
  document.querySelectorAll('.nav-dropdown > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 1080) {
        e.preventDefault();
        link.parentElement.classList.toggle('open');
      }
    });
  });

  // Contact form(s): real submission via the form's own action endpoint
  // (Formspree — see README for setup), with an accessible success/error
  // state instead of a fake mailto link.
  document.querySelectorAll('form.real-contact-form').forEach(function (contactForm) {
    var submitBtn = contactForm.querySelector('button[type="submit"]');
    var success = contactForm.querySelector('.form-success');
    var error = contactForm.querySelector('.form-error');

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot: if this hidden field got filled in, silently drop it
      // (bots fill every field; real visitors never see or touch it).
      var honeypot = contactForm.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value) return;

      if (error) { error.classList.remove('show'); }
      if (success) { success.classList.remove('show'); }
      if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.add('is-loading'); }

      var formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          contactForm.reset();
          if (success) { success.classList.add('show'); success.focus(); }
        } else {
          if (error) { error.classList.add('show'); error.focus(); }
        }
      }).catch(function () {
        if (error) { error.classList.add('show'); error.focus(); }
      }).finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('is-loading'); }
      });
    });
  });
});

// Preselect form interest from ?aihe=laheinen (used by the Läheisille page CTA)
document.addEventListener('DOMContentLoaded', function () {
  try {
    var q = new URLSearchParams(window.location.search).get('aihe');
    var sel = document.getElementById('f-interest');
    if (q && sel) { sel.value = q; }
  } catch (e) {}
});
