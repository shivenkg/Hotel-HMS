import React, { useState } from 'react';
import { Plus, ChefHat, ShoppingBag, Clock, ChevronRight, X, UtensilsCrossed, AlertTriangle } from 'lucide-react';

export const ConciergeView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [targetType, setTargetType] = useState<'RoomService' | 'Restaurant' | 'Bar'>('RoomService');
  const [roomOrTable, setRoomOrTable] = useState('Room 101');
  const [cart, setCart] = useState<Array<{ id: string; name: string; price: number; qty: number }>>([]);
  const [billToRoom, setBillToRoom] = useState(true);
  const [showRoomDrilldown, setShowRoomDrilldown] = useState(false);

  // Menu items
  const menuItems = [
    { id: 'm1', name: 'Truffle Mushroom Risotto', category: 'Main Course', price: 850, prepTime: '20 min' },
    { id: 'm2', name: 'Wood-fired Margherita Pizza', category: 'Main Course', price: 650, prepTime: '15 min' },
    { id: 'm3', name: 'Grilled Norwegian Salmon', category: 'Main Course', price: 1200, prepTime: '25 min' },
    { id: 'm4', name: 'Crispy Calamari Fritti', category: 'Appetizer', price: 480, prepTime: '12 min' },
    { id: 'm5', name: 'Burrata Caprese Salad', category: 'Appetizer', price: 520, prepTime: '10 min' },
    { id: 'm6', name: 'San Pellegrino 750ml', category: 'Beverage', price: 320, prepTime: '3 min' },
    { id: 'm7', name: 'Craft Berry Mocktail', category: 'Beverage', price: 280, prepTime: '5 min' },
    { id: 'm8', name: 'Tiramisu Della Nonna', category: 'Dessert', price: 420, prepTime: '5 min' },
    { id: 'm9', name: 'Artisan Gelato Trio', category: 'Dessert', price: 350, prepTime: '5 min' },
  ];

  // KDS Orders state
  const [kdsOrders, setKdsOrders] = useState([
    {
      id: 'pos-201',
      orderNumber: 'POS-2026-041',
      type: 'RoomService',
      destination: 'Room 101 (Sophia Laurent)',
      items: '1x Truffle Risotto, 1x San Pellegrino, 1x Tiramisu',
      total: 1669.5,
      status: 'Ready',
      time: '12 mins ago'
    },
    {
      id: 'pos-202',
      orderNumber: 'POS-2026-042',
      type: 'Restaurant',
      destination: 'Table 4 (Walk-in)',
      items: '2x Margherita Pizza, 2x Berry Mocktail',
      total: 1953,
      status: 'Preparing',
      time: '6 mins ago'
    }
  ]);

  const handleAddToCart = (item: any) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { id: item.id, name: item.name, price: item.price, qty: 1 }]);
    }
  };

  const handleCreateOrder = () => {
    if (cart.length === 0) return;
    const subtotal = cart.reduce((sum, it) => sum + it.price * it.qty, 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    const newKds = {
      id: `pos-${Date.now()}`,
      orderNumber: `POS-2026-${Math.floor(100 + Math.random() * 900)}`,
      type: targetType,
      destination: roomOrTable,
      items: cart.map(c => `${c.qty}x ${c.name}`).join(', '),
      total,
      status: 'Received',
      time: 'Just now'
    };

    setKdsOrders([newKds, ...kdsOrders]);
    setCart([]);
    alert(`Order ${newKds.orderNumber} sent to Kitchen Display System (KDS)! ${billToRoom ? 'Charged to room folio.' : 'Cash/Card on delivery.'}`);
  };

  const handleAdvanceStatus = (orderId: string) => {
    setKdsOrders(kdsOrders.map(o => {
      if (o.id === orderId) {
        const next = o.status === 'Received' ? 'Preparing' : o.status === 'Preparing' ? 'Ready' : 'Delivered';
        return { ...o, status: next };
      }
      return o;
    }));
  };

  const cartSubtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const cartTax = Math.round(cartSubtotal * 0.05);
  const cartTotal = cartSubtotal + cartTax;

  const filteredMenu = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(m => m.category === selectedCategory);

  return (
    <div className="animate-fade-in" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Header */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
          Restaurant POS & Kitchen Display System (KDS)
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
          Touch-based dining orders, room service delivery routing, and real-time kitchen preparation tickets.
        </p>
      </div>

      {/* Kitchen Executive Key KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {/* Card 1: Open Orders (Click to drill down) */}
        <div 
          onClick={() => setShowRoomDrilldown(true)}
          style={{
            cursor: 'pointer',
            backgroundColor: '#FFF1F2',
            border: '2px solid #FECDD3',
            borderRadius: '14px',
            padding: '18px',
            transition: 'all 0.2s ease'
          }}
          className="hover:shadow-md"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#991B1B', textTransform: 'uppercase' }}>
              Open Kitchen Orders
            </span>
            <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#E11D48', color: '#FFFFFF', padding: '2px 6px', borderRadius: '9999px' }}>
              Live KDS
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
            {kdsOrders.filter(o => o.status !== 'Delivered').length} Orders Active
          </div>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>👉 Click for Room-wise Item Order drill-down</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Card 2: Items in Prep */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B' }}>Items Cooking</span>
            <UtensilsCrossed size={16} color="#0F172A" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
            5 Items
          </div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            1 Risotto, 2 Pizzas, 2 Mocktails
          </div>
        </div>

        {/* Card 3: Avg Prep Time */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B' }}>Avg Prep & Delivery</span>
            <Clock size={16} color="#059669" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
            14.2 min
          </div>
          <div style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>
            Under 20m target benchmark
          </div>
        </div>

        {/* Card 4: F&B Revenue Today */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B' }}>F&B Sales Today</span>
            <ChefHat size={16} color="#0F172A" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
            ₹18,450
          </div>
          <div style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>
            +12.4% vs yesterday
          </div>
        </div>
      </div>

      {/* Main Grid: POS Menu (Left) + Cart & KDS (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px' }}>
        
        {/* LEFT: MENU ITEMS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Main Course', 'Appetizer', 'Beverage', 'Dessert'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  backgroundColor: selectedCategory === cat ? '#D4F05B' : '#FFFFFF',
                  color: selectedCategory === cat ? '#0F172A' : '#64748B',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: selectedCategory === cat ? '#D4F05B' : '#E2E8F0'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                className="lodgify-card"
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>
                    {item.category}
                  </span>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', marginTop: '2px', lineHeight: 1.3 }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                    ⏱ {item.prepTime}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>
                    ₹{item.price}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#D4F05B',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={16} color="#0F172A" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT: CURRENT ORDER CART & KITCHEN TICKETS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Active Cart Card */}
          <div className="lodgify-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <ShoppingBag size={18} color="#0F172A" />
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Active Order Cart
              </h3>
            </div>

            {/* Destination Selection */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <select
                value={targetType}
                onChange={(e: any) => setTargetType(e.target.value)}
                className="input-clean"
                style={{ width: '100%', borderRadius: '10px', fontSize: '12px' }}
              >
                <option value="RoomService">Room Service</option>
                <option value="Restaurant">Restaurant Table</option>
                <option value="Bar">Lounge Bar</option>
              </select>

              <select
                value={roomOrTable}
                onChange={(e) => setRoomOrTable(e.target.value)}
                className="input-clean"
                style={{ width: '100%', borderRadius: '10px', fontSize: '12px' }}
              >
                <option value="Room 101">Room 101 (Sophia Laurent)</option>
                <option value="Room 102">Room 102 (Marcus Chen)</option>
                <option value="Room 201">Room 201 (David Miller)</option>
                <option value="Room 301">Room 301 (Lord Sterling)</option>
                <option value="Table 1">Table 1</option>
                <option value="Table 4">Table 4</option>
              </select>
            </div>

            {/* Cart Items */}
            {cart.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: '#94A3B8', fontSize: '12px' }}>
                No items added. Click + on menu dishes.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                {cart.map((c) => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span>{c.qty}x {c.name}</span>
                    <strong style={{ color: '#0F172A' }}>₹{c.price * c.qty}</strong>
                  </div>
                ))}

                <div style={{ borderTop: '1px solid #E8EEF5', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                    <span>Subtotal:</span>
                    <span>₹{cartSubtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                    <span>GST (5% F&B):</span>
                    <span>₹{cartTax}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '800', color: '#0F172A', borderTop: '1px solid #0F172A', paddingTop: '6px' }}>
                    <span>Total:</span>
                    <span>₹{cartTotal}</span>
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginTop: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={billToRoom}
                    onChange={(e) => setBillToRoom(e.target.checked)}
                  />
                  <span style={{ fontWeight: '600', color: '#0F172A' }}>Bill directly to Guest Stay Folio</span>
                </label>

                <button onClick={handleCreateOrder} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                  Fire Order to Kitchen
                </button>
              </div>
            )}
          </div>

          {/* Kitchen Display System (KDS) Live Orders */}
          <div className="lodgify-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <ChefHat size={18} color="#0F172A" />
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Live Kitchen Display (KDS)
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {kdsOrders.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    backgroundColor: '#F8FAFC',
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '800', fontSize: '13px', color: '#0F172A' }}>
                      {ord.orderNumber}
                    </span>
                    <button
                      onClick={() => handleAdvanceStatus(ord.id)}
                      style={{
                        border: 'none',
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        backgroundColor: 
                          ord.status === 'Delivered' ? '#D1FAE5' : 
                          ord.status === 'Ready' ? '#D4F05B' : 
                          ord.status === 'Preparing' ? '#FEF08A' : '#E2E8F0',
                        color: ord.status === 'Delivered' ? '#065F46' : '#0F172A'
                      }}
                    >
                      {ord.status} → Next
                    </button>
                  </div>

                  <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>
                    📍 {ord.destination} • {ord.time}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#0F172A' }}>
                    {ord.items}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ROOM-WISE ITEM ORDER DRILL-DOWN MODAL */}
      {showRoomDrilldown && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '750px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UtensilsCrossed size={20} color="#991B1B" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    Kitchen KDS: Room Number-Wise Item Order Drill-Down
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                    Active kitchen tickets segregated by room number with itemized portions and prep timers.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowRoomDrilldown(false)} 
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                {
                  room: 'Room 101',
                  guest: 'Sophia Laurent (VIP)',
                  orderNumber: 'POS-2026-041',
                  status: 'Ready for Service',
                  elapsed: '12m ago',
                  items: [
                    { name: 'Truffle Mushroom Risotto', qty: 1, price: '₹850', note: 'Extra parmesan on side' },
                    { name: 'San Pellegrino 750ml', qty: 1, price: '₹320', note: 'Chilled glass with lemon' },
                    { name: 'Tiramisu Della Nonna', qty: 1, price: '₹420', note: 'Standard portion' }
                  ],
                  total: '₹1,669.50'
                },
                {
                  room: 'Room 104',
                  guest: 'Jonathan Vance',
                  orderNumber: 'POS-2026-042',
                  status: 'Preparing (Pizza Oven)',
                  elapsed: '6m ago',
                  items: [
                    { name: 'Wood-fired Margherita Pizza', qty: 2, price: '₹1,300', note: 'Well-done crust, basil garnish' },
                    { name: 'Craft Berry Mocktail', qty: 2, price: '₹560', note: 'Less ice' }
                  ],
                  total: '₹1,953.00'
                },
                {
                  room: 'Room 106',
                  guest: 'Lord Alistair Sterling',
                  orderNumber: 'POS-2026-043',
                  status: 'Preparing (Grill Station)',
                  elapsed: '18m ago',
                  items: [
                    { name: 'Grilled Norwegian Salmon', qty: 1, price: '₹1,200', note: 'Medium with grilled asparagus' },
                    { name: 'Burrata Caprese Salad', qty: 1, price: '₹520', note: 'Aged Modena balsamic' }
                  ],
                  total: '₹1,806.00'
                },
                {
                  room: 'Table 4 (Restaurant)',
                  guest: 'Walk-in Dining Guests',
                  orderNumber: 'POS-2026-044',
                  status: 'Order Received',
                  elapsed: '4m ago',
                  items: [
                    { name: 'Crispy Calamari Fritti', qty: 1, price: '₹480', note: 'Spicy tartar dip' },
                    { name: 'San Pellegrino 750ml', qty: 2, price: '₹640', note: 'Room temperature' }
                  ],
                  total: '₹1,176.00'
                }
              ].map((group, idx) => (
                <div key={idx} style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px', marginBottom: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>
                          🏨 {group.room}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: '700', backgroundColor: '#E2E8F0', color: '#334155', padding: '2px 6px', borderRadius: '4px' }}>
                          {group.orderNumber}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                        Guest: <strong>{group.guest}</strong> • {group.elapsed}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      backgroundColor: group.status.includes('Ready') ? '#D1FAE5' : group.status.includes('Preparing') ? '#FEF3C7' : '#E0F2FE',
                      color: group.status.includes('Ready') ? '#065F46' : group.status.includes('Preparing') ? '#92400E' : '#0369A1'
                    }}>
                      ● {group.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {group.items.map((item, iIdx) => (
                      <div key={iIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E8EEF5' }}>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>
                            {item.qty}x {item.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#D97706', fontStyle: 'italic' }}>
                            {item.note}
                          </div>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#059669' }}>
                      Billed to Room Folio: {group.total}
                    </span>
                    <button 
                      onClick={() => alert(`Status updated for ${group.room}!`)}
                      style={{
                        padding: '5px 12px',
                        backgroundColor: '#0F172A',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Advance Prep Stage →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
