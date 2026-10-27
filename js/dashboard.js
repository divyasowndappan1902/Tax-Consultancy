/**
 * STERLING & CO. TAX ADVISORS - DASHBOARD CONTROLLER
 * Powering Customer Vault Portal & Admin Partner Command Center
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardTabs();
  initSidebarToggle();
  initUserDropdown();
  initThemeToggle();
  initNotificationCenter();
  initVaultUpload();
  initCustomerSimulator();
  initCustomerChat();
  initCustomerESignature();
  initAdminPipeline();
  initAdminClientSearch();
  initAdminDossierModal();
  initAdminIntakeModal();
});

/* --------------------------------------------------------------------------
   1. DASHBOARD TAB NAVIGATION
   -------------------------------------------------------------------------- */
function initDashboardTabs() {
  const navLinks = document.querySelectorAll('.dash-nav-link[data-tab]');
  const tabPanes = document.querySelectorAll('.dash-tab-pane');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTabId = link.getAttribute('data-tab');
      if (!targetTabId) return;

      // Update active links
      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');

      // Update active panes
      tabPanes.forEach((pane) => {
        if (pane.id === targetTabId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });

      // Close mobile sidebar if open
      const sidebar = document.querySelector('.dash-sidebar');
      if (sidebar && window.innerWidth <= 992) {
        sidebar.classList.remove('open');
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

/* --------------------------------------------------------------------------
   2. MOBILE SIDEBAR TOGGLE
   -------------------------------------------------------------------------- */
function initSidebarToggle() {
  const toggleBtn = document.getElementById('dash-sidebar-toggle');
  const sidebar = document.querySelector('.dash-sidebar');
  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 992 && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    }
  });
}

/* --------------------------------------------------------------------------
   3. USER DROPDOWN MENU
   -------------------------------------------------------------------------- */
function initUserDropdown() {
  const userPill = document.querySelector('.dash-user-pill');
  const dropdown = document.querySelector('.dash-dropdown');
  if (!userPill || !dropdown) return;

  userPill.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    dropdown.classList.remove('active');
  });
}

/* --------------------------------------------------------------------------
   4. THEME TOGGLE (WHITE LUXURY / MIDNIGHT NAVY)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('sterling_theme', newTheme);

      if (typeof showToast === 'function') {
        showToast(
          newTheme === 'light' 
            ? 'Switched to White Luxury Mode' 
            : 'Switched to Midnight Navy Mode', 
          'info'
        );
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. NOTIFICATION CENTER
   -------------------------------------------------------------------------- */
function initNotificationCenter() {
  const notifBtn = document.getElementById('notif-center-btn');
  const notifModal = document.getElementById('modal-notifications');
  const pulse = document.querySelector('.dash-badge-pulse');
  if (!notifBtn || !notifModal) return;

  notifBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(notifModal);
    if (pulse) pulse.style.display = 'none';
  });

  const clearBtn = notifModal.querySelector('.btn-clear-notifs');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const list = notifModal.querySelector('.notif-list');
      if (list) {
        list.innerHTML = `<div style="text-align:center; padding:2rem; color:var(--slate-text);">All notifications marked as read.</div>`;
      }
      if (typeof showToast === 'function') {
        showToast('All notifications cleared.', 'info');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   6. CUSTOMER VAULT FILE UPLOAD SIMULATION
   -------------------------------------------------------------------------- */
function initVaultUpload() {
  const dropzone = document.getElementById('vault-dropzone');
  const fileInput = document.getElementById('vault-file-input');
  const docGrid = document.getElementById('vault-doc-grid');
  if (!dropzone || !fileInput) return;

  dropzone.addEventListener('click', () => fileInput.click());

  ['dragenter', 'dragover'].forEach((eventName) => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileUpload(files[0]);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) handleFileUpload(fileInput.files[0]);
  });

  function handleFileUpload(file) {
    if (typeof showToast === 'function') {
      showToast(`Encrypting and ingesting "${file.name}" into 256-bit vault...`, 'info');
    }

    const dropzoneTitle = dropzone.querySelector('.vault-dropzone-title');
    const originalText = dropzoneTitle ? dropzoneTitle.textContent : '';
    if (dropzoneTitle) dropzoneTitle.textContent = `Encrypting ${file.name}... (SHA-256)`;

    setTimeout(() => {
      if (dropzoneTitle) dropzoneTitle.textContent = originalText;
      if (typeof showToast === 'function') {
        showToast(`Document "${file.name}" successfully secured in Fiduciary Repository.`, 'success');
      }

      if (docGrid) {
        const hash = '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6);
        const card = document.createElement('div');
        card.className = 'doc-card';
        card.innerHTML = `
          <div class="doc-header">
            <div class="doc-icon-wrap vault">
              <i class="fa-solid fa-file-shield" style="font-size:1.25rem; color:var(--primary-color);"></i>
            </div>
            <div class="doc-meta">
              <div class="doc-title">${file.name}</div>
              <div class="doc-sub">
                <span>Just uploaded</span> • <span>${(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>
          </div>
          <div class="doc-footer">
            <span class="doc-security-hash">${hash}</span>
            <span class="status-pill success"><span class="dot"></span> Verified</span>
          </div>
        `;
        docGrid.prepend(card);
      }
    }, 1500);
  }
}

