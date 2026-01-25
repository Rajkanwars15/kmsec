// app.js — theme, menu, form handling, small helpers

/* THEME */
function setTheme(theme){
  document.body.classList.remove('light-mode','dark-mode');
  document.body.classList.add(theme);
  const icon = document.getElementById('themeIcon');
  if(icon) {
    icon.className = theme === 'dark-mode' ? 'fas fa-moon' : 'fas fa-sun';
  }
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
// Initialize EmailJS (if available)
function initEmailJS(){
  if(typeof emailjs !== 'undefined'){
    // EmailJS is loaded - you can initialize with your public key here if needed
    // emailjs.init("YOUR_PUBLIC_KEY"); // Uncomment and add your EmailJS public key
  }
}

async function handleSubmit(e){
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if(status){ 
    status.hidden = false; 
    status.textContent = 'Sending…'; 
    status.style.color = ''; 
    status.style.background = 'rgba(255,255,255,0.1)';
  }

  const data = {
    name: (form.name && form.name.value || document.getElementById('name').value || '').trim(),
    email: (form.email && form.email.value || document.getElementById('email').value || '').trim(),
    phone: (form.phone && form.phone.value || document.getElementById('phone').value || '').trim(),
    company: (form.company && form.company.value || document.getElementById('company').value || '').trim(),
    message: (form.message && form.message.value || document.getElementById('message').value || '').trim()
  };

  if(!data.name || !data.email || !data.phone || !data.message){
    if(status){ 
      status.textContent = 'Please fill all required fields.'; 
      status.style.color = 'crimson'; 
      status.style.background = 'rgba(220,20,60,0.1)';
    }
    return;
  }

  // Try EmailJS first (if configured)
  if(typeof emailjs !== 'undefined' && window.EMAILJS_SERVICE_ID && window.EMAILJS_TEMPLATE_ID){
    try{
      await emailjs.send(
        window.EMAILJS_SERVICE_ID,
        window.EMAILJS_TEMPLATE_ID,
        {
          from_name: data.name,
          from_email: data.email,
          phone: data.phone,
          company: data.company || 'Not provided',
          message: data.message,
          to_email: 'ceo.kmsa@gmail.com'
        }
      );
      if(status){ 
        status.textContent = 'Message sent successfully! We will contact you shortly.'; 
        status.style.color = 'limegreen'; 
        status.style.background = 'rgba(50,205,50,0.1)';
      }
      form.reset();
      return;
    } catch(err){
      console.error('EmailJS error:', err);
      // Fall through to mailto
    }
  }

  // Try backend API
  try{
    const res = await fetch('/api/contact', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });

    if(res.ok){
      if(status){ 
        status.textContent = 'Message sent successfully! We will contact you shortly.'; 
        status.style.color = 'limegreen'; 
        status.style.background = 'rgba(50,205,50,0.1)';
      }
      form.reset();
      return;
    } else throw new Error('Server error '+res.status);
  } catch(err){
    // Final fallback: mailto to ceo.kmsa@gmail.com
    const subject = encodeURIComponent('KM Security Inquiry — ' + data.name);
    const body = encodeURIComponent(
      `Name: ${data.name}\n` +
      `Email: ${data.email}\n` +
      `Phone: ${data.phone}\n` +
      `Company: ${data.company || 'Not provided'}\n\n` +
      `Message:\n${data.message}`
    );
    window.location.href = `mailto:ceo.kmsa@gmail.com?subject=${subject}&body=${body}`;
    if(status){ 
      status.textContent = 'Opening your email client. Please send the message to ceo.kmsa@gmail.com'; 
      status.style.color = 'orange'; 
      status.style.background = 'rgba(255,165,0,0.1)';
    }
    // Don't reset form in case user wants to review before sending
    setTimeout(() => {
      form.reset();
    }, 3000);
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
  initEmailJS();
  document.getElementById("navContent").classList.add("ready");
});
