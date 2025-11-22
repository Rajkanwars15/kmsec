// app.js — theme, menu, form handling, small helpers

/* THEME */
function setTheme(theme){
  document.body.classList.remove('light-mode','dark-mode');
  document.body.classList.add(theme);
  const icon = document.getElementById('themeIcon');
  if(icon) icon.textContent = theme === 'dark-mode' ? '🌙' : '☀️';
  const btn = document.getElementById('themeToggle');
  if(btn) btn.setAttribute('aria-pressed', theme === 'dark-mode');
  localStorage.setItem('theme', theme);
}

function initTheme(){
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if(saved) setTheme(saved);
  else setTheme(prefersDark ? 'dark-mode' : 'light-mode');
}

function toggleTheme(){
  const isLight = document.body.classList.contains('light-mode');
  setTheme(isLight ? 'dark-mode' : 'light-mode');
}

/* MOBILE MENU */
function toggleMenu(){
  const nav = document.getElementById('navContent');
  const btn = document.getElementById('mobileMenuBtn');
  if(!nav || !btn) return;
  const isActive = nav.classList.toggle('active');
  btn.setAttribute('aria-expanded', String(isActive));
}

function closeMenu(){
  const nav = document.getElementById('navContent');
  const btn = document.getElementById('mobileMenuBtn');
  if(!nav || !btn) return;
  nav.classList.remove('active');
  btn.setAttribute('aria-expanded','false');
}

/* CONTACT FORM */
async function handleSubmit(e){
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if(status){ status.hidden = false; status.textContent = 'Sending…'; status.style.color = ''; }

  const data = {
    name: (form.name && form.name.value || document.getElementById('name').value || '').trim(),
    email: (form.email && form.email.value || document.getElementById('email').value || '').trim(),
    phone: (form.phone && form.phone.value || document.getElementById('phone').value || '').trim(),
    company: (form.company && form.company.value || document.getElementById('company').value || '').trim(),
    message: (form.message && form.message.value || document.getElementById('message').value || '').trim()
  };

  if(!data.name || !data.email || !data.phone || !data.message){
    if(status){ status.textContent = 'Please fill all required fields.'; status.style.color = 'crimson'; }
    return;
  }

  // Try to POST to /api/contact — replace with your backend. Fallback opens mail client.
  try{
    const res = await fetch('/api/contact', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });

    if(res.ok){
      if(status){ status.textContent = 'Request sent. We will contact you shortly.'; status.style.color = 'limegreen'; }
      form.reset();
    } else throw new Error('Server error '+res.status);
  } catch(err){
    // fallback: mailto
    const subject = encodeURIComponent('KM Security Consultation — ' + data.name);
    const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nCompany: ${data.company}\n\n${data.message}`);
    window.location.href = `mailto:contact@example.com?subject=${subject}&body=${body}`;
    if(status){ status.textContent = 'Unable to send via site — opening your mail client as fallback.'; status.style.color = 'orange'; }
    form.reset();
  }
}

/* INIT UI */
function initUI(){
  const mobileBtn = document.getElementById('mobileMenuBtn');
  if(mobileBtn) mobileBtn.addEventListener('click', toggleMenu);

  const themeBtn = document.getElementById('themeToggle');
  if(themeBtn) themeBtn.addEventListener('click', toggleTheme);

  const contactForm = document.getElementById('contactForm');
  if(contactForm) contactForm.addEventListener('submit', handleSubmit);

  const scrollBtn = document.getElementById('scrollServices');
  if(scrollBtn) scrollBtn.addEventListener('click', ()=> {
    const el = document.getElementById('services');
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    closeMenu();
  });

  document.addEventListener('keydown', (ev)=> {
    if(ev.key === 'Escape') closeMenu();
  });

  // footer year
  const fy = document.getElementById('footerYear');
  if(fy) fy.textContent = new Date().getFullYear();
}

window.addEventListener('DOMContentLoaded', ()=> {
  initTheme();
  initUI();
  document.getElementById("navContent").classList.add("ready");
});
