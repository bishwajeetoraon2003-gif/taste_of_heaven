const { supabase, memoryDb } = require('../config/db');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

exports.createReservation = catchAsync(async (req, res, next) => {
  const {
    guestName,
    guestEmail,
    guestPhone,
    guestsCount,
    reservationDate,
    reservationTime,
    tableAtmosphere,
    specialNotes
  } = req.body;

  const refCode = `#TH-${Math.floor(10000 + Math.random() * 90000)}`;

  const resPayload = {
    reference_code: refCode,
    guest_name: guestName,
    guest_email: guestEmail,
    guest_phone: guestPhone,
    guests_count: parseInt(guestsCount),
    reservation_date: reservationDate,
    reservation_time: reservationTime,
    table_atmosphere: tableAtmosphere || 'Metropolis Skyline View',
    special_notes: specialNotes || '',
    status: 'confirmed'
  };

  // Direct Supabase Integration
  if (supabase) {
    const { data, error } = await supabase.from('reservations').insert([resPayload]).select().single();
    if (!error && data) {
      sendEmail({
        email: guestEmail,
        subject: `Reservation Confirmed - Taste of Heaven ${refCode}`,
        message: `Dear ${guestName}, your reservation (${refCode}) for ${guestsCount} guests on ${reservationDate} at ${reservationTime} is confirmed!`
      }).catch(() => {});

      return res.status(201).json({
        status: 'success',
        source: 'supabase',
        data: { reservation: data }
      });
    }
  }

  // Memory Fallback
  const newReservation = {
    id: memoryDb.reservations.length + 1,
    referenceCode: refCode,
    guestName,
    guestEmail,
    guestPhone,
    guestsCount: parseInt(guestsCount),
    reservationDate,
    reservationTime,
    tableAtmosphere: tableAtmosphere || 'Metropolis Skyline View',
    specialNotes: specialNotes || '',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  memoryDb.reservations.push(newReservation);

  sendEmail({
    email: guestEmail,
    subject: `Reservation Confirmed - Taste of Heaven ${refCode}`,
    message: `Dear ${guestName}, your reservation (${refCode}) for ${guestsCount} guests on ${reservationDate} at ${reservationTime} is confirmed!`
  }).catch(() => {});

  res.status(201).json({
    status: 'success',
    data: { reservation: newReservation }
  });
});

exports.getAllReservations = catchAsync(async (req, res, next) => {
  const { status, date } = req.query;

  if (supabase) {
    let query = supabase.from('reservations').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    if (date) query = query.eq('reservation_date', date);

    const { data, error } = await query;
    if (!error && data) {
      return res.status(200).json({
        status: 'success',
        source: 'supabase',
        results: data.length,
        data: { reservations: data }
      });
    }
  }

  let list = [...memoryDb.reservations];
  if (status) list = list.filter(r => r.status === status);
  if (date) list = list.filter(r => r.reservationDate === date);

  res.status(200).json({
    status: 'success',
    results: list.length,
    data: { reservations: list }
  });
});

exports.updateReservationStatus = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { status } = req.body;

  if (supabase) {
    const { data, error } = await supabase.from('reservations').update({ status }).eq('id', id).select().single();
    if (!error && data) {
      return res.status(200).json({
        status: 'success',
        source: 'supabase',
        data: { reservation: data }
      });
    }
  }

  const resObj = memoryDb.reservations.find(r => r.id === parseInt(id));
  if (!resObj) return next(new AppError('No reservation found with that ID', 404));

  resObj.status = status;

  res.status(200).json({
    status: 'success',
    data: { reservation: resObj }
  });
});
