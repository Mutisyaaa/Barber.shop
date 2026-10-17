const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database handling
let db = {};

function loadDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      db = JSON.parse(raw);
    } else {
      console.warn("DB file not found, starting with empty DB");
      db = {
        settings: {},
        services: [],
        barbers: [],
        clients: [],
        appointments: [],
        walkin_queue: [],
        payments: [],
        time_off: []
      };
    }
  } catch (err) {
    console.error("Error reading db.json:", err);
  }
}

function saveDb() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error saving db.json:", err);
  }
}

loadDb();

// Helper functions for time handling
function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(totalMin) {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatTime12(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
}

// Slot availability calculation engine
function calculateAvailableSlots(dateStr, durationMin, barberId = 'any') {
  durationMin = parseInt(durationMin, 10) || 30;
  const step = db.settings.slot_step_min || 15;
  const activeBarbers = db.barbers.filter(b => b.is_active);

  const targetBarbers = barberId === 'any' 
    ? activeBarbers 
    : activeBarbers.filter(b => b.id === barberId);

  if (targetBarbers.length === 0) return [];

  // Appointments on that date that occupy chair
  const activeAppts = (db.appointments || []).filter(a => 
    a.date === dateStr && a.status !== 'cancelled' && a.status !== 'no_show'
  );

  // Time off blocks on that date
  const timeOffs = (db.time_off || []).filter(t => t.date === dateStr);

  const slotMap = new Map(); // timeStr -> { time, formatted, availableBarberIds: [] }

  targetBarbers.forEach(barber => {
    const startMin = timeToMinutes(barber.working_hours?.start || db.settings.opening_time || '08:30');
    const endMin = timeToMinutes(barber.working_hours?.end || db.settings.closing_time || '20:00');

    const barberAppts = activeAppts.filter(a => a.barber_id === barber.id);
    const barberTimeOff = timeOffs.filter(t => t.barber_id === barber.id);

    for (let current = startMin; current + durationMin <= endMin; current += step) {
      const slotStart = current;
      const slotEnd = current + durationMin;

      // Check collision with appointments
      const hasApptCollision = barberAppts.some(appt => {
        const apptStart = timeToMinutes(appt.start_time);
        const apptEnd = timeToMinutes(appt.end_time);
        return !(slotEnd <= apptStart || slotStart >= apptEnd);
      });

      if (hasApptCollision) continue;

      // Check collision with time off
      const hasTimeOffCollision = barberTimeOff.some(to => {
        const toStart = timeToMinutes(to.start_time);
        const toEnd = timeToMinutes(to.end_time);
        return !(slotEnd <= toStart || slotStart >= toEnd);
      });

      if (hasTimeOffCollision) continue;

      const timeKey = minutesToTime(slotStart);
      if (!slotMap.has(timeKey)) {
        slotMap.set(timeKey, {
          time: timeKey,
          formatted: formatTime12(timeKey),
          barberIds: [barber.id],
          barberNames: [barber.name]
        });
      } else {
        const entry = slotMap.get(timeKey);
        entry.barberIds.push(barber.id);
        entry.barberNames.push(barber.name);
      }
    }
  });

  // Convert map to sorted array
  const sortedSlots = Array.from(slotMap.values()).sort((a, b) => 
    timeToMinutes(a.time) - timeToMinutes(b.time)
  );

  return sortedSlots;
}

// ================= API ROUTES =================

// 1. Settings
app.get('/api/settings', (req, res) => {
  res.json(db.settings);
});

app.put('/api/settings', (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  saveDb();
  res.json({ success: true, settings: db.settings });
});

// 2. Services
app.get('/api/services', (req, res) => {
  res.json(db.services);
});

app.post('/api/services', (req, res) => {
  const { name, category, price, duration_min, description, is_active } = req.body;
  if (!name || !price || !duration_min) {
    return res.status(400).json({ error: 'Name, price, and duration are required.' });
  }

  const existingIndex = db.services.findIndex(s => s.id === req.body.id);
  if (existingIndex >= 0) {
    db.services[existingIndex] = { ...db.services[existingIndex], ...req.body };
    saveDb();
    return res.json({ success: true, service: db.services[existingIndex] });
  }

  const newService = {
    id: `srv_${Date.now()}`,
    name,
    category: category || 'Haircut',
    price: Number(price),
    duration_min: Number(duration_min),
    description: description || '',
    popular: Boolean(req.body.popular),
    is_active: is_active !== undefined ? is_active : true
  };

  db.services.push(newService);
  saveDb();
  res.status(201).json({ success: true, service: newService });
});

app.delete('/api/services/:id', (req, res) => {
  db.services = db.services.filter(s => s.id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

// 3. Barbers
app.get('/api/barbers', (req, res) => {
  res.json(db.barbers);
});

app.post('/api/barbers', (req, res) => {
  const { name, nickname, photo, specialty, working_hours, is_active } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Barber name is required.' });
  }

  const existingIndex = db.barbers.findIndex(b => b.id === req.body.id);
  if (existingIndex >= 0) {
    db.barbers[existingIndex] = { ...db.barbers[existingIndex], ...req.body };
    saveDb();
    return res.json({ success: true, barber: db.barbers[existingIndex] });
  }

  const newBarber = {
    id: `barb_${Date.now()}`,
    name,
    nickname: nickname || '',
    photo: photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    specialty: specialty || 'General Grooming',
    rating: 5.0,
    review_count: 0,
    working_hours: working_hours || { start: '08:30', end: '20:00' },
    is_active: is_active !== undefined ? is_active : true
  };

  db.barbers.push(newBarber);
  saveDb();
  res.status(201).json({ success: true, barber: newBarber });
});

// 4. Slots availability
app.get('/api/slots', (req, res) => {
  const { date, duration, barberId } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'Date query parameter is required (YYYY-MM-DD).' });
  }

  const slots = calculateAvailableSlots(date, duration || 30, barberId || 'any');
  res.json({ date, slots });
});

// 5. Appointments
app.get('/api/appointments', (req, res) => {
  let list = db.appointments || [];
  if (req.query.date) {
    list = list.filter(a => a.date === req.query.date);
  }
  if (req.query.barberId) {
    list = list.filter(a => a.barber_id === req.query.barberId);
  }
  res.json(list);
});

app.post('/api/appointments', (req, res) => {
  const {
    client_name,
    client_phone,
    barber_id,
    service_id,
    date,
    start_time,
    notes,
    deposit_paid,
    mpesa_ref
  } = req.body;

  if (!client_name || !client_phone || !service_id || !date || !start_time) {
    return res.status(400).json({ error: 'Missing required appointment fields.' });
  }

  const service = db.services.find(s => s.id === service_id);
  if (!service) {
    return res.status(400).json({ error: 'Invalid service ID.' });
  }

  let assignedBarberId = barber_id;
  if (!assignedBarberId || assignedBarberId === 'any') {
    // Auto-assign: find available barbers for this slot
    const slots = calculateAvailableSlots(date, service.duration_min, 'any');
    const matchingSlot = slots.find(s => s.time === start_time);
    if (!matchingSlot || matchingSlot.barberIds.length === 0) {
      return res.status(400).json({ error: 'Selected slot is no longer available.' });
    }
    // Pick the barber with fewest appointments on that day for balance
    const barberCounts = matchingSlot.barberIds.map(bId => {
      const count = db.appointments.filter(a => a.barber_id === bId && a.date === date).length;
      return { barberId: bId, count };
    });
    barberCounts.sort((a, b) => a.count - b.count);
    assignedBarberId = barberCounts[0].barberId;
  }

  const barber = db.barbers.find(b => b.id === assignedBarberId);
  if (!barber) {
    return res.status(400).json({ error: 'Barber not found.' });
  }

  // Calculate end_time
  const startMin = timeToMinutes(start_time);
  const endMin = startMin + service.duration_min;
  const end_time = minutesToTime(endMin);

  // Client lookup or create
  let client = db.clients.find(c => c.phone === client_phone);
  if (!client) {
    client = {
      id: `cli_${Date.now()}`,
      name: client_name,
      phone: client_phone,
      visit_count: 1,
      last_visit: date,
      no_show_count: 0,
      preferred_barber_id: assignedBarberId
    };
    db.clients.push(client);
  } else {
    client.visit_count += 1;
    client.last_visit = date;
    client.name = client_name; // Update name if changed
  }

  const appointmentId = `apt_${Date.now()}`;
  const depositAmount = db.settings.deposit_amount || 300;
  const actualRef = mpesa_ref || `NL${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  const newAppointment = {
    id: appointmentId,
    client_id: client.id,
    client_name: client.name,
    client_phone: client.phone,
    barber_id: barber.id,
    barber_name: barber.name,
    service_id: service.id,
    service_name: service.name,
    service_price: service.price,
    date,
    start_time,
    end_time,
    status: 'confirmed',
    deposit_paid: deposit_paid !== undefined ? deposit_paid : true,
    deposit_amount: depositAmount,
    mpesa_ref: actualRef,
    notes: notes || '',
    is_walkin: false,
    created_at: new Date().toISOString()
  };

  db.appointments.push(newAppointment);

  // Record payment
  if (newAppointment.deposit_paid) {
    db.payments.push({
      id: `pay_${Date.now()}`,
      appointment_id: appointmentId,
      mpesa_ref: actualRef,
      phone: client_phone,
      amount: depositAmount,
      status: 'completed',
      timestamp: new Date().toISOString()
    });
  }

  saveDb();

  // Generate automated WhatsApp confirmation link & SMS notification payload
  const whatsappMessage = encodeURIComponent(
    `💈 *The Noble Blade Barber Lounge*\n\nHabari ${client_name}! Your booking is *CONFIRMED*.\n\n✂️ Service: ${service.name}\n🧔 Barber: ${barber.name}\n📅 Date: ${date}\n⏰ Time: ${formatTime12(start_time)}\n💰 M-Pesa Deposit: KES ${depositAmount} (Ref: ${actualRef})\n📍 Location: ${db.settings.location}\n\nPlease arrive 5 minutes early. See you in the chair!`
  );

  const cleanPhone = client_phone.replace(/[^0-9]/g, '');

  res.status(201).json({
    success: true,
    appointment: newAppointment,
    whatsappUrl: `https://wa.me/${cleanPhone}?text=${whatsappMessage}`,
    smsNotification: {
      recipient: client_phone,
      message: `The Noble Blade: Appointment confirmed with ${barber.name} on ${date} at ${formatTime12(start_time)}. Deposit KES ${depositAmount} received (Ref ${actualRef}).`
    }
  });
});

app.patch('/api/appointments/:id/status', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['confirmed', 'arrived', 'completed', 'no_show', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  const appt = db.appointments.find(a => a.id === req.params.id);
  if (!appt) {
    return res.status(404).json({ error: 'Appointment not found.' });
  }

  appt.status = status;

  // If marked no-show, increment client penalty
  if (status === 'no_show') {
    const client = db.clients.find(c => c.id === appt.client_id || c.phone === appt.client_phone);
    if (client) {
      client.no_show_count = (client.no_show_count || 0) + 1;
    }
  }

  saveDb();
  res.json({ success: true, appointment: appt });
});

// 6. Walk-in Queue
app.get('/api/walkin', (req, res) => {
  res.json(db.walkin_queue || []);
});

app.post('/api/walkin', (req, res) => {
  const { client_name, client_phone, service_id, barber_id } = req.body;
  if (!client_name || !service_id) {
    return res.status(400).json({ error: 'Client name and service required.' });
  }

  const service = db.services.find(s => s.id === service_id);
  const barber = db.barbers.find(b => b.id === barber_id);

  // Estimate wait time based on queue length
  const queueLength = (db.walkin_queue || []).filter(w => w.status === 'waiting').length;
  const waitMin = Math.max(10, queueLength * 25 + 10);

  const walkin = {
    id: `wk_${Date.now()}`,
    client_name,
    client_phone: client_phone || 'N/A',
    service_id,
    service_name: service ? service.name : 'Haircut',
    barber_id: barber ? barber.id : 'any',
    barber_name: barber ? barber.name : 'First Available Barber',
    service_duration: service ? service.duration_min : 30,
    estimated_wait_min: waitMin,
    status: 'waiting',
    joined_at: new Date().toISOString()
  };

  db.walkin_queue = db.walkin_queue || [];
  db.walkin_queue.push(walkin);
  saveDb();
  res.status(201).json({ success: true, walkin });
});

app.patch('/api/walkin/:id', (req, res) => {
  const { status } = req.body; // 'seated', 'completed', 'cancelled'
  const item = (db.walkin_queue || []).find(w => w.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Walk-in item not found.' });
  }

  item.status = status;
  saveDb();
  res.json({ success: true, walkin: item });
});

// 7. Time Off / Blocked Hours
app.get('/api/timeoff', (req, res) => {
  res.json(db.time_off || []);
});

app.post('/api/timeoff', (req, res) => {
  const { barber_id, date, start_time, end_time, reason } = req.body;
  if (!barber_id || !date || !start_time || !end_time) {
    return res.status(400).json({ error: 'All fields required.' });
  }

  const entry = {
    id: `to_${Date.now()}`,
    barber_id,
    date,
    start_time,
    end_time,
    reason: reason || 'Blocked Time'
  };

  db.time_off = db.time_off || [];
  db.time_off.push(entry);
  saveDb();
  res.status(201).json({ success: true, time_off: entry });
});

app.delete('/api/timeoff/:id', (req, res) => {
  db.time_off = (db.time_off || []).filter(t => t.id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

// 8. Clients
app.get('/api/clients', (req, res) => {
  res.json(db.clients || []);
});

// 9. Daraja M-Pesa STK Push Simulation / Gateway
app.post('/api/mpesa/stkpush', (req, res) => {
  const { phone, amount, reference } = req.body;

  if (!phone || !amount) {
    return res.status(400).json({ error: 'Phone number and deposit amount are required.' });
  }

  // Normalize Kenyan phone
  let normalized = phone.replace(/[^0-9]/g, '');
  if (normalized.startsWith('0')) {
    normalized = '254' + normalized.slice(1);
  } else if (!normalized.startsWith('254')) {
    normalized = '254' + normalized;
  }

  const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(Math.random() * 90000 + 10000)}`;
  const mpesaReceipt = `SH${Math.random().toString(36).substring(2, 8).toUpperCase()}9K`;

  // Return instant simulated response ready for client countdown
  setTimeout(() => {
    res.json({
      success: true,
      ResponseCode: "0",
      ResponseDescription: "Success. Request accepted for processing",
      MerchantRequestID: `29115-${Date.now()}-1`,
      CheckoutRequestID: checkoutRequestId,
      CustomerMessage: `Success. An STK push prompt has been dispatched to ${normalized}. Enter your M-Pesa PIN on your phone to complete deposit of KES ${amount}.`,
      simulatedReceipt: mpesaReceipt,
      amount: Number(amount),
      phone: normalized,
      timestamp: new Date().toISOString()
    });
  }, 600);
});

// 10. Dashboard Stats & Analytics
app.get('/api/dashboard/stats', (req, res) => {
  const targetDate = req.query.date || new Date().toISOString().split('T')[0];
  const appts = (db.appointments || []).filter(a => a.date === targetDate);

  const totalAppts = appts.length;
  const arrived = appts.filter(a => a.status === 'arrived').length;
  const completed = appts.filter(a => a.status === 'completed').length;
  const confirmed = appts.filter(a => a.status === 'confirmed').length;
  const noShows = appts.filter(a => a.status === 'no_show').length;

  const totalDeposits = appts
    .filter(a => a.deposit_paid)
    .reduce((sum, a) => sum + (a.deposit_amount || 0), 0);

  const projectedRevenue = appts
    .filter(a => a.status !== 'cancelled' && a.status !== 'no_show')
    .reduce((sum, a) => sum + (a.service_price || 0), 0);

  const walkinsCount = (db.walkin_queue || []).length;

  // Breakdown per barber
  const barberStats = (db.barbers || []).map(b => {
    const bAppts = appts.filter(a => a.barber_id === b.id);
    const completedCount = bAppts.filter(a => a.status === 'completed').length;
    const rev = bAppts.reduce((sum, a) => sum + (a.service_price || 0), 0);
    return {
      id: b.id,
      name: b.name,
      photo: b.photo,
      total_appointments: bAppts.length,
      completed_count: completedCount,
      revenue: rev
    };
  });

  res.json({
    date: targetDate,
    summary: {
      total_appointments: totalAppts,
      arrived,
      completed,
      confirmed,
      no_shows: noShows,
      total_deposits: totalDeposits,
      projected_revenue: projectedRevenue,
      walkins_in_queue: walkinsCount
    },
    barbers: barberStats,
    appointments: appts,
    walkins: db.walkin_queue || []
  });
});

// Clean HTML Page Routes
app.get('/services', (req, res) => res.sendFile(path.join(__dirname, 'public', 'services.html')));
app.get('/barbers', (req, res) => res.sendFile(path.join(__dirname, 'public', 'barbers.html')));
app.get(['/book', '/booking'], (req, res) => res.sendFile(path.join(__dirname, 'public', 'booking.html')));
app.get('/confirmation', (req, res) => res.sendFile(path.join(__dirname, 'public', 'confirmation.html')));
app.get('/gallery', (req, res) => res.sendFile(path.join(__dirname, 'public', 'gallery.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));
app.get(['/admin', '/dashboard'], (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// Catch-all route to serve the SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`💈 Barbershop MVP Server running on http://localhost:${PORT}`);
});
