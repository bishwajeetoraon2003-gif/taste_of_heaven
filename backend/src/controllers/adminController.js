const { supabase, memoryDb } = require('../config/db');
const catchAsync = require('../utils/catchAsync');

exports.getDashboardStats = catchAsync(async (req, res, next) => {
  if (supabase) {
    const { data: orders } = await supabase.from('orders').select('total, status');
    const { count: totalReservations } = await supabase.from('reservations').select('*', { count: 'exact', head: true });
    const { count: totalMenuItems } = await supabase.from('menu_items').select('*', { count: 'exact', head: true });
    const { count: registeredUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });

    const totalRevenue = orders ? orders.reduce((acc, o) => acc + (parseFloat(o.total) || 0), 0) : 0;
    const pendingOrders = orders ? orders.filter(o => o.status === 'received' || o.status === 'preparing').length : 0;

    return res.status(200).json({
      status: 'success',
      source: 'supabase',
      data: {
        stats: {
          totalRevenue: parseFloat(totalRevenue.toFixed(2)),
          totalReservations: totalReservations || 0,
          totalOrders: orders ? orders.length : 0,
          pendingOrders,
          totalMenuItems: totalMenuItems || 0,
          registeredUsers: registeredUsers || 0
        }
      }
    });
  }

  const totalRevenue = memoryDb.orders.reduce((acc, o) => acc + o.total, 0);
  const totalReservations = memoryDb.reservations.length;
  const totalOrders = memoryDb.orders.length;
  const totalMenuItems = memoryDb.menuItems.length;
  const pendingOrders = memoryDb.orders.filter(o => o.status === 'received' || o.status === 'preparing').length;

  res.status(200).json({
    status: 'success',
    source: 'memory_fallback',
    data: {
      stats: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalReservations,
        totalOrders,
        pendingOrders,
        totalMenuItems,
        registeredUsers: memoryDb.users.length
      }
    }
  });
});