/* --------------------------------------------------------------------------
   7. CUSTOMER SCENARIO STRATEGY SIMULATOR
   -------------------------------------------------------------------------- */
function initCustomerSimulator() {
  const sliderGains = document.getElementById('sim-gains');
  const sliderCharity = document.getElementById('sim-charity');
  const sliderOffshore = document.getElementById('sim-offshore');

  if (!sliderGains) return;

  const valGains = document.getElementById('val-gains');
  const valCharity = document.getElementById('val-charity');
  const valOffshore = document.getElementById('val-offshore');

  const resStatutory = document.getElementById('res-statutory');
  const resSheltered = document.getElementById('res-sheltered');
  const resPreserved = document.getElementById('res-preserved');
  const resRate = document.getElementById('res-rate');

  function calculateSimulation() {
    const gains = parseInt(sliderGains.value, 10);
    const charity = parseInt(sliderCharity.value, 10);
    const offshore = parseInt(sliderOffshore.value, 10);

    if (valGains) valGains.textContent = `$${(gains / 1000000).toFixed(1)}M`;
    if (valCharity) valCharity.textContent = `$${(charity / 1000).toFixed(0)}k`;
    if (valOffshore) valOffshore.textContent = `$${(offshore / 1000000).toFixed(1)}M`;

    // Standard unmitigated tax rate ~37% federal + state ~45% total
    const totalTaxable = gains + offshore;
    const statutoryTax = totalTaxable * 0.42;

    // Sterling & Co. Dynastic Trust + FLP + DAF Deductions
    const charitableShelter = charity * 0.85;
    const flpValuationDiscount = gains * 0.32; // 32% minority discount
    const treatyCarveout = offshore * 0.55;

    const shelteredTax = Math.max(120000, statutoryTax - (charitableShelter * 0.42 + flpValuationDiscount * 0.38 + treatyCarveout * 0.35));
    const netPreserved = statutoryTax - shelteredTax;
    const effectiveRate = ((shelteredTax / totalTaxable) * 100).toFixed(1);

    if (resStatutory) resStatutory.textContent = `$${Math.round(statutoryTax).toLocaleString()}`;
    if (resSheltered) resSheltered.textContent = `$${Math.round(shelteredTax).toLocaleString()}`;
    if (resPreserved) resPreserved.textContent = `$${Math.round(netPreserved).toLocaleString()}`;
    if (resRate) resRate.textContent = `${effectiveRate}% Effective Rate`;
  }

  [sliderGains, sliderCharity, sliderOffshore].forEach((s) => {
    if (s) s.addEventListener('input', calculateSimulation);
  });

  calculateSimulation();
}

/* --------------------------------------------------------------------------
   8. CUSTOMER CHAT INTERACTION
   -------------------------------------------------------------------------- */
function initCustomerChat() {
  const chatInput = document.getElementById('customer-chat-input');
  const chatSendBtn = document.getElementById('customer-chat-send');
  const chatBody = document.getElementById('customer-chat-body');
  if (!chatInput || !chatSendBtn || !chatBody) return;

  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Append outgoing bubble
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const outgoing = document.createElement('div');
    outgoing.className = 'chat-bubble outgoing';
    outgoing.innerHTML = `
      <div>${escapeHtml(text)}</div>
      <div class="chat-time">${timeStr} • Sent via 256-Bit Vault</div>
    `;
    chatBody.appendChild(outgoing);
    chatInput.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    // Automated Partner Response simulation
    setTimeout(() => {
      const partnerReplies = [
        "Understood, Lord Vance. I've noted this in your 1041 fiduciary working papers and instructed Mei-Ling to apply the Section 1202 exclusion.",
        "Thank you for the update. Our London Mayfair desk is reviewing the Swiss treaty clause now. I will confirm before 4:00 PM GMT.",
        "Received securely. We have updated your dynastic trust ledger accordingly. All documentation has been encrypted in your vault."
      ];
      const randomReply = partnerReplies[Math.floor(Math.random() * partnerReplies.length)];

      const incoming = document.createElement('div');
      incoming.className = 'chat-bubble incoming';
      incoming.innerHTML = `
        <div style="font-size:0.75rem; font-weight:700; color:var(--gold-light); margin-bottom:0.25rem;">Alistair Sterling (Senior Partner)</div>
        <div>${randomReply}</div>
        <div class="chat-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      `;
      chatBody.appendChild(incoming);
      chatBody.scrollTop = chatBody.scrollHeight;
      if (typeof showToast === 'function') {
        showToast('New confidential message from Partner Alistair Sterling.', 'info');
      }
    }, 1800);
  }

  chatSendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

/* --------------------------------------------------------------------------
   9. CUSTOMER E-SIGNATURE MODAL FLOW
   -------------------------------------------------------------------------- */
function initCustomerESignature() {
  const esignTrigger = document.getElementById('trigger-esign-modal');
  const esignModal = document.getElementById('modal-esign');
  const confirmBtn = document.getElementById('btn-confirm-signature');
  const urgentBanner = document.getElementById('urgent-esign-banner');
  const step4 = document.getElementById('filing-step-4');
  const step5 = document.getElementById('filing-step-5');

  if (!esignTrigger || !esignModal) return;

  esignTrigger.addEventListener('click', () => openModal(esignModal));

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      confirmBtn.innerHTML = `<span>Cryptographically Signing...</span>`;
      confirmBtn.disabled = true;

      setTimeout(() => {
        closeModal(esignModal);
        confirmBtn.innerHTML = `<span>Verify & Affix Signature</span>`;
        confirmBtn.disabled = false;

        if (urgentBanner) {
          urgentBanner.style.display = 'none';
        }

        if (step4 && step5) {
          step4.classList.remove('active');
          step4.classList.add('completed');
          step4.querySelector('.filing-step-circle').innerHTML = '✓';
          step4.querySelector('.filing-step-status').textContent = 'Executed';

          step5.classList.add('active');
          step5.querySelector('.filing-step-status').textContent = 'Submitting to IRS';
        }

        if (typeof showToast === 'function') {
          showToast('Fiduciary E-Signature successfully verified. Filing transmitted to IRS e-File gateway.', 'success');
        }
      }, 1600);
    });
  }
}

/* --------------------------------------------------------------------------
   10. ADMIN KANBAN & PIPELINE INTERACTIONS
   -------------------------------------------------------------------------- */
function initAdminPipeline() {
  const kanbanCards = document.querySelectorAll('.kanban-card');
  const signoffModal = document.getElementById('modal-admin-signoff');

  kanbanCards.forEach((card) => {
    card.addEventListener('click', () => {
      const clientName = card.querySelector('.kanban-card-title')?.textContent || 'Client Entity';
      const taxPkg = card.querySelector('.kanban-card-sub')?.textContent || '2025 Filing Package';

      if (signoffModal) {
        const modalClient = signoffModal.querySelector('.signoff-client-name');
        const modalPkg = signoffModal.querySelector('.signoff-package-name');
        if (modalClient) modalClient.textContent = clientName;
        if (modalPkg) modalPkg.textContent = taxPkg;
        openModal(signoffModal);
      }
    });
  });

  const approveFilingBtn = document.getElementById('btn-approve-filing');
  if (approveFilingBtn && signoffModal) {
    approveFilingBtn.addEventListener('click', () => {
      approveFilingBtn.innerHTML = `<span>Transmitting Partner Seal...</span>`;
      approveFilingBtn.disabled = true;

      setTimeout(() => {
        closeModal(signoffModal);
        approveFilingBtn.innerHTML = `<span>Approve & Authorize IRS Transmission</span>`;
        approveFilingBtn.disabled = false;

        if (typeof showToast === 'function') {
          showToast(`Return authorized under Partner Warrant. Transmitted to IRS Enterprise Portal.`, 'success');
        }
      }, 1400);
    });
  }
}

