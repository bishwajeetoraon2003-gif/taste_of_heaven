const { supabase, memoryDb } = require('../config/db');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllMenuItems = catchAsync(async (req, res, next) => {
  const { category, search, veg, popular, sort } = req.query;

  // Supabase Database Connection
  if (supabase) {
    let query = supabase.from('menu_items').select('*');

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }
    if (veg === 'true') {
      query = query.eq('veg', true);
    }
    if (popular === 'true') {
      query = query.eq('popular', true);
    }

    if (sort === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (sort === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else if (sort === 'rating') {
      query = query.order('rating', { ascending: false });
    }

    const { data, error } = await query;

    if (!error && data) {
      return res.status(200).json({
        status: 'success',
        source: 'supabase',
        results: data.length,
        data: { menuItems: data }
      });
    }
  }

  // Fallback to local memory DB if Supabase is not configured yet
  let items = [...memoryDb.menuItems];
  if (category && category !== 'all') items = items.filter(i => i.category === category);
  if (search) {
    const term = search.toLowerCase();
    items = items.filter(i => i.title.toLowerCase().includes(term) || i.description.toLowerCase().includes(term));
  }
  if (veg === 'true') items = items.filter(i => i.veg === true);
  if (popular === 'true') items = items.filter(i => i.popular === true);

  res.status(200).json({
    status: 'success',
    source: 'memory_fallback',
    results: items.length,
    data: { menuItems: items }
  });
});

exports.getMenuItemById = catchAsync(async (req, res, next) => {
  const id = parseInt(req.params.id);

  if (supabase) {
    const { data, error } = await supabase.from('menu_items').select('*').eq('id', id).single();
    if (data) {
      return res.status(200).json({
        status: 'success',
        source: 'supabase',
        data: { menuItem: data }
      });
    }
  }

  const item = memoryDb.menuItems.find(i => i.id === id);
  if (!item) return next(new AppError('No menu item found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: { menuItem: item }
  });
});

exports.createMenuItem = catchAsync(async (req, res, next) => {
  const { title, category, price, rating, veg, popular, image_url, description, allergens } = req.body;

  const newItemData = {
    title,
    category,
    price: parseFloat(price),
    rating: parseFloat(rating) || 4.9,
    veg: Boolean(veg),
    popular: Boolean(popular),
    image_url: image_url || "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    description,
    allergens: allergens || 'None'
  };

  if (supabase) {
    const { data, error } = await supabase.from('menu_items').insert([newItemData]).select().single();
    if (!error && data) {
      return res.status(201).json({
        status: 'success',
        source: 'supabase',
        data: { menuItem: data }
      });
    }
  }

  const newItem = {
    id: memoryDb.menuItems.length ? Math.max(...memoryDb.menuItems.map(m => m.id)) + 1 : 1,
    ...newItemData,
    created_at: new Date().toISOString()
  };
  memoryDb.menuItems.push(newItem);

  res.status(201).json({
    status: 'success',
    data: { menuItem: newItem }
  });
});

exports.updateMenuItem = catchAsync(async (req, res, next) => {
  const id = parseInt(req.params.id);

  if (supabase) {
    const { data, error } = await supabase.from('menu_items').update(req.body).eq('id', id).select().single();
    if (!error && data) {
      return res.status(200).json({
        status: 'success',
        source: 'supabase',
        data: { menuItem: data }
      });
    }
  }

  const index = memoryDb.menuItems.findIndex(i => i.id === id);
  if (index === -1) return next(new AppError('No menu item found with that ID', 404));

  memoryDb.menuItems[index] = { ...memoryDb.menuItems[index], ...req.body };

  res.status(200).json({
    status: 'success',
    data: { menuItem: memoryDb.menuItems[index] }
  });
});

exports.deleteMenuItem = catchAsync(async (req, res, next) => {
  const id = parseInt(req.params.id);

  if (supabase) {
    await supabase.from('menu_items').delete().eq('id', id);
  }

  const index = memoryDb.menuItems.findIndex(i => i.id === id);
  if (index !== -1) memoryDb.menuItems.splice(index, 1);

  res.status(204).json({
    status: 'success',
    data: null
  });
});
