(function formsModule() {
  const $ = (s, c=document)=>c.querySelector(s);

  const contactForm = $('#contactForm');
  if (contactForm) {
    const nameEl = $('#contactName', contactForm);
    const emailEl = $('#contactEmail', contactForm);
    const phoneEl = $('#contactPhone', contactForm);
    const msgEl = $('#contactMessage', contactForm);

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.classList.add('was-validated');
        return;
      }
      const payload = {
        nombre: nameEl.value.trim(),
        email: emailEl.value.trim(),
        telefono: phoneEl.value.trim(),
        mensaje: msgEl.value.trim(),
        fecha: new Date().toISOString()
      };
      const KEY = 'dlab_messages';
      const list = JSON.parse(localStorage.getItem(KEY) || '[]');
      list.push(payload);
      localStorage.setItem(KEY, JSON.stringify(list));

      alert('✅ ¡Gracias por tu mensaje! Te responderemos pronto.');
      contactForm.reset();
      contactForm.classList.remove('was-validated');
    });

    phoneEl?.addEventListener('input', () => {
      phoneEl.value = phoneEl.value.replace(/[^\d+\s()-]/g, '');
    });
  }

  const regForm = $('#registerForm');
  if (regForm) {
    const nameEl  = $('#regName', regForm);
    const lastEl  = $('#regLast', regForm);
    const emailEl = $('#regEmail', regForm);
    const phoneEl = $('#regPhone', regForm);
    const pass1El = $('#regPass', regForm);
    const pass2El = $('#regPass2', regForm);
    const addrEl  = $('#regAddress', regForm);
    const termsEl = $('#regTerms', regForm);

    const validatePasswords = () => {
      const ok = pass1El.value.length >= 8 && pass1El.value === pass2El.value;
      pass2El.setCustomValidity(ok ? '' : 'Las contraseñas no coinciden o tienen menos de 8 caracteres');
    };
    ['input','blur'].forEach(evt => {
      pass1El?.addEventListener(evt, validatePasswords);
      pass2El?.addEventListener(evt, validatePasswords);
    });

    phoneEl?.addEventListener('input', () => {
      phoneEl.value = phoneEl.value.replace(/[^\d+\s()-]/g, '');
    });

    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      validatePasswords();
      if (!regForm.checkValidity()) {
        regForm.classList.add('was-validated');
        return;
      }
      if (!termsEl.checked) {
        alert('⚠️ Debés aceptar los términos para continuar.');
        termsEl.focus();
        return;
      }

      const user = {
        nombre: nameEl.value.trim(),
        apellido: lastEl.value.trim(),
        email: emailEl.value.trim().toLowerCase(),
        telefono: phoneEl.value.trim(),
        direccion: (addrEl?.value || '').trim(),
        pass: pass1El.value,
        createdAt: new Date().toISOString()
      };

      const KEY = 'dlab_users';
      const users = JSON.parse(localStorage.getItem(KEY) || '[]');
      const exists = users.some(u => u.email === user.email);
      if (exists) {
        alert('⚠️ Ya existe un usuario con este email.');
        return;
      }

      users.push(user);
      localStorage.setItem(KEY, JSON.stringify(users));

      if (confirm('✅ Registro exitoso. ¿Querés ir al inicio?')) {
        window.location.href = '../index.html';
      } else {
        regForm.reset();
        regForm.classList.remove('was-validated');
      }
    });
  }

  const newsForm = $('#newsletterForm');
  if (newsForm) {
    const emailEl = $('#newsEmail', newsForm);
    const freqEl  = $('#newsFreq', newsForm);
    const consEl  = $('#newsConsent', newsForm);

    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!newsForm.checkValidity()) {
        newsForm.classList.add('was-validated');
        return;
      }
      if (!consEl.checked) {
        if (!confirm('No marcaste consentimiento. ¿Confirmás igualmente la suscripción?')) {
          return;
        }
      }

      const sub = {
        email: (emailEl.value || '').trim().toLowerCase(),
        frecuencia: freqEl.value,
        consent: !!consEl.checked,
        createdAt: new Date().toISOString()
      };

      const KEY = 'dlab_news_subs';
      const subs = JSON.parse(localStorage.getItem(KEY) || '[]');
      const exists = subs.some(s => s.email === sub.email);
      if (exists) {
        alert('⚠️ Ese email ya está suscripto.');
        return;
      }

      subs.push(sub);
      localStorage.setItem(KEY, JSON.stringify(subs));

      alert('✅ ¡Suscripción registrada! Te enviaremos novedades.');
      newsForm.reset();
      newsForm.classList.remove('was-validated');
    });
  }
})();