const { supabase, memoryDb } = require('../config/db');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.submitContactInquiry = catchAsync(async (req, res, next) => {
  const { name, email, phone, message } = req.body;

  const inquiryPayload = {
    name,
    email,
    phone: phone || '',
    message,
    status: 'unread'
  };

  if (supabase) {
    const { data, error } = await supabase.from('contact_inquiries').insert([inquiryPayload]).select().single();
    if (!error && data) {
      return res.status(201).json({
        status: 'success',
        source: 'supabase',
        message: 'Your inquiry has been received. Our concierge will respond shortly.',
        data: { inquiry: data }
      });
    }
  }

  const inquiry = {
    id: memoryDb.contactInquiries.length + 1,
    ...inquiryPayload,
    createdAt: new Date().toISOString()
  };

  memoryDb.contactInquiries.push(inquiry);

  res.status(201).json({
    status: 'success',
    message: 'Your inquiry has been received. Our concierge will respond shortly.',
    data: { inquiry }
  });
});

exports.getAllInquiries = catchAsync(async (req, res, next) => {
  if (supabase) {
    const { data, error } = await supabase.from('contact_inquiries').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      return res.status(200).json({
        status: 'success',
        source: 'supabase',
        results: data.length,
        data: { inquiries: data }
      });
    }
  }

  res.status(200).json({
    status: 'success',
    results: memoryDb.contactInquiries.length,
    data: { inquiries: memoryDb.contactInquiries }
  });
});