/* --------------------------------------------------------------------------
   11. ADMIN CLIENT SEARCH & FILTERS
   -------------------------------------------------------------------------- */
function initAdminClientSearch() {
  const searchInput = document.getElementById('admin-client-search');
  const filterSelect = document.getElementById('admin-client-filter');
  const tableRows = document.querySelectorAll('.client-table-row');

  if (!searchInput && !filterSelect) return;

  function applyFilters() {
    const term = (searchInput?.value || '').toLowerCase().trim();
    const cat = (filterSelect?.value || 'all').toLowerCase();

    tableRows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      const rowCat = (row.getAttribute('data-category') || '').toLowerCase();

      const matchesSearch = term === '' || text.includes(term);
      const matchesCat = cat === 'all' || rowCat === cat;

      row.style.display = matchesSearch && matchesCat ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (filterSelect) filterSelect.addEventListener('change', applyFilters);
}

/* --------------------------------------------------------------------------
   12. ADMIN CLIENT DOSSIER MODAL
   -------------------------------------------------------------------------- */
function initAdminDossierModal() {
  const dossierBtns = document.querySelectorAll('.btn-view-dossier');
  const dossierModal = document.getElementById('modal-client-dossier');
  if (!dossierBtns.length || !dossierModal) return;

  dossierBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const clientName = btn.getAttribute('data-client-name') || 'Vance Dynasty Trust';
      const clientAum = btn.getAttribute('data-client-aum') || '$450M';
      const clientJur = btn.getAttribute('data-client-jurisdiction') || 'US / UK / Switzerland';

      const nameEl = dossierModal.querySelector('.dossier-name');
      const aumEl = dossierModal.querySelector('.dossier-aum');
      const jurEl = dossierModal.querySelector('.dossier-jur');

      if (nameEl) nameEl.textContent = clientName;
      if (aumEl) aumEl.textContent = clientAum;
      if (jurEl) jurEl.textContent = clientJur;

      openModal(dossierModal);
    });
  });
}

/* --------------------------------------------------------------------------
   13. ADMIN INTAKE MODAL
   -------------------------------------------------------------------------- */
function initAdminIntakeModal() {
  const intakeBtn = document.getElementById('btn-new-intake');
  const intakeModal = document.getElementById('modal-new-intake');
  const intakeForm = document.getElementById('form-new-intake');
  if (!intakeBtn || !intakeModal) return;

  intakeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(intakeModal);
  });

  if (intakeForm) {
    intakeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entityName = intakeForm.querySelector('#intake-entity-name')?.value || 'New Client Entity';
      const submitBtn = intakeForm.querySelector('button[type="submit"]');

      submitBtn.innerHTML = `<span>Provisioning Vault Enclave...</span>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        closeModal(intakeModal);
        submitBtn.innerHTML = `<span>Provision Sovereign Vault</span>`;
        submitBtn.disabled = false;
        intakeForm.reset();

        if (typeof showToast === 'function') {
          showToast(`Vault successfully provisioned for ${entityName}. Invitation dispatched.`, 'success');
        }
      }, 1500);
    });
  }
}

/* --------------------------------------------------------------------------
   GENERIC MODAL HELPERS
   -------------------------------------------------------------------------- */
function openModal(modal) {
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const closeBtns = modal.querySelectorAll('.dash-modal-close, .btn-modal-cancel');
  closeBtns.forEach((btn) => {
    btn.onclick = () => closeModal(modal);
  });

  modal.onclick = (e) => {
    if (e.target === modal) closeModal(modal);
  };
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Global modal close via Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.dash-modal-backdrop.active');
    if (activeModal) closeModal(activeModal);
  }
});
