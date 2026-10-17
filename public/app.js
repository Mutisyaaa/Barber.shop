/**
 * The Noble Blade Barber Lounge
 * Complete Frontend Application Controller
 * Handles Customer Booking Flow, Daraja M-Pesa STK Push Simulation,
 * and Owner/Barber Dashboard Management.
 */

// Fallback initial data in case the server is opened offline/statically
const FALLBACK_DATA = {
  settings: {
    shop_name: "SAM KITIKI KUTZ",
    tagline: "Celebrity Grooming & Master Barber Lounge by Kitiki Sam",
    location: "Utawala & Executive Mobile VIP, Nairobi",
    phone: "+254 724 590 868",
    whatsapp: "+254724590868",
    instagram: "kitikisam_the_barber",
    opening_time: "08:30",
    closing_time: "20:00",
    deposit_amount: 300,
    cancellation_window_hours: 2,
    slot_step_min: 15,
    currency: "KES"
  },
  services: [
    { id: "srv_1", name: "Gentleman's Signature Cut", category: "Haircut", price: 800, duration_min: 30, description: "Precision clipper & scissor cut finished with razor neck clean up, aftershave balm, and cooling tonic.", popular: false, is_active: true },
    { id: "srv_2", name: "Flat Top with Mid-Fade", category: "Haircut", price: 1000, duration_min: 45, description: "Kitiki Sam's signature master cut — geometric flat top, crisp mid-fade, razor line detailing, and styling.", popular: true, is_active: true },
    { id: "srv_3", name: "Low / Drop Taper Fade & Razor Lineup", category: "Haircut", price: 1000, duration_min: 45, description: "Seamless skin drop fade, surgical hairline shapeup, foil shavers, and premium styling wax.", popular: true, is_active: true },
    { id: "srv_4", name: "Royal Beard Sculpt & Hot Towel", category: "Beard", price: 600, duration_min: 30, description: "Detailed beard shaping, eucalyptus hot towel steam treatment, straight razor edge, and argan oil finish.", popular: false, is_active: true },
    { id: "srv_5", name: "Junior / Kids Royal Grooming (Under 12)", category: "Haircut", price: 500, duration_min: 30, description: "Gentle, patient styling for young kings, fun design elements, and lollipop on the house.", popular: false, is_active: true },
    { id: "srv_6", name: "The Celebrity Executive Combo", category: "Combo", price: 2000, duration_min: 60, description: "Signature fade, beard sculpt, peppermint hot towel facial scrub, rejuvenating scalp wash, and shoulder massage.", popular: true, is_active: true },
    { id: "srv_7", name: "Black Tint & Gray Blending", category: "Color", price: 1200, duration_min: 40, description: "Semi-permanent beard or hair darkening for a youthful, sharp, and high-definition look.", popular: false, is_active: true },
    { id: "srv_8", name: "VIP House Call / Executive Doorstep Cut", category: "Combo", price: 4500, duration_min: 75, description: "Kitiki Sam brings the luxury barbershop experience right to your home, hotel, or office anywhere in Nairobi.", popular: false, is_active: true }
  ],
  barbers: [
    { id: "barb_1", name: "Kitiki Sam", nickname: "Celebrity Barber (@kitikisam_the_barber)", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", specialty: "Flat Tops, Mid Fades & Celebrity Grooming", rating: 5.0, review_count: 680, working_hours: { start: "08:30", end: "19:30" }, is_active: true },
    { id: "barb_2", name: "Sammy Otieno", nickname: "Sharp Edge", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", specialty: "Beard Sculpting & Hot Towel", rating: 4.9, review_count: 290, working_hours: { start: "09:00", end: "20:00" }, is_active: true },
    { id: "barb_3", name: "Brian Mwangi", nickname: "The Stylist", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80", specialty: "Textured Crops & Scissor Work", rating: 4.8, review_count: 215, working_hours: { start: "08:30", end: "18:30" }, is_active: true },
    { id: "barb_4", name: "Alex Kimani", nickname: "Speed & Detail", photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80", specialty: "Executive Combos & Kids Cuts", rating: 4.8, review_count: 182, working_hours: { start: "10:00", end: "20:00" }, is_active: true }
  ],
  clients: [
    { id: "cli_1", name: "Dennis Kipchumba", phone: "+254722100200", visit_count: 8, last_visit: "2026-10-10", no_show_count: 0 },
    { id: "cli_2", name: "Kevin Maina", phone: "+254733456789", visit_count: 14, last_visit: "2026-10-12", no_show_count: 1 },
    { id: "cli_3", name: "Evans Omondi", phone: "+254711889900", visit_count: 3, last_visit: "2026-10-14", no_show_count: 0 }
  ],
  appointments: [
    { id: "apt_101", client_name: "Dennis Kipchumba", client_phone: "+254722100200", barber_id: "barb_1", barber_name: "Kitiki Sam", service_id: "srv_2", service_name: "Flat Top with Mid-Fade", service_price: 1000, date: new Date().toISOString().split('T')[0], start_time: "09:30", end_time: "10:15", status: "arrived", deposit_paid: true, deposit_amount: 300, mpesa_ref: "QHJ891K20L" },
    { id: "apt_102", client_name: "Kevin Maina", client_phone: "+254733456789", barber_id: "barb_2", barber_name: "Sammy Otieno", service_id: "srv_6", service_name: "The Celebrity Executive Combo", service_price: 2000, date: new Date().toISOString().split('T')[0], start_time: "11:00", end_time: "12:00", status: "confirmed", deposit_paid: true, deposit_amount: 300, mpesa_ref: "QLP458M92X" },
    { id: "apt_103", client_name: "Evans Omondi", client_phone: "+254711889900", barber_id: "barb_1", barber_name: "Kitiki Sam", service_id: "srv_4", service_name: "Royal Beard Sculpt & Hot Towel", service_price: 600, date: new Date().toISOString().split('T')[0], start_time: "14:00", end_time: "14:30", status: "confirmed", deposit_paid: true, deposit_amount: 300, mpesa_ref: "QRS712J01K" }
  ],
  walkin_queue: [
    { id: "wk_1", client_name: "James Karanja", client_phone: "+254720987654", service_id: "srv_2", service_name: "Flat Top with Mid-Fade", barber_id: "barb_1", barber_name: "Kitiki Sam", service_duration: 45, estimated_wait_min: 15, status: "waiting" }
  ]
};

// Application State
const appState = {
  settings: { ...FALLBACK_DATA.settings },
  services: [...FALLBACK_DATA.services],
  barbers: [...FALLBACK_DATA.barbers],
  clients: [...FALLBACK_DATA.clients],
  appointments: [...FALLBACK_DATA.appointments],
  walkins: [...FALLBACK_DATA.walkin_queue],
  
  // Active Booking Wizard State
  booking: {
    step: 1,
    service: null,
    barber: null, // null means "any"
    date: null,
    slot: null,
    customer: {
      name: '',
      phone: '',
      notes: ''
    },
    depositAmount: 300,
    mpesaRef: null,
    confirmedAppointment: null
  },

  // Active View & Dashboard Filter
  view: 'customer', // 'customer' or 'dashboard'
  dashFilterBarber: 'all',
  dashActiveTab: 'timeline'
};

// Utility Helpers
function formatCurrency(val) {
  return `KES ${Number(val || 0).toLocaleString()}`;
}

function formatTime12(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
}

function timeToMin(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function minToTime(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function showToast(message, icon = '💈') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ================= API SERVICE =================
const API = {
  async fetchSettings() {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) appState.settings = await res.json();
    } catch {
      console.log('Using local settings data.');
    }
  },

  async fetchServices() {
    try {
      const res = await fetch('/api/services');
      if (res.ok) appState.services = await res.json();
    } catch {
      console.log('Using local services data.');
    }
  },

  async fetchBarbers() {
    try {
      const res = await fetch('/api/barbers');
      if (res.ok) appState.barbers = await res.json();
    } catch {
      console.log('Using local barbers data.');
    }
  },

  async fetchAppointments(date) {
    try {
      const url = date ? `/api/appointments?date=${date}` : '/api/appointments';
      const res = await fetch(url);
      if (res.ok) appState.appointments = await res.json();
    } catch {
      console.log('Using local appointments data.');
    }
  },

  async fetchSlots(date, duration, barberId) {
    try {
      const bId = barberId || 'any';
      const res = await fetch(`/api/slots?date=${date}&duration=${duration}&barberId=${bId}`);
      if (res.ok) {
        const data = await res.json();
        return data.slots || [];
      }
    } catch {
      console.log('Generating local slots.');
    }
    // Local fallback slot calculation
    return generateFallbackSlots(date, duration, barberId);
  },

  async updateAppointmentStatus(id, status) {
    try {
      const res = await fetch(`/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.log('Updating local appointment status:', err);
    }
    const appt = appState.appointments.find(a => a.id === id);
    if (appt) appt.status = status;
    return { success: true };
  },

  async triggerStkPush(phone, amount, reference) {
    try {
      const res = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount, reference })
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.log('Simulating local STK push.');
    }
    // Simulated STK push
    return {
      success: true,
      ResponseCode: "0",
      CheckoutRequestID: `ws_CO_${Date.now()}`,
      CustomerMessage: `Success. An STK push prompt has been dispatched to ${phone}.`,
      simulatedReceipt: `SH${Math.random().toString(36).substring(2, 8).toUpperCase()}9K`
    };
  },

  async createAppointment(payload) {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.log('Creating local appointment record.');
    }
    const newApt = {
      id: `apt_${Date.now()}`,
      ...payload,
      status: 'confirmed',
      deposit_paid: true
    };
    appState.appointments.push(newApt);
    return {
      success: true,
      appointment: newApt,
      whatsappUrl: `https://wa.me/${payload.client_phone.replace(/[^0-9]/g, '')}?text=Booking+Confirmed`,
      smsNotification: {
        message: `The Noble Blade: Appointment confirmed on ${payload.date} at ${payload.start_time}. Deposit KES ${payload.deposit_amount || 300} received.`
      }
    };
  },

  async addWalkin(payload) {
    try {
      const res = await fetch('/api/walkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.log('Adding local walk-in.');
    }
    const newWalkin = {
      id: `wk_${Date.now()}`,
      ...payload,
      estimated_wait_min: 15,
      status: 'waiting'
    };
    appState.walkins.push(newWalkin);
    return { success: true, walkin: newWalkin };
  },

  async updateWalkinStatus(id, status) {
    try {
      const res = await fetch(`/api/walkin/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.log('Updating walkin status locally.');
    }
    const w = appState.walkins.find(item => item.id === id);
    if (w) w.status = status;
    return { success: true };
  },

  async saveService(serviceData) {
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.log('Saving service locally:', err);
    }
    return { success: true, service: serviceData };
  },

  async deleteService(id) {
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (err) {
      console.log('Deleting service locally:', err);
    }
    return { success: true };
  },

  async saveBarber(barberData) {
    try {
      const res = await fetch('/api/barbers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(barberData)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.log('Saving barber locally:', err);
    }
    return { success: true, barber: barberData };
  },

  async blockTimeOff(payload) {
    try {
      const res = await fetch('/api/timeoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.log('Saving time off locally:', err);
    }
    return { success: true, time_off: payload };
  },

  async saveSettings(settingsData) {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.log('Saving settings locally:', err);
    }
    return { success: true, settings: settingsData };
  }
};

// Fallback slot generator when running static/offline
function generateFallbackSlots(dateStr, durationMin = 30, barberId = 'any') {
  durationMin = Number(durationMin) || 30;
  const startMin = timeToMin(appState.settings.opening_time || '08:30');
  const endMin = timeToMin(appState.settings.closing_time || '20:00');
  const slots = [];
  
  for (let current = startMin; current + durationMin <= endMin; current += 30) {
    const timeKey = minToTime(current);
    // filter collision with existing
    const hasCollision = appState.appointments.some(a => 
      a.date === dateStr && a.status !== 'cancelled' && a.start_time === timeKey
    );
    if (!hasCollision) {
      slots.push({
        time: timeKey,
        formatted: formatTime12(timeKey),
        barberIds: ['barb_1', 'barb_2'],
        barberNames: ['Marcus Vance', 'Sammy Otieno']
      });
    }
  }
  return slots;
}

// ================= RENDER METHODS =================

function renderServices(categoryFilter = 'all') {
  const container = document.getElementById('services-grid');
  if (!container) return;

  const filtered = categoryFilter === 'all'
    ? appState.services.filter(s => s.is_active)
    : appState.services.filter(s => s.is_active && s.category.toLowerCase() === categoryFilter.toLowerCase());

  container.innerHTML = filtered.map(service => `
    <article class="service-card ${service.popular ? 'popular-card' : ''}">
      ${service.popular ? '<span class="popular-badge">★ Most Popular</span>' : ''}
      <div class="service-header">
        <h3 class="service-title">${service.name}</h3>
        <p class="service-desc">${service.description}</p>
      </div>

      <div class="service-meta-row">
        <span class="service-duration-badge">⏱️ ${service.duration_min} min</span>
        <span class="service-price">${formatCurrency(service.price)}</span>
      </div>

      <button type="button" class="btn btn-secondary btn-block btn-book-service" data-service-id="${service.id}">
        Book This Service
      </button>
    </article>
  `).join('');

  // Attach click listeners to "Book This Service"
  container.querySelectorAll('.btn-book-service').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const sId = e.currentTarget.getAttribute('data-service-id');
      const s = appState.services.find(srv => srv.id === sId);
      openBookingWizard({ service: s });
    });
  });
}

function renderBarbers() {
  const container = document.getElementById('barbers-grid');
  if (!container) return;

  container.innerHTML = appState.barbers.filter(b => b.is_active).map(barber => `
    <article class="barber-card">
      <div class="barber-photo-wrapper">
        <img src="${barber.photo}" alt="${barber.name}" loading="lazy">
        <span class="barber-rating-pill">⭐ ${barber.rating} (${barber.review_count || 120})</span>
      </div>
      <div class="barber-card-body">
        <div>
          <h3 class="barber-name">${barber.name}</h3>
          <div class="barber-nickname">"${barber.nickname}"</div>
          <p class="barber-specialty">${barber.specialty}</p>
        </div>
        <button type="button" class="btn btn-primary btn-block btn-book-barber" data-barber-id="${barber.id}">
          Book with ${barber.name.split(' ')[0]}
        </button>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('.btn-book-barber').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const bId = e.currentTarget.getAttribute('data-barber-id');
      const b = appState.barbers.find(barb => barb.id === bId);
      openBookingWizard({ barber: b });
    });
  });
}

// ================= BOOKING WIZARD =================

function openBookingWizard(preset = {}) {
  const dialog = document.getElementById('booking-dialog');
  if (!dialog) return;

  // Initialize booking state
  appState.booking = {
    step: 1,
    service: preset.service || null,
    barber: preset.barber || null,
    date: getTodayDateString(),
    slot: null,
    customer: { name: '', phone: '', notes: '' },
    depositAmount: appState.settings.deposit_amount || 300,
    mpesaRef: null,
    confirmedAppointment: null
  };

  // If service was preset, jump to step 2; if barber also preset, jump to step 3
  if (appState.booking.service && appState.booking.barber) {
    appState.booking.step = 3;
  } else if (appState.booking.service) {
    appState.booking.step = 2;
  } else {
    appState.booking.step = 1;
  }

  updateWizardUI();
  dialog.showModal();
}

function getTodayDateString() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function updateWizardUI() {
  const step = appState.booking.step;
  const label = document.getElementById('wizard-step-label');
  const title = document.getElementById('wizard-step-title');
  const nextBtn = document.getElementById('wizard-next-btn');
  const prevBtn = document.getElementById('wizard-prev-btn');

  // Update Stepper points
  document.querySelectorAll('.step-point').forEach(p => {
    const s = Number(p.getAttribute('data-step'));
    p.classList.remove('active', 'completed');
    if (s === step) p.classList.add('active');
    else if (s < step) p.classList.add('completed');
  });

  // Toggle step panes
  document.querySelectorAll('.wizard-pane').forEach((pane, idx) => {
    if (idx + 1 === step) {
      pane.classList.add('active');
    } else {
      pane.classList.remove('active');
    }
  });

  // Navigation button controls
  prevBtn.style.visibility = step === 1 ? 'hidden' : 'visible';

  if (step === 1) {
    label.textContent = 'Step 1 of 4';
    title.textContent = 'Select Your Grooming Service';
    nextBtn.textContent = 'Select Barber →';
    nextBtn.disabled = !appState.booking.service;
    renderWizardServices();
  } else if (step === 2) {
    label.textContent = 'Step 2 of 4';
    title.textContent = 'Choose Your Master Barber';
    nextBtn.textContent = 'Select Date & Time →';
    nextBtn.disabled = false; // "Any" is default valid
    renderWizardBarbers();
  } else if (step === 3) {
    label.textContent = 'Step 3 of 4';
    title.textContent = 'Pick Date & Open Time Slot';
    nextBtn.textContent = 'Confirm & M-Pesa Deposit →';
    nextBtn.disabled = !appState.booking.slot;
    renderWizardSlots();
  } else if (step === 4) {
    label.textContent = 'Step 4 of 4';
    title.textContent = 'Customer Details & M-Pesa Deposit';
    nextBtn.textContent = `Pay Deposit (${formatCurrency(appState.booking.depositAmount)}) →`;
    nextBtn.disabled = !validateCustomerForm();
    renderWizardSummary();
  }
}

function renderWizardServices() {
  const container = document.getElementById('wizard-services-container');
  if (!container) return;

  container.innerHTML = appState.services.filter(s => s.is_active).map(s => {
    const isSelected = appState.booking.service && appState.booking.service.id === s.id;
    return `
      <div class="selectable-item ${isSelected ? 'selected' : ''}" data-service-id="${s.id}">
        <div class="item-left">
          <div class="item-details">
            <h4>${s.name}</h4>
            <p>⏱️ ${s.duration_min} min • ${s.category}</p>
          </div>
        </div>
        <div class="item-price-tag">${formatCurrency(s.price)}</div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.selectable-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const sId = e.currentTarget.getAttribute('data-service-id');
      appState.booking.service = appState.services.find(s => s.id === sId);
      document.getElementById('wizard-next-btn').disabled = false;
      renderWizardServices();
    });
  });
}

function renderWizardBarbers() {
  const container = document.getElementById('wizard-barbers-container');
  if (!container) return;

  const isAnySelected = !appState.booking.barber;

  let html = `
    <div class="selectable-item ${isAnySelected ? 'selected' : ''}" data-barber-id="any">
      <div class="item-left">
        <div class="item-avatar" style="display:flex;align-items:center;justify-content:center;background:#252d3a;font-size:1.4rem;">
          ⚡
        </div>
        <div class="item-details">
          <h4>Any Available Master Barber (Recommended)</h4>
          <p>Maximum flexibility — picks the fastest open chair for your time</p>
        </div>
      </div>
      <span class="badge-tag tag-success">Fastest</span>
    </div>
  `;

  html += appState.barbers.filter(b => b.is_active).map(b => {
    const isSelected = appState.booking.barber && appState.booking.barber.id === b.id;
    return `
      <div class="selectable-item ${isSelected ? 'selected' : ''}" data-barber-id="${b.id}">
        <div class="item-left">
          <img src="${b.photo}" alt="${b.name}" class="item-avatar">
          <div class="item-details">
            <h4>${b.name}</h4>
            <p>${b.specialty} • ⭐ ${b.rating}</p>
          </div>
        </div>
        <span class="badge-tag" style="background:rgba(229,176,69,0.15);color:var(--gold-primary);">Available</span>
      </div>
    `;
  }).join('');

  container.innerHTML = html;

  container.querySelectorAll('.selectable-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const bId = e.currentTarget.getAttribute('data-barber-id');
      if (bId === 'any') {
        appState.booking.barber = null;
      } else {
        appState.booking.barber = appState.barbers.find(b => b.id === bId);
      }
      renderWizardBarbers();
    });
  });
}

async function renderWizardSlots() {
  const dateInput = document.getElementById('booking-date-input');
  const container = document.getElementById('wizard-slots-container');
  const alertEmpty = document.getElementById('no-slots-alert');
  const countBadge = document.getElementById('slot-count-badge');
  if (!dateInput || !container) return;

  // Set min date to today
  dateInput.min = getTodayDateString();
  if (!dateInput.value) {
    dateInput.value = appState.booking.date || getTodayDateString();
  }
  appState.booking.date = dateInput.value;

  container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:1.5rem;color:var(--text-muted);">Finding open slots...</div>`;
  alertEmpty.classList.add('hidden');

  const duration = appState.booking.service ? appState.booking.service.duration_min : 30;
  const barberId = appState.booking.barber ? appState.booking.barber.id : 'any';

  const slots = await API.fetchSlots(dateInput.value, duration, barberId);

  if (!slots || slots.length === 0) {
    container.innerHTML = '';
    alertEmpty.classList.remove('hidden');
    countBadge.textContent = '0 slots available';
    document.getElementById('wizard-next-btn').disabled = true;
    return;
  }

  countBadge.textContent = `${slots.length} slots available on this day`;
  alertEmpty.classList.add('hidden');

  container.innerHTML = slots.map(slot => {
    const isSelected = appState.booking.slot && appState.booking.slot.time === slot.time;
    return `
      <button type="button" class="slot-chip ${isSelected ? 'selected' : ''}" data-time="${slot.time}">
        ${slot.formatted}
      </button>
    `;
  }).join('');

  container.querySelectorAll('.slot-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const time = e.currentTarget.getAttribute('data-time');
      const selectedSlot = slots.find(s => s.time === time);
      appState.booking.slot = selectedSlot;
      document.getElementById('wizard-next-btn').disabled = false;
      renderWizardSlots();
    });
  });
}

function renderWizardSummary() {
  const srvName = document.getElementById('summary-service-name');
  const barbName = document.getElementById('summary-barber-name');
  const dt = document.getElementById('summary-datetime');
  const total = document.getElementById('summary-total-price');
  const dep = document.getElementById('summary-deposit-amount');
  const bal = document.getElementById('summary-balance-amount');

  const s = appState.booking.service;
  const b = appState.booking.barber;
  const slot = appState.booking.slot;
  const deposit = appState.booking.depositAmount;

  if (s) {
    srvName.textContent = `${s.name} (${s.duration_min} min)`;
    total.textContent = formatCurrency(s.price);
    const balance = Math.max(0, s.price - deposit);
    bal.textContent = formatCurrency(balance);
  }

  barbName.textContent = b ? b.name : 'Any Available Master Barber';
  dt.textContent = `${appState.booking.date} at ${slot ? slot.formatted : '--'}`;
  dep.textContent = formatCurrency(deposit);
}

function validateCustomerForm() {
  const name = document.getElementById('cust-name')?.value.trim();
  const phone = document.getElementById('cust-phone')?.value.trim();
  return Boolean(name && phone && phone.length >= 9);
}

// ================= STK PUSH INTERACTION =================

function startMpesaStkPushFlow() {
  const nameInput = document.getElementById('cust-name');
  const phoneInput = document.getElementById('cust-phone');
  const notesInput = document.getElementById('cust-notes');

  if (!nameInput.value.trim() || !phoneInput.value.trim()) {
    showToast('Please fill in your name and M-Pesa phone number.', '⚠️');
    return;
  }

  appState.booking.customer.name = nameInput.value.trim();
  appState.booking.customer.phone = phoneInput.value.trim();
  appState.booking.customer.notes = notesInput ? notesInput.value.trim() : '';

  // Close booking dialog, open STK modal
  const bookingDialog = document.getElementById('booking-dialog');
  const stkDialog = document.getElementById('stk-dialog');

  bookingDialog.close();

  // Reset STK UI
  document.getElementById('stk-prompt-amount').textContent = appState.booking.depositAmount;
  document.getElementById('stk-prompt-box').classList.remove('hidden');
  document.getElementById('stk-loading-box').classList.add('hidden');
  document.getElementById('stk-success-box').classList.add('hidden');

  stkDialog.showModal();
}

async function handleStkConfirm() {
  const pinInput = document.getElementById('stk-pin-input');
  const promptBox = document.getElementById('stk-prompt-box');
  const loadingBox = document.getElementById('stk-loading-box');
  const successBox = document.getElementById('stk-success-box');
  const timerLabel = document.getElementById('stk-timer');

  promptBox.classList.add('hidden');
  loadingBox.classList.remove('hidden');

  // Countdown timer simulation
  let countdown = 3;
  const interval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      timerLabel.textContent = `Awaiting Safaricom confirmation (${countdown}s)`;
    } else {
      clearInterval(interval);
    }
  }, 500);

  // Trigger STK API
  const refCode = `SH${Math.random().toString(36).substring(2, 8).toUpperCase()}9K`;
  appState.booking.mpesaRef = refCode;

  await API.triggerStkPush(appState.booking.customer.phone, appState.booking.depositAmount, 'CHAIR_DEPOSIT');

  setTimeout(async () => {
    loadingBox.classList.add('hidden');
    successBox.classList.remove('hidden');
    document.getElementById('stk-receipt-code').textContent = refCode;

    // Save appointment in DB
    const service = appState.booking.service;
    const barber = appState.booking.barber;
    const slot = appState.booking.slot;

    const payload = {
      client_name: appState.booking.customer.name,
      client_phone: '+254' + appState.booking.customer.phone.replace(/^0/, ''),
      barber_id: barber ? barber.id : 'any',
      service_id: service.id,
      date: appState.booking.date,
      start_time: slot.time,
      notes: appState.booking.customer.notes,
      deposit_paid: true,
      mpesa_ref: refCode
    };

    const res = await API.createAppointment(payload);
    appState.booking.confirmedAppointment = res.appointment || payload;

    setTimeout(() => {
      document.getElementById('stk-dialog').close();
      openConfirmationDialog(res);
      refreshDashboard(); // Update dashboard live
    }, 1800);

  }, 1600);
}

// ================= CONFIRMATION MODAL =================

function openConfirmationDialog(res) {
  const dialog = document.getElementById('confirmation-dialog');
  if (!dialog) return;

  const appt = appState.booking.confirmedAppointment;
  const s = appState.booking.service;
  const b = appState.booking.barber;
  const slot = appState.booking.slot;

  document.getElementById('conf-booking-id').textContent = `#${appt.id || 'APT-LATEST'}`;
  document.getElementById('conf-client-name').textContent = appState.booking.customer.name;
  document.getElementById('conf-service-name').textContent = s.name;
  document.getElementById('conf-barber-name').textContent = appt.barber_name || (b ? b.name : 'First Available Barber');
  document.getElementById('conf-datetime').textContent = `${appState.booking.date} at ${slot.formatted}`;
  document.getElementById('conf-mpesa-ref').textContent = appState.booking.mpesaRef;
  document.getElementById('conf-balance').textContent = formatCurrency(Math.max(0, s.price - appState.booking.depositAmount));

  // WhatsApp Button URL
  const cleanPhone = appState.booking.customer.phone.replace(/^0/, '254');
  const message = encodeURIComponent(
    `💈 *The Noble Blade Barber Lounge*\n\nHabari ${appState.booking.customer.name}! My appointment is confirmed for ${s.name} on ${appState.booking.date} at ${slot.formatted}. Deposit KES ${appState.booking.depositAmount} paid (Ref: ${appState.booking.mpesaRef}).`
  );
  document.getElementById('btn-conf-whatsapp').href = `https://wa.me/${cleanPhone}?text=${message}`;

  // Simulated SMS Preview Text
  document.getElementById('conf-sms-text').textContent = 
    `The Noble Blade: Appointment confirmed with ${appt.barber_name || 'Marcus'} on ${appState.booking.date} at ${slot.formatted}. M-Pesa Deposit KES ${appState.booking.depositAmount} received (Ref: ${appState.booking.mpesaRef}). See you soon!`;

  dialog.showModal();
}

// ================= DASHBOARD CONTROLLER =================

async function refreshDashboard() {
  await API.fetchAppointments();
  updateDashboardKPIs();
  renderTimelineStream();
  renderWalkinTable();
  renderClientsTable();
  renderServicesManager();
  renderBarbersManager();
  renderEarningsTable();
}

function updateDashboardKPIs() {
  const today = getTodayDateString();
  const appts = appState.appointments.filter(a => a.date === today);

  const total = appts.length;
  const arrived = appts.filter(a => a.status === 'arrived').length;
  const completed = appts.filter(a => a.status === 'completed').length;
  const deposits = appts.filter(a => a.deposit_paid).reduce((sum, a) => sum + (a.deposit_amount || 300), 0);
  const revenue = appts.filter(a => a.status !== 'cancelled' && a.status !== 'no_show').reduce((sum, a) => sum + (a.service_price || 800), 0);
  const walkinCount = appState.walkins.filter(w => w.status === 'waiting').length;

  document.getElementById('stat-total-appts').textContent = total;
  document.getElementById('stat-appts-breakdown').textContent = `${arrived} in chair • ${completed} completed`;
  document.getElementById('stat-deposits-collected').textContent = formatCurrency(deposits);
  document.getElementById('stat-projected-rev').textContent = formatCurrency(revenue);
  document.getElementById('stat-walkin-count').textContent = walkinCount;
  document.getElementById('stat-walkin-wait').textContent = `Avg wait: ${walkinCount * 20} min`;
}

function renderTimelineStream() {
  const container = document.getElementById('schedule-timeline-list');
  if (!container) return;

  const today = getTodayDateString();
  let list = appState.appointments.filter(a => a.date === today);

  if (appState.dashFilterBarber !== 'all') {
    list = list.filter(a => a.barber_id === appState.dashFilterBarber);
  }

  list.sort((a, b) => timeToMin(a.start_time) - timeToMin(b.start_time));

  if (list.length === 0) {
    container.innerHTML = `<div class="alert-empty">No appointments scheduled for today under this filter.</div>`;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="timeline-item status-${item.status}">
      <div class="item-time-col">
        <div class="item-time">${formatTime12(item.start_time)}</div>
        <div class="item-duration">${item.end_time ? formatTime12(item.end_time) : ''}</div>
      </div>

      <div class="item-info-col">
        <div class="client-name-row">
          <strong>${item.client_name}</strong>
          <span class="status-badge ${item.status}">${item.status.replace('_', ' ')}</span>
        </div>
        <div class="appt-sub-details">
          <span>✂️ ${item.service_name} (${formatCurrency(item.service_price)})</span> • 
          <span>💈 Barber: <strong>${item.barber_name}</strong></span> • 
          <span>📞 ${item.client_phone}</span>
        </div>
      </div>

      <div class="item-action-col">
        ${item.status === 'confirmed' ? `
          <button type="button" class="btn-action btn-action-arrived" data-id="${item.id}">Arrived</button>
        ` : ''}
        ${item.status === 'arrived' ? `
          <button type="button" class="btn-action btn-action-done" data-id="${item.id}">Mark Done</button>
        ` : ''}
        ${item.status !== 'completed' && item.status !== 'no_show' ? `
          <button type="button" class="btn-action btn-action-noshow" data-id="${item.id}">No-Show</button>
        ` : ''}
        <a href="https://wa.me/${item.client_phone.replace(/[^0-9]/g, '')}?text=Habari+${encodeURIComponent(item.client_name)}+from+The+Noble+Blade" target="_blank" class="btn-action" title="WhatsApp Client">
          💬
        </a>
      </div>
    </div>
  `).join('');

  // Attach status action events
  container.querySelectorAll('.btn-action-arrived').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      await API.updateAppointmentStatus(id, 'arrived');
      showToast('Client marked as arrived & seated in chair!', '💺');
      refreshDashboard();
    });
  });

  container.querySelectorAll('.btn-action-done').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      await API.updateAppointmentStatus(id, 'completed');
      showToast('Cut completed and payment closed!', '✂️');
      refreshDashboard();
    });
  });

  container.querySelectorAll('.btn-action-noshow').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      await API.updateAppointmentStatus(id, 'no_show');
      showToast('Logged appointment as No-Show. Strike added.', '❌');
      refreshDashboard();
    });
  });
}

function renderWalkinTable() {
  const tbody = document.getElementById('walkins-table-body');
  if (!tbody) return;

  const list = appState.walkins.filter(w => w.status === 'waiting');

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;">No walk-in clients waiting right now.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(item => `
    <tr>
      <td><strong>${item.client_name}</strong><br><small>${item.client_phone}</small></td>
      <td>${item.service_name}</td>
      <td>${item.barber_name}</td>
      <td><span class="badge-tag tag-success">~${item.estimated_wait_min} min</span></td>
      <td><span class="status-badge arrived">Waiting</span></td>
      <td>
        <button type="button" class="btn btn-sm btn-primary btn-seat-walkin" data-id="${item.id}">Seat in Chair</button>
        <button type="button" class="btn btn-sm btn-secondary btn-cancel-walkin" data-id="${item.id}">Remove</button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.btn-seat-walkin').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      await API.updateWalkinStatus(id, 'seated');
      showToast('Walk-in client seated in chair!', '💺');
      refreshDashboard();
    });
  });

  tbody.querySelectorAll('.btn-cancel-walkin').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      await API.updateWalkinStatus(id, 'cancelled');
      refreshDashboard();
    });
  });
}

function renderClientsTable(filterQuery = '') {
  const tbody = document.getElementById('clients-table-body');
  if (!tbody) return;

  let list = appState.clients;
  if (filterQuery) {
    const q = filterQuery.toLowerCase();
    list = list.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q));
  }

  tbody.innerHTML = list.map(c => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td>${c.phone}</td>
      <td>${c.visit_count} cuts</td>
      <td>${c.last_visit || 'Recent'}</td>
      <td>
        ${c.no_show_count > 0 
          ? `<span class="badge-tag tag-danger">${c.no_show_count} strike(s)</span>`
          : `<span class="badge-tag tag-success">Reliable</span>`}
      </td>
      <td>
        <a href="https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=Habari+${encodeURIComponent(c.name)}+from+The+Noble+Blade" target="_blank" class="btn-action">
          💬 WhatsApp
        </a>
      </td>
    </tr>
  `).join('');
}

function renderServicesManager() {
  const tbody = document.getElementById('services-mgmt-tbody');
  if (!tbody) return;

  tbody.innerHTML = appState.services.map(s => `
    <tr>
      <td><strong>${s.name}</strong></td>
      <td>${s.category}</td>
      <td>${formatCurrency(s.price)}</td>
      <td>⏱️ ${s.duration_min} min</td>
      <td>
        <span class="badge-tag ${s.is_active ? 'tag-success' : 'tag-danger'}">
          ${s.is_active ? 'Active' : 'Disabled'}
        </span>
      </td>
      <td>
        <div style="display:flex;gap:0.4rem;align-items:center;">
          <button type="button" class="btn btn-sm btn-secondary btn-edit-srv" data-id="${s.id}">Edit</button>
          <button type="button" class="btn btn-sm btn-secondary btn-toggle-srv" data-id="${s.id}" title="${s.is_active ? 'Disable' : 'Enable'}">
            ${s.is_active ? 'Disable' : 'Enable'}
          </button>
          <button type="button" class="btn btn-sm btn-action-noshow btn-delete-srv" data-id="${s.id}" title="Delete Service">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.btn-edit-srv').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const srv = appState.services.find(s => s.id === id);
      openServiceEditModal(srv);
    });
  });

  tbody.querySelectorAll('.btn-toggle-srv').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const srv = appState.services.find(s => s.id === id);
      if (srv) {
        srv.is_active = !srv.is_active;
        await API.saveService(srv);
        showToast(`${srv.name} is now ${srv.is_active ? 'Active' : 'Disabled'}!`, '✂️');
        renderServices();
        renderServicesManager();
      }
    });
  });

  tbody.querySelectorAll('.btn-delete-srv').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const srv = appState.services.find(s => s.id === id);
      if (confirm(`Are you sure you want to delete "${srv?.name}"?`)) {
        appState.services = appState.services.filter(s => s.id !== id);
        await API.deleteService(id);
        showToast('Service deleted from menu.', '🗑️');
        renderServices();
        renderServicesManager();
      }
    });
  });
}

