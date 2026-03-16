const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

function handleSubmit() {
  const form = document.getElementById('contactForm');
  const selects = form.querySelectorAll('select[required]');
  const textareas = form.querySelectorAll('textarea[required]');
  const checkboxes = form.querySelectorAll('input[type="checkbox"][required]');
  let valid = true;

  selects.forEach(s => { if (!s.value) valid = false; });
  textareas.forEach(t => { if (!t.value.trim()) valid = false; });
  checkboxes.forEach(c => { if (!c.checked) valid = false; });

  if (!valid) { alert('Please complete all required fields.'); return; }

  document.getElementById('successMsg').style.display = 'block';
  setTimeout(() => form.reset(), 300);
}
