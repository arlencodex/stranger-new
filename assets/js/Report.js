// Intersection Observer for scroll-reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Form submission handler
function handleSubmit() {
  const form = document.getElementById('reportForm');
  const selects = form.querySelectorAll('select[required]');
  const inputs = form.querySelectorAll('input[required]');
  const checkboxes = form.querySelectorAll('input[type="checkbox"][required]');
  let valid = true;

  selects.forEach(s => { if (!s.value) valid = false; });
  inputs.forEach(i => { if (i.type !== 'checkbox' && !i.value.trim()) valid = false; });
  checkboxes.forEach(c => { if (!c.checked) valid = false; });

  if (!valid) { alert('Please fill all required fields.'); return; }

  document.getElementById('successMsg').style.display = 'block';
  setTimeout(() => form.reset(), 300);
}