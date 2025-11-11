/* ======================
   SouthFeet - main.js
   Handles:
   - mobile menu toggle
   - fade-in on-scroll
   - smooth anchor scrolling
   - contact form submission (Formspree)
   - active nav highlighting
   ====================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------ Mobile menu toggle ------------ */
  const menuToggle = document.getElementById('menu-toggle');
  const navbar = document.getElementById('navbar');

  if (menuToggle && navbar) {
    menuToggle.addEventListener('click', () => {
      navbar.classList.toggle('open');
    });
  }

  /* ------------ Fade-in on scroll ------------ */
  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = {
    threshold: 0.12,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function(entries, observer){
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(f => appearOnScroll.observe(f));

  /* ------------ Smooth scroll for same-page anchors ------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      const y = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ------------ Smooth-ish scroll for page links to same site (optional) ------------ */
  // (Preserves default behavior for external links)
  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    // Optional: do nothing — keep normal navigation so server handles page load.
  });

  /* ------------ Set active nav item based on current URL ------------ */
  const navLinks = document.querySelectorAll('.navbar a[href]');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (href === currentPath) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });

  /* ------------ Contact form handler (Formspree) ------------ */
  // expects <form id="contactForm" action="https://formspree.io/f/XXXXX" method="POST"> ... </form>
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // simple validation
      const name = (contactForm.querySelector('[name="name"]') || {}).value || '';
      const email = (contactForm.querySelector('[name="email"]') || {}).value || '';
      const message = (contactForm.querySelector('[name="message"]') || {}).value || '';

      if (!name.trim() || !email.trim() || !message.trim()) {
        if (formStatus) {
          formStatus.textContent = 'Please fill in all fields.';
          formStatus.style.color = '#ff6666';
        } else {
          alert('Please fill in all fields.');
        }
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]') || contactForm.querySelector('button');
      const originalText = submitBtn ? submitBtn.textContent : null;
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' }
        });

        if (res.ok) {
          if (formStatus) {
            formStatus.textContent = ' Thank you — we received your message.';
            formStatus.style.color = '#7fe57f';
          } else {
            alert('Thank you — we received your message.');
          }
          contactForm.reset();
        } else {
          const text = await res.text();
          if (formStatus) {
            formStatus.textContent = ' Submission failed. Please try again.';
            formStatus.style.color = '#ff6666';
          } else {
            alert('Submission failed. Please try again.');
          }
          console.warn('Formspree response:', res.status, text);
        }
      } catch (err) {
        if (formStatus) {
          formStatus.textContent = ' Network error. Check your connection.';
          formStatus.style.color = '#ffcc66';
        } else {
          alert('Network error. Check your connection.');
        }
        console.error(err);
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText || 'Send Message'; }
      }
    });
  }

});