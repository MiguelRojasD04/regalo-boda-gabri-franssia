/**
 * REGALO DE BODAS PARA GABRI & FRANSSIA
 * De: Trini y Miguel
 * Estilo: Minimalismo Editorial de Lujo
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const envelopeScreen = document.getElementById('envelope-screen');
  const weddingEnvelope = document.getElementById('wedding-envelope');
  const openGiftBtn = document.getElementById('open-gift-btn');
  const mainContent = document.getElementById('main-content');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');

  // Mobile Haptic helper
  function triggerHaptic(pattern = [35, 45]) {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch (e) {
      // Ignored
    }
  }

  // ==========================================================================
  // WEB AUDIO API - MINIMALIST AMBIENT CHORDS (PROCEDURAL)
  // ==========================================================================
  let audioCtx = null;
  let isSoundPlaying = false;
  let ambientInterval = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playWarmTone(freq, delay = 0, duration = 3.0, volume = 0.08) {
    if (!audioCtx) return;
    setTimeout(() => {
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {
        // Audio error handling
      }
    }, delay);
  }

  function playSubtleChime() {
    initAudio();
    if (!audioCtx) return;
    const notes = [440.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      playWarmTone(freq, idx * 80, 2.5, 0.1);
    });
  }

  const chords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [349.23, 440.00, 523.25, 659.25], // Fmaj7
    [196.00, 246.94, 293.66, 392.00], // G7
  ];
  let chordIdx = 0;

  function playNextChord() {
    if (!isSoundPlaying || !audioCtx) return;
    const chord = chords[chordIdx % chords.length];
    chord.forEach((freq, idx) => {
      playWarmTone(freq, idx * 300, 3.8, 0.035);
    });
    chordIdx++;
  }

  function startMusic() {
    initAudio();
    isSoundPlaying = true;
    soundToggleBtn.classList.add('playing');
    playNextChord();
    if (ambientInterval) clearInterval(ambientInterval);
    ambientInterval = setInterval(playNextChord, 4200);
  }

  function stopMusic() {
    isSoundPlaying = false;
    soundToggleBtn.classList.remove('playing');
    if (ambientInterval) clearInterval(ambientInterval);
  }

  soundToggleBtn.addEventListener('click', () => {
    triggerHaptic(20);
    if (isSoundPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });

  // ==========================================================================
  // UNBOXING / SEAL TAP & ENVELOPE OPENING ANIMATION
  // ==========================================================================
  openGiftBtn.addEventListener('click', () => {
    triggerHaptic([40, 50]);
    playSubtleChime();

    // Trigger physical envelope unfolding
    if (weddingEnvelope) {
      weddingEnvelope.classList.add('opening');
    }

    // Smoothly dissolve the cover screen
    setTimeout(() => {
      envelopeScreen.classList.add('opened');
      mainContent.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      startMusic();
    }, 450);
  });

  // ==========================================================================
  // PIN PROTECTION & ENCRYPTED GOOGLE DRIVE BONO REGALO
  // ==========================================================================
  // URL cifrada universalmente con SHA-256 (funciona al 100% en iOS Safari, HTTP, HTTPS y todos los dispositivos)
  const VOUCHER_SECURITY = {
    cipherHex: "06020b0d0b5a50060a501243144a081f4e53105f120718540b5f5f5a554f57580c1f575f5b041b5017536f230b7772617a59517d7f55415e0e505d2a5c5e405630686e4d644952045f7e49410d5c450f1444120b170a57410d5e5f"
  };

  function sha256Pure(ascii) {
    function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
    const mathPow = Math.pow, maxWord = mathPow(2, 32);
    let lengthProperty = 'length', i, j, result = '', words = [];
    const asciiBitLength = ascii[lengthProperty] * 8;
    let hash = [], k = [], primeCounter = 0, isComposite = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
        hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1/3) * maxWord) | 0;
      }
    }
    hash = hash.slice(0, 8);
    ascii += '\x80';
    while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
    for (i = 0; i < ascii[lengthProperty]; i++) {
      j = ascii.charCodeAt(i);
      words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
    words[words[lengthProperty]] = (asciiBitLength | 0);
    for (j = 0; j < words[lengthProperty];) {
      const w = words.slice(j, j += 16), oldHash = hash;
      hash = hash.slice(0, 8);
      for (i = 0; i < 64; i++) {
        const w15 = w[i - 15], w2 = w[i - 2];
        const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
        const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
        w[i] = (i < 16) ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0;
        const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
        const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
        const temp1 = (hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ch + k[i] + w[i]) | 0;
        const temp2 = ((rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + maj) | 0;
        hash = [(temp1 + temp2) | 0, hash[0], hash[1], hash[2], (hash[3] + temp1) | 0, hash[4], hash[5], hash[6]];
      }
      for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
    }
    for (i = 0; i < 8; i++) {
      for (j = 3; j >= 0; j--) {
        const b = (hash[i] >> (8 * j)) & 255;
        result += (b < 16 ? '0' : '') + b.toString(16);
      }
    }
    return result;
  }

  function deriveKey(pin, salt, iterations = 2000) {
    let key = pin + ':' + salt;
    for (let i = 0; i < iterations; i++) {
      key = sha256Pure(key + ':' + i);
    }
    return key;
  }

  /**
   * Convierte cualquier enlace o ID de Google Drive a enlace de descarga directa
   */
  function convertToGoogleDriveDirectDownload(url) {
    if (!url) return null;
    const trimmed = url.trim();

    // Si ya es un ID suelto
    if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) {
      return `https://drive.google.com/uc?export=download&id=${trimmed}`;
    }

    // Si es un enlace de drive.google.com
    const fileIdMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/id=([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);

    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
    }

    return trimmed;
  }

  /**
   * Descifra la URL del bono usando el PIN introducido
   */
  async function decryptVoucherWithPin(pin) {
    const cleanPin = (pin || '').replace(/\D/g, '').trim();
    if (!cleanPin) {
      throw new Error('PIN inválido');
    }

    const cipherHex = VOUCHER_SECURITY.cipherHex;
    const salt = 'BaezaVandelvira2026';
    const key = deriveKey(cleanPin, salt);
    let dec = '';

    for (let i = 0; i < cipherHex.length; i += 2) {
      const x = parseInt(cipherHex.substr(i, 2), 16);
      const kChar = key.charCodeAt((i / 2) % key.length);
      dec += String.fromCharCode(x ^ kChar);
    }

    const parts = dec.split(':');
    const check = parts[0];
    const url = parts.slice(1).join(':');

    if (!check || check !== sha256Pure('CHECK:' + url).slice(0, 8)) {
      throw new Error('PIN incorrecto');
    }

    return url;
  }

  // ==========================================================================
  // PIN MODAL UI INTERACTIONS & ATTEMPTS LIMIT
  // ==========================================================================
  const MAX_ATTEMPTS = 3;
  const LOCKOUT_SECONDS = 60;
  const STORAGE_KEY_ATTEMPTS = 'vandelvira_pin_attempts';
  const STORAGE_KEY_LOCKOUT = 'vandelvira_pin_lockout';

  let lockoutTimer = null;

  const downloadVoucherBtn = document.getElementById('download-voucher-btn');
  const pinModal = document.getElementById('pin-modal');
  const pinModalCard = pinModal ? pinModal.querySelector('.pin-modal-card') : null;
  const pinModalClose = document.getElementById('pin-modal-close');
  const pinForm = document.getElementById('pin-form');
  const pinInput = document.getElementById('pin-input');
  const pinErrorMsg = document.getElementById('pin-error-msg');
  const pinSubmitBtn = document.getElementById('pin-submit-btn');
  const attemptsCountEl = document.getElementById('attempts-count');
  const pinAttemptsInfo = document.getElementById('pin-attempts-info');

  function getAttemptsCount() {
    return parseInt(sessionStorage.getItem(STORAGE_KEY_ATTEMPTS) || '0', 10);
  }

  function getRemainingAttempts() {
    return Math.max(0, MAX_ATTEMPTS - getAttemptsCount());
  }

  function getLockoutRemainingMs() {
    const lockoutUntil = parseInt(sessionStorage.getItem(STORAGE_KEY_LOCKOUT) || '0', 10);
    const diff = lockoutUntil - Date.now();
    return diff > 0 ? diff : 0;
  }

  function updateAttemptsUI() {
    const remaining = getRemainingAttempts();
    if (attemptsCountEl) {
      attemptsCountEl.textContent = String(remaining);
    }
    if (pinAttemptsInfo) {
      if (remaining <= 1) {
        pinAttemptsInfo.classList.add('warning');
      } else {
        pinAttemptsInfo.classList.remove('warning');
      }
    }
  }

  function startLockoutCountdown() {
    if (lockoutTimer) clearInterval(lockoutTimer);

    function tick() {
      const msLeft = getLockoutRemainingMs();
      if (msLeft <= 0) {
        clearInterval(lockoutTimer);
        lockoutTimer = null;
        sessionStorage.removeItem(STORAGE_KEY_LOCKOUT);
        sessionStorage.removeItem(STORAGE_KEY_ATTEMPTS);

        if (pinInput) {
          pinInput.disabled = false;
          pinInput.classList.remove('error');
          pinInput.value = '';
          pinInput.focus();
        }
        if (pinSubmitBtn) {
          pinSubmitBtn.disabled = false;
          pinSubmitBtn.innerHTML = `
            <span>Desbloquear y Descargar</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          `;
        }
        updateAttemptsUI();
        if (pinErrorMsg) {
          pinErrorMsg.textContent = 'Intentos restablecidos. Ya puedes volver a probar.';
          pinErrorMsg.classList.remove('success');
        }
        return;
      }

      const secLeft = Math.ceil(msLeft / 1000);
      if (pinInput) {
        pinInput.disabled = true;
        pinInput.classList.add('error');
      }
      if (pinSubmitBtn) {
        pinSubmitBtn.disabled = true;
        pinSubmitBtn.innerHTML = `<span>Bloqueado (${secLeft}s)</span>`;
      }
      if (pinErrorMsg) {
        pinErrorMsg.textContent = `Has agotado los ${MAX_ATTEMPTS} intentos. Espera ${secLeft}s para volver a probar.`;
        pinErrorMsg.classList.remove('success');
      }
      updateAttemptsUI();
    }

    tick();
    lockoutTimer = setInterval(tick, 1000);
  }

  const pinViewInput = document.getElementById('pin-view-input');
  const pinViewSuccess = document.getElementById('pin-view-success');
  const btnOpenVoucher = document.getElementById('btn-open-voucher');
  const btnDirectDownload = document.getElementById('btn-direct-download');

  function markTicketAsUnlocked(url) {
    if (!downloadVoucherBtn) return;
    downloadVoucherBtn.classList.add('unlocked');
    downloadVoucherBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
      <span>Ver Bono Regalo (Desbloqueado)</span>
    `;
  }

  // Si ya se desbloqueó anteriormente en esta sesión
  const savedUnlockedUrl = sessionStorage.getItem('vandelvira_voucher_url');
  if (savedUnlockedUrl) {
    markTicketAsUnlocked(savedUnlockedUrl);
  }

  function openPinModal() {
    const savedUrl = sessionStorage.getItem('vandelvira_voucher_url');

    if (!pinModal) return;
    pinModal.classList.add('active');
    pinModal.setAttribute('aria-hidden', 'false');

    if (savedUrl) {
      // Mostrar directamente la vista desbloqueada
      if (pinViewInput) pinViewInput.classList.add('hidden');
      if (pinViewSuccess) pinViewSuccess.classList.remove('hidden');
      if (btnOpenVoucher) btnOpenVoucher.href = savedUrl;
      if (btnDirectDownload) btnDirectDownload.href = convertToGoogleDriveDirectDownload(savedUrl);
      return;
    }

    // Mostrar formulario de PIN
    if (pinViewInput) pinViewInput.classList.remove('hidden');
    if (pinViewSuccess) pinViewSuccess.classList.add('hidden');

    const msLeft = getLockoutRemainingMs();
    if (msLeft > 0) {
      startLockoutCountdown();
    } else {
      if (sessionStorage.getItem(STORAGE_KEY_LOCKOUT)) {
        sessionStorage.removeItem(STORAGE_KEY_LOCKOUT);
        sessionStorage.removeItem(STORAGE_KEY_ATTEMPTS);
      }
      if (pinInput) {
        pinInput.disabled = false;
        pinInput.value = '';
        pinInput.classList.remove('error', 'success');
        setTimeout(() => pinInput.focus(), 150);
      }
      if (pinErrorMsg) {
        pinErrorMsg.textContent = '';
        pinErrorMsg.classList.remove('success');
      }
      if (pinSubmitBtn) {
        pinSubmitBtn.disabled = false;
        pinSubmitBtn.innerHTML = `
          <span>Desbloquear y Descargar</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        `;
      }
      updateAttemptsUI();
    }
  }

  function closePinModal() {
    if (!pinModal) return;
    pinModal.classList.remove('active');
    pinModal.setAttribute('aria-hidden', 'true');
    if (pinInput) pinInput.blur();
  }

  if (downloadVoucherBtn) {
    downloadVoucherBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerHaptic(30);
      const savedUrl = sessionStorage.getItem('vandelvira_voucher_url');
      if (savedUrl) {
        // Si ya está desbloqueado, abrir directamente en pestaña nueva
        window.open(savedUrl, '_blank');
        return;
      }
      openPinModal();
    });
  }

  if (pinModalClose) {
    pinModalClose.addEventListener('click', () => {
      triggerHaptic(20);
      closePinModal();
    });
  }

  if (pinModal) {
    pinModal.addEventListener('click', (e) => {
      if (e.target === pinModal) {
        closePinModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pinModal && pinModal.classList.contains('active')) {
      closePinModal();
    }
  });

  if (pinForm) {
    pinForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (getLockoutRemainingMs() > 0) {
        return;
      }

      const enteredPin = (pinInput ? pinInput.value : '').replace(/\D/g, '').trim();

      if (!enteredPin) {
        if (pinInput) pinInput.focus();
        return;
      }

      triggerHaptic(25);
      if (pinSubmitBtn) {
        pinSubmitBtn.disabled = true;
        pinSubmitBtn.innerHTML = '<span>Verificando...</span>';
      }
      if (pinErrorMsg) {
        pinErrorMsg.textContent = '';
        pinErrorMsg.classList.remove('success');
      }

      try {
        const decryptedUrl = await decryptVoucherWithPin(enteredPin);

        // ¡PIN correcto! Guardar en sesión para no pedirlo de nuevo
        sessionStorage.removeItem(STORAGE_KEY_ATTEMPTS);
        sessionStorage.removeItem(STORAGE_KEY_LOCKOUT);
        sessionStorage.setItem('vandelvira_voucher_url', decryptedUrl);

        if (lockoutTimer) {
          clearInterval(lockoutTimer);
          lockoutTimer = null;
        }
        updateAttemptsUI();

        triggerHaptic([30, 40, 60]);

        const viewUrl = decryptedUrl;
        const directUrl = convertToGoogleDriveDirectDownload(decryptedUrl);

        // Configurar enlaces directos
        if (btnOpenVoucher) btnOpenVoucher.href = viewUrl;
        if (btnDirectDownload) btnDirectDownload.href = directUrl;

        // Cambiar inmediatamente a la vista de éxito
        if (pinViewInput) pinViewInput.classList.add('hidden');
        if (pinViewSuccess) pinViewSuccess.classList.remove('hidden');

        // Actualizar el botón principal del ticket
        markTicketAsUnlocked(viewUrl);

      } catch (err) {
        console.error('Error al verificar PIN:', err);
        // PIN incorrecto: registrar intento fallido
        triggerHaptic([60, 40, 60]);
        const currentAttempts = getAttemptsCount() + 1;
        sessionStorage.setItem(STORAGE_KEY_ATTEMPTS, String(currentAttempts));

        if (pinModalCard) {
          pinModalCard.classList.remove('shake');
          void pinModalCard.offsetWidth; // trigger reflow
          pinModalCard.classList.add('shake');
        }

        const remaining = Math.max(0, MAX_ATTEMPTS - currentAttempts);

        if (remaining <= 0) {
          // Bloqueo temporal por agotar intentos
          const lockoutUntil = Date.now() + LOCKOUT_SECONDS * 1000;
          sessionStorage.setItem(STORAGE_KEY_LOCKOUT, String(lockoutUntil));
          startLockoutCountdown();
        } else {
          if (pinInput) {
            pinInput.classList.add('error');
            pinInput.value = '';
            pinInput.focus();
          }
          if (pinErrorMsg) {
            pinErrorMsg.textContent = remaining === 1
              ? 'Código incorrecto. ¡Atención: te queda 1 intento!'
              : `Código incorrecto. Te quedan ${remaining} intentos.`;
            pinErrorMsg.classList.remove('success');
          }
          if (pinSubmitBtn) {
            pinSubmitBtn.disabled = false;
            pinSubmitBtn.innerHTML = `
              <span>Desbloquear y Descargar</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            `;
          }
          updateAttemptsUI();
        }
      }
    });
  }

  // ==========================================================================
  // VALIDITY COUNTDOWN (1 AÑO DESDE HOY: HASTA 2 DE OCTUBRE DE 2027)
  // ==========================================================================
  const EXPIRATION_DATE = new Date('2027-10-02T23:59:59');

  function updateCountdown() {
    const now = new Date();
    const diff = EXPIRATION_DATE - now;

    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    if (!daysEl) return;

    if (diff <= 0) {
      daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days);
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
});