function renderBarbersManager() {
  const container = document.getElementById('barbers-mgmt-grid');
  if (!container) return;

  container.innerHTML = appState.barbers.map(b => `
    <div class="barber-mgmt-card ${!b.is_active ? 'opacity-50' : ''}">
      <div class="barber-mgmt-header">
        <img src="${b.photo}" alt="${b.name}">
        <div>
          <h4>${b.name}</h4>
          <small class="text-gold">${b.nickname || 'Master Barber'}</small>
        </div>
      </div>
      <p style="font-size:0.85rem;color:var(--text-muted);">${b.specialty}</p>
      <div style="font-size:0.8rem;color:var(--text-dim);border-top:1px solid var(--border-subtle);padding-top:0.5rem;display:flex;justify-content:space-between;align-items:center;">
        <span>Shift: <strong>${formatTime12(b.working_hours?.start)} – ${formatTime12(b.working_hours?.end)}</strong></span>
        <span class="badge-tag ${b.is_active ? 'tag-success' : 'tag-danger'}">${b.is_active ? 'Active' : 'Off Duty'}</span>
      </div>
      <div style="display:flex;gap:0.5rem;margin-top:0.5rem;">
        <button type="button" class="btn btn-sm btn-secondary btn-edit-barber" data-id="${b.id}" style="flex:1;">Edit Profile</button>
        <button type="button" class="btn btn-sm btn-secondary btn-toggle-barber" data-id="${b.id}">
          ${b.is_active ? 'Set Off' : 'Set Active'}
        </button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.btn-edit-barber').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const b = appState.barbers.find(barb => barb.id === id);
      openBarberEditModal(b);
    });
  });

  container.querySelectorAll('.btn-toggle-barber').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const b = appState.barbers.find(barb => barb.id === id);
      if (b) {
        b.is_active = !b.is_active;
        await API.saveBarber(b);
        showToast(`${b.name} chair status set to ${b.is_active ? 'Active' : 'Off Duty'}.`, '💈');
        renderBarbers();
        renderBarbersManager();
      }
    });
  });
}

function openBarberEditModal(barber = null) {
  const dialog = document.getElementById('barber-edit-dialog');
  if (!dialog) return;

  document.getElementById('edit-barber-id').value = barber ? barber.id : '';
  document.getElementById('edit-barber-name').value = barber ? barber.name : '';
  document.getElementById('edit-barber-nickname').value = barber ? (barber.nickname || '') : '';
  document.getElementById('edit-barber-specialty').value = barber ? barber.specialty : '';
  document.getElementById('edit-barber-photo').value = barber ? barber.photo : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';
  document.getElementById('edit-barber-start').value = barber?.working_hours?.start || '08:30';
  document.getElementById('edit-barber-end').value = barber?.working_hours?.end || '20:00';
  document.getElementById('edit-barber-active').checked = barber ? barber.is_active : true;

  document.getElementById('barber-modal-title').textContent = barber ? 'Edit Barber Profile' : 'Add New Barber';
  dialog.showModal();
}

function renderEarningsTable() {
  const tbody = document.getElementById('earnings-table-body');
  if (!tbody) return;

  const appts = appState.appointments || [];
  
  // Calculate summary stats
  const completedAppts = appts.filter(a => a.status === 'completed' || a.status === 'arrived');
  const grossRev = completedAppts.reduce((sum, a) => sum + (a.service_price || 0), 0);
  const clearedDeposits = appts.filter(a => a.deposit_paid).reduce((sum, a) => sum + (a.deposit_amount || 300), 0);
  const barberCommissions = Math.round(grossRev * 0.5);
  const shopNet = grossRev - barberCommissions;

  const grossEl = document.getElementById('stat-gross-revenue');
  const depEl = document.getElementById('stat-deposits-cleared');
  const commEl = document.getElementById('stat-barber-commission');
  const netEl = document.getElementById('stat-shop-net');

  if (grossEl) grossEl.textContent = formatCurrency(grossRev);
  if (depEl) depEl.textContent = formatCurrency(clearedDeposits);
  if (commEl) commEl.textContent = formatCurrency(barberCommissions);
  if (netEl) netEl.textContent = formatCurrency(shopNet);

  // Group by barber
  tbody.innerHTML = appState.barbers.map(b => {
    const bAppts = appts.filter(a => a.barber_id === b.id);
    const bCompleted = bAppts.filter(a => a.status === 'completed');
    const bDeposits = bAppts.filter(a => a.deposit_paid).reduce((sum, a) => sum + (a.deposit_amount || 300), 0);
    const bGross = bCompleted.reduce((sum, a) => sum + (a.service_price || 0), 0);
    const bCommission = Math.round(bGross * 0.5);
    const bShopShare = bGross - bCommission;

    return `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <img src="${b.photo}" alt="${b.name}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:1px solid var(--border-gold);">
            <div>
              <strong>${b.name}</strong><br>
              <small class="text-gold">${b.nickname || 'Master Barber'}</small>
            </div>
          </div>
        </td>
        <td><strong class="text-gold">${bCompleted.length}</strong> cuts</td>
        <td>${bAppts.length} bookings</td>
        <td>${formatCurrency(bDeposits)}</td>
        <td><strong>${formatCurrency(bGross)}</strong></td>
        <td><span class="badge-tag tag-success">${formatCurrency(bCommission)}</span></td>
        <td><span class="badge-tag tag-success">${formatCurrency(bShopShare)}</span></td>
      </tr>
    `;
  }).join('');
}

function openServiceEditModal(srv = null) {
  const dialog = document.getElementById('service-edit-dialog');
  if (!dialog) return;

  document.getElementById('edit-srv-id').value = srv ? srv.id : '';
  document.getElementById('edit-srv-name').value = srv ? srv.name : '';
  document.getElementById('edit-srv-price').value = srv ? srv.price : 800;
  document.getElementById('edit-srv-duration').value = srv ? srv.duration_min : 30;
  document.getElementById('edit-srv-category').value = srv ? srv.category : 'Haircut';
  document.getElementById('edit-srv-desc').value = srv ? srv.description : '';
  document.getElementById('edit-srv-active').checked = srv ? srv.is_active : true;

  document.getElementById('srv-modal-title').textContent = srv ? 'Edit Service' : 'Add New Service';
  dialog.showModal();
}

// ================= EVENT INITIALIZATION =================

function initEventListeners() {
  // Navigation / View Switcher
  const btnToggleView = document.getElementById('btn-toggle-view');
  const btnBackToSite = document.getElementById('btn-back-to-site');
  const footerStaffLogin = document.getElementById('footer-staff-login');

  const switchView = (targetView) => {
    appState.view = targetView;
    const custView = document.getElementById('customer-view');
    const dashView = document.getElementById('dashboard-view');
    const floatCust = document.getElementById('float-tab-customer');
    const floatAdmin = document.getElementById('float-tab-admin');

    if (targetView === 'dashboard') {
      custView.classList.add('hidden');
      dashView.classList.remove('hidden');
      if (btnToggleView) btnToggleView.textContent = '👤 Back to Customer Site';
      if (floatCust) floatCust.classList.remove('active');
      if (floatAdmin) floatAdmin.classList.add('active');
      refreshDashboard();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      dashView.classList.add('hidden');
      custView.classList.remove('hidden');
      if (btnToggleView) btnToggleView.textContent = '👔 Staff / Owner Dashboard';
      if (floatAdmin) floatAdmin.classList.remove('active');
      if (floatCust) floatCust.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  btnToggleView?.addEventListener('click', () => {
    switchView(appState.view === 'customer' ? 'dashboard' : 'customer');
  });

  // Admin Navbar & Floating Buttons
  document.getElementById('nav-btn-admin')?.addEventListener('click', (e) => {
    // If inside index.html and customer wants clean page redirect or view toggle
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
      // Direct navigation to dedicated admin page
      window.location.href = 'admin.html';
    } else {
      window.location.href = '/admin';
    }
  });
  document.getElementById('nav-link-admin')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'admin.html';
  });

  // Floating Demo Quick Switcher
  document.getElementById('float-tab-customer')?.addEventListener('click', () => {
    if (document.getElementById('customer-view')) {
      switchView('customer');
    } else {
      window.location.href = 'index.html';
    }
  });
  document.getElementById('float-tab-admin')?.addEventListener('click', () => {
    window.location.href = 'admin.html';
  });
  document.getElementById('btn-demo-back-home')?.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  // Quick Seed Test Appointment (for live owner sales demonstration)
  document.getElementById('btn-seed-test-appt')?.addEventListener('click', async () => {
    const demoNames = ['Governor Johnson Sakaja', 'Maina Kageni', 'Khaligraph Jones', 'Brian Chira', 'Dr. David Ndii'];
    const randomName = demoNames[Math.floor(Math.random() * demoNames.length)];
    const randomTime = ['10:00', '12:30', '15:30', '17:00'][Math.floor(Math.random() * 4)];
    const testAppt = {
      client_name: randomName,
      client_phone: '+2547' + Math.floor(10000000 + Math.random() * 90000000),
      barber_id: 'barb_1',
      service_id: 'srv_2',
      date: getTodayDateString(),
      start_time: randomTime,
      deposit_paid: true,
      mpesa_ref: 'DEMO' + Math.random().toString(36).substring(2, 7).toUpperCase()
    };
    await API.createAppointment(testAppt);
    showToast(`⚡ Demo booking added for ${randomName} at ${randomTime}!`, '🎉');
    refreshDashboard();
  });

  if (btnBackToSite) btnBackToSite.addEventListener('click', () => switchView('customer'));
  if (footerStaffLogin) footerStaffLogin.addEventListener('click', () => switchView('dashboard'));

  // Booking buttons
  document.getElementById('btn-start-booking')?.addEventListener('click', () => openBookingWizard());
  document.getElementById('hero-book-btn')?.addEventListener('click', () => openBookingWizard());
  document.getElementById('footer-book-btn')?.addEventListener('click', () => openBookingWizard());

  // Category filters
  document.querySelectorAll('#service-filters .filter-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('#service-filters .filter-tab').forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const cat = e.currentTarget.getAttribute('data-category');
      renderServices(cat);
    });
  });

  // Wizard Dialog Buttons
  document.getElementById('btn-close-booking')?.addEventListener('click', () => {
    document.getElementById('booking-dialog').close();
  });

  document.getElementById('wizard-prev-btn')?.addEventListener('click', () => {
    if (appState.booking.step > 1) {
      appState.booking.step--;
      updateWizardUI();
    }
  });

  document.getElementById('wizard-next-btn')?.addEventListener('click', () => {
    if (appState.booking.step === 4) {
      startMpesaStkPushFlow();
    } else {
      appState.booking.step++;
      updateWizardUI();
    }
  });

  // Date input change in Step 3
  document.getElementById('booking-date-input')?.addEventListener('change', () => {
    renderWizardSlots();
  });

  // Customer form inputs
  const checkCustomerValid = () => {
    if (appState.booking.step === 4) {
      document.getElementById('wizard-next-btn').disabled = !validateCustomerForm();
    }
  };
  document.getElementById('cust-name')?.addEventListener('input', checkCustomerValid);
  document.getElementById('cust-phone')?.addEventListener('input', checkCustomerValid);

  // STK Push Dialog
  document.getElementById('btn-stk-cancel')?.addEventListener('click', () => {
    document.getElementById('stk-dialog').close();
  });
  document.getElementById('btn-stk-confirm')?.addEventListener('click', handleStkConfirm);

  // Confirmation Dialog Close
  document.getElementById('btn-close-confirmation')?.addEventListener('click', () => {
    document.getElementById('confirmation-dialog').close();
  });

  // Add to Calendar Generator (.ics)
  document.getElementById('btn-conf-calendar')?.addEventListener('click', () => {
    const s = appState.booking.service;
    const b = appState.booking.barber;
    const slot = appState.booking.slot;
    const date = appState.booking.date;

    const [sh, sm] = slot.time.split(':');
    const startIso = `${date.replace(/-/g, '')}T${sh}${sm}00`;
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//The Noble Blade//Barbershop Booking//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${s.name} at The Noble Blade`,
      `DESCRIPTION:Appointment with ${b ? b.name : 'Master Barber'}. Location: Woodvale Grove, Westlands.`,
      `LOCATION:Woodvale Grove, Westlands, Nairobi`,
      `DTSTART:${startIso}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'appointment.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Appointment added to your calendar!', '📅');
  });

  // Dashboard Tabs
  document.querySelectorAll('.dash-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.dash-tab-pane').forEach(p => p.classList.remove('active'));

      e.currentTarget.classList.add('active');
      const targetId = `tab-${e.currentTarget.getAttribute('data-tab')}`;
      const pane = document.getElementById(targetId);
      if (pane) pane.classList.add('active');
    });
  });

  // Dashboard Barber Filter Dropdown
  const dashBarberSelect = document.getElementById('dash-barber-filter');
  if (dashBarberSelect) {
    appState.barbers.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b.id;
      opt.textContent = `💈 ${b.name}`;
      dashBarberSelect.appendChild(opt);
    });

    dashBarberSelect.addEventListener('change', (e) => {
      appState.dashFilterBarber = e.target.value;
      renderTimelineStream();
    });
  }

  // Dashboard Walkin Modal
  document.getElementById('btn-open-walkin-modal')?.addEventListener('click', () => {
    const sSelect = document.getElementById('walkin-service');
    const bSelect = document.getElementById('walkin-barber');
    sSelect.innerHTML = appState.services.map(s => `<option value="${s.id}">${s.name} (${formatCurrency(s.price)})</option>`).join('');
    bSelect.innerHTML = `<option value="any">First Available Chair</option>` + appState.barbers.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
    document.getElementById('walkin-dialog').showModal();
  });
  document.getElementById('btn-add-walkin-shortcut')?.addEventListener('click', () => {
    document.getElementById('btn-open-walkin-modal')?.click();
  });
  document.getElementById('btn-close-walkin')?.addEventListener('click', () => document.getElementById('walkin-dialog').close());
  document.getElementById('btn-cancel-walkin')?.addEventListener('click', () => document.getElementById('walkin-dialog').close());

  document.getElementById('form-add-walkin')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('walkin-name').value.trim();
    const phone = document.getElementById('walkin-phone').value.trim();
    const serviceId = document.getElementById('walkin-service').value;
    const barberId = document.getElementById('walkin-barber').value;

    const s = appState.services.find(item => item.id === serviceId);
    const b = appState.barbers.find(item => item.id === barberId);

    await API.addWalkin({
      client_name: name,
      client_phone: phone,
      service_id: serviceId,
      service_name: s ? s.name : 'Cut',
      barber_id: barberId,
      barber_name: b ? b.name : 'First Available',
      service_duration: s ? s.duration_min : 30
    });

    document.getElementById('walkin-dialog').close();
    showToast(`Added ${name} to walk-in queue!`, '🚶‍♂️');
    refreshDashboard();
  });

  // Client Search Filter
  document.getElementById('client-search-input')?.addEventListener('input', (e) => {
    renderClientsTable(e.target.value.trim());
  });

  // Time off modal
  document.getElementById('btn-open-timeoff-modal')?.addEventListener('click', () => {
    const bSelect = document.getElementById('to-barber');
    bSelect.innerHTML = appState.barbers.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
    document.getElementById('to-date').value = getTodayDateString();
    document.getElementById('timeoff-dialog').showModal();
  });
  document.getElementById('btn-close-timeoff')?.addEventListener('click', () => document.getElementById('timeoff-dialog').close());
  document.getElementById('btn-cancel-timeoff')?.addEventListener('click', () => document.getElementById('timeoff-dialog').close());

  document.getElementById('form-add-timeoff')?.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('timeoff-dialog').close();
    showToast('Barber schedule blocked out successfully.', '⏳');
  });

  // Services Edit/Add Modal
  document.getElementById('btn-add-service-modal')?.addEventListener('click', () => openServiceEditModal());
  document.getElementById('btn-close-service-edit')?.addEventListener('click', () => document.getElementById('service-edit-dialog').close());
  document.getElementById('btn-cancel-service-edit')?.addEventListener('click', () => document.getElementById('service-edit-dialog').close());

  document.getElementById('form-service-edit')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-srv-id').value;
    const name = document.getElementById('edit-srv-name').value.trim();
    const price = Number(document.getElementById('edit-srv-price').value);
    const duration = Number(document.getElementById('edit-srv-duration').value);
    const category = document.getElementById('edit-srv-category').value;
    const desc = document.getElementById('edit-srv-desc').value.trim();
    const isActive = document.getElementById('edit-srv-active').checked;

    const servicePayload = {
      id: id || undefined,
      name,
      price,
      duration_min: duration,
      category,
      description: desc,
      is_active: isActive
    };

    if (id) {
      const existing = appState.services.find(s => s.id === id);
      if (existing) {
        existing.name = name;
        existing.price = price;
        existing.duration_min = duration;
        existing.category = category;
        existing.description = desc;
        existing.is_active = isActive;
      }
    } else {
      appState.services.push({
        id: `srv_${Date.now()}`,
        name,
        price,
        duration_min: duration,
        category,
        description: desc,
        is_active: isActive
      });
    }

    await API.saveService(servicePayload);
    document.getElementById('service-edit-dialog').close();
    showToast('Service menu updated and synced!', '✂️');
    renderServices();
    renderServicesManager();
  });

  // Barbers Edit/Add Modal
  document.getElementById('btn-add-barber-modal')?.addEventListener('click', () => openBarberEditModal());
  document.getElementById('btn-close-barber-edit')?.addEventListener('click', () => document.getElementById('barber-edit-dialog').close());
  document.getElementById('btn-cancel-barber-edit')?.addEventListener('click', () => document.getElementById('barber-edit-dialog').close());

  document.getElementById('form-barber-edit')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-barber-id').value;
    const name = document.getElementById('edit-barber-name').value.trim();
    const nickname = document.getElementById('edit-barber-nickname').value.trim();
    const specialty = document.getElementById('edit-barber-specialty').value.trim();
    const photo = document.getElementById('edit-barber-photo').value.trim();
    const start = document.getElementById('edit-barber-start').value;
    const end = document.getElementById('edit-barber-end').value;
    const isActive = document.getElementById('edit-barber-active').checked;

    const barberPayload = {
      id: id || undefined,
      name,
      nickname,
      specialty,
      photo: photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      working_hours: { start, end },
      is_active: isActive
    };

    if (id) {
      const existing = appState.barbers.find(b => b.id === id);
      if (existing) {
        existing.name = name;
        existing.nickname = nickname;
        existing.specialty = specialty;
        existing.photo = barberPayload.photo;
        existing.working_hours = { start, end };
        existing.is_active = isActive;
      }
    } else {
      appState.barbers.push({
        id: `barb_${Date.now()}`,
        name,
        nickname,
        specialty,
        photo: barberPayload.photo,
        rating: 5.0,
        review_count: 0,
        working_hours: { start, end },
        is_active: isActive
      });
    }

    await API.saveBarber(barberPayload);
    document.getElementById('barber-edit-dialog').close();
    showToast(`Barber profile for ${name} saved!`, '💈');
    renderBarbers();
    renderBarbersManager();
    refreshDashboard();
  });

  // Time off modal submission
  document.getElementById('form-add-timeoff')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const barberId = document.getElementById('to-barber').value;
    const date = document.getElementById('to-date').value;
    const startTime = document.getElementById('to-start').value;
    const endTime = document.getElementById('to-end').value;
    const reason = document.getElementById('to-reason').value;

    const barber = appState.barbers.find(b => b.id === barberId);
    await API.blockTimeOff({
      barber_id: barberId,
      date,
      start_time: startTime,
      end_time: endTime,
      reason
    });

    document.getElementById('timeoff-dialog').close();
    showToast(`Time off blocked for ${barber ? barber.name : 'Barber'} on ${date} (${startTime} - ${endTime})`, '⏳');
  });

  // Export CSV Reports
  document.getElementById('btn-export-reports')?.addEventListener('click', () => {
    const appts = appState.appointments || [];
    if (appts.length === 0) {
      showToast('No booking records to export yet.', 'ℹ️');
      return;
    }

    const headers = ['ID', 'Date', 'Time', 'Client', 'Phone', 'Service', 'Barber', 'Price_KES', 'Deposit_KES', 'Mpesa_Ref', 'Status'];
    const rows = appts.map(a => [
      a.id,
      a.date,
      a.start_time,
      `"${a.client_name}"`,
      a.client_phone,
      `"${a.service_name}"`,
      `"${a.barber_name}"`,
      a.service_price,
      a.deposit_amount || 300,
      a.mpesa_ref || 'N/A',
      a.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `sam_kitiki_kutz_report_${getTodayDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Earnings and appointment report exported to CSV!', '📥');
  });

  // Refresh button in timeline
  document.getElementById('btn-refresh-dashboard')?.addEventListener('click', () => {
    refreshDashboard();
    showToast('Dashboard data refreshed.', '🔄');
  });

  // Settings form
  const settingsForm = document.getElementById('form-shop-settings');
  if (settingsForm) {
    document.getElementById('setting-shop-name').value = appState.settings.shop_name;
    document.getElementById('setting-phone').value = appState.settings.phone;
    document.getElementById('setting-location').value = appState.settings.location;
    document.getElementById('setting-open-time').value = appState.settings.opening_time;
    document.getElementById('setting-close-time').value = appState.settings.closing_time;
    document.getElementById('setting-deposit').value = appState.settings.deposit_amount;
    document.getElementById('setting-cancel-hours').value = appState.settings.cancellation_window_hours;

    settingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      appState.settings.shop_name = document.getElementById('setting-shop-name').value;
      appState.settings.phone = document.getElementById('setting-phone').value;
      appState.settings.location = document.getElementById('setting-location').value;
      appState.settings.opening_time = document.getElementById('setting-open-time').value;
      appState.settings.closing_time = document.getElementById('setting-close-time').value;
      appState.settings.deposit_amount = Number(document.getElementById('setting-deposit').value);
      appState.settings.cancellation_window_hours = Number(document.getElementById('setting-cancel-hours').value);

      await API.saveSettings(appState.settings);
      showToast('Lounge and M-Pesa settings saved successfully!', '⚙️');
    });
  }
}

// Initial Boot
async function initApp() {
  await Promise.all([
    API.fetchSettings(),
    API.fetchServices(),
    API.fetchBarbers(),
    API.fetchAppointments()
  ]);

  renderServices();
  renderBarbers();
  initEventListeners();
  refreshDashboard();
}

document.addEventListener('DOMContentLoaded', initApp);

