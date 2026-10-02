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
  // La URL del bono está cifrada mediante AES-256-GCM y PBKDF2 (SHA-256).
  const VOUCHER_SECURITY = {
    encryptedPayload: {
      s: "4oMH6Ve8vpPmYeBaHjrhRA==",
      iv: "XcSNcDEhX92CRxfS",
      ct: "PkjoH+ghU3I7SD5+RITRos7XLaRYLtc218svPHulbMhed3AGfyNCibGPyKe6ipmnttIwgzvhbwHQ0MQq4shw8Dk+XxnvWNiwAtHjZl+zsjKhL2jsheSTYaKQJ+ckSAXswq8="
    }
  };

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
   * Descifra la URL del bono usando el PIN introducido (Web Crypto API AES-GCM)
   */
  async function decryptVoucherWithPin(pin) {
    const { s, iv, ct } = VOUCHER_SECURITY.encryptedPayload;
    if (!s || !iv || !ct) {
      throw new Error('Payload no configurado');
    }

    const enc = new TextEncoder();
    const salt = Uint8Array.from(atob(s), c => c.charCodeAt(0));
    const ivBytes = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
    const ciphertext = Uint8Array.from(atob(ct), c => c.charCodeAt(0));

    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(pin.trim()),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivBytes },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  }

  /**
   * Utilidad para cifrar cualquier nueva URL con cualquier PIN (accesible desde consola)
   */
  window.generarCifradoBono = async function (url, pin) {
    const enc = new TextEncoder();
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(pin.trim()),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    const ct = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      enc.encode(url.trim())
    );

    function toB64(buf) {
      return btoa(String.fromCharCode(...new Uint8Array(buf)));
    }

    const resultado = {
      s: toB64(salt),
      iv: toB64(iv),
      ct: toB64(ct)
    };

    console.log('Objeto cifrado para app.js:', JSON.stringify(resultado, null, 2));
    return resultado;
  };

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

  function openPinModal() {
    if (!pinModal) return;
    pinModal.classList.add('active');
    pinModal.setAttribute('aria-hidden', 'false');

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

      const enteredPin = (pinInput ? pinInput.value : '').trim();

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

        // ¡PIN correcto! Limpiar intentos y estado de bloqueo
        sessionStorage.removeItem(STORAGE_KEY_ATTEMPTS);
        sessionStorage.removeItem(STORAGE_KEY_LOCKOUT);
        if (lockoutTimer) {
          clearInterval(lockoutTimer);
          lockoutTimer = null;
        }
        updateAttemptsUI();

        triggerHaptic([30, 40, 60]);
        if (pinInput) {
          pinInput.classList.remove('error');
          pinInput.classList.add('success');
        }
        if (pinErrorMsg) {
          pinErrorMsg.textContent = '¡Código verificado! Descargando bono...';
          pinErrorMsg.classList.add('success');
        }
        if (pinSubmitBtn) {
          pinSubmitBtn.innerHTML = '<span>✓ Descargando...</span>';
        }

        // Descarga el archivo de forma transparente
        const directUrl = convertToGoogleDriveDirectDownload(decryptedUrl);
        setTimeout(() => {
          const downloadLink = document.createElement('a');
          downloadLink.href = directUrl;
          downloadLink.target = '_blank';
          if (!directUrl.includes('drive.google.com')) {
            downloadLink.download = 'Bono-Regalo-Vandelvira-Gabri-y-Franssia.pdf';
          }
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          // Cierra la ventana tras la descarga
          setTimeout(closePinModal, 1200);
        }, 600);

      } catch (err) {
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
