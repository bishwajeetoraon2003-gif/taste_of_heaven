const { supabase, memoryDb } = require('../config/db');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

exports.createOrder = catchAsync(async (req, res, next) => {
  const { customerName, customerEmail, customerPhone, items, orderType, paymentMethod } = req.body;

  if (!items || !items.length) {
    return next(new AppError('Order must contain at least one item', 400));
  }

  const refCode = `#ORD-${Math.floor(10000 + Math.random() * 90000)}`;
  const payMethod = paymentMethod || 'Cash on Delivery (COD)';

  let subtotal = 0;
  const processedItems = items.map(item => {
    const itemSub = (item.price || 50) * (item.qty || 1);
    subtotal += itemSub;
    return {
      title: item.title,
      unit_price: item.price,
      quantity: item.qty || 1,
      subtotal: itemSub
    };
  });

  const taxAndService = subtotal * 0.10;
  const total = subtotal + taxAndService;

  const orderPayload = {
    reference_code: refCode,
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone || 'N/A',
    order_type: orderType || 'delivery',
    payment_method: payMethod,
    subtotal,
    tax_and_service: taxAndService,
    total,
    status: 'received'
  };

  if (supabase) {
    const { data: orderData, error: orderErr } = await supabase.from('orders').insert([orderPayload]).select().single();

    if (!orderErr && orderData) {
      // Insert order items
      const itemsPayload = processedItems.map(i => ({ ...i, order_id: orderData.id }));
      await supabase.from('order_items').insert(itemsPayload);

      sendEmail({
        email: customerEmail,
        subject: `Order Receipt - Taste of Heaven ${refCode}`,
        message: `Dear ${customerName}, your gourmet order (${refCode}) of $${total.toFixed(2)} has been received.`
      }).catch(() => {});

      return res.status(201).json({
        status: 'success',
        source: 'supabase',
        data: { order: { ...orderData, items: processedItems } }
      });
    }
  }

  const newOrder = {
    id: memoryDb.orders.length + 1,
    referenceCode: refCode,
    customerName,
    customerEmail,
    customerPhone: customerPhone || 'N/A',
    orderType: orderType || 'delivery',
    paymentMethod: payMethod,
    items: processedItems,
    subtotal,
    taxAndService,
    total,
    status: 'received',
    createdAt: new Date().toISOString()
  };

  memoryDb.orders.push(newOrder);

  sendEmail({
    email: customerEmail,
    subject: `Order Receipt - Taste of Heaven ${refCode}`,
    message: `Dear ${customerName}, your gourmet order (${refCode}) of $${total.toFixed(2)} has been received.`
  }).catch(() => {});

  res.status(201).json({
    status: 'success',
    data: { order: newOrder }
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  if (supabase) {
    const { data, error } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
    if (!error && data) {
      return res.status(200).json({
        status: 'success',
        source: 'supabase',
        results: data.length,
        data: { orders: data }
      });
    }
  }

  res.status(200).json({
    status: 'success',
    results: memoryDb.orders.length,
    data: { orders: memoryDb.orders }
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { status } = req.body;

  if (supabase) {
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().single();
    if (!error && data) {
      return res.status(200).json({
        status: 'success',
        source: 'supabase',
        data: { order: data }
      });
    }
  }

  const order = memoryDb.orders.find(o => o.id === parseInt(id));
  if (!order) return next(new AppError('No order found with that ID', 404));

  order.status = status;

  res.status(200).json({
    status: 'success',
    data: { order }
  });
});
