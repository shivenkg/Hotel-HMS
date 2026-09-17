import React, { useState } from 'react';
import { AlertTriangle, Plus, Shirt, CheckCircle2 } from 'lucide-react';

export const InventoryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stock' | 'laundry'>('stock');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [restockModal, setRestockModal] = useState<any | null>(null);
  const [restockQty, setRestockQty] = useState(10);

  const [inventory, setInventory] = useState([
    { id: 'inv-1', name: 'Fresh Farm Eggs (Grade A)', category: 'Kitchen', currentStock: 140, minThreshold: 50, unit: 'pcs', unitCost: 8, supplier: 'GreenValley Agro', lastRestocked: '2026-09-14' },
    { id: 'inv-2', name: 'Artisan Coffee Beans (Arabica)', category: 'Kitchen', currentStock: 18, minThreshold: 10, unit: 'kg', unitCost: 850, supplier: 'BlueTokai Roasters', lastRestocked: '2026-09-10' },
    { id: 'inv-3', name: 'Luxury Herbal Shampoo 50ml', category: 'Amenities', currentStock: 320, minThreshold: 100, unit: 'bottles', unitCost: 35, supplier: 'Forest Botanicals', lastRestocked: '2026-09-05' },
    { id: 'inv-4', name: 'Egyptian Cotton Bath Towels', category: 'Linen', currentStock: 65, minThreshold: 40, unit: 'pcs', unitCost: 450, supplier: 'Textile Luxe Corp', lastRestocked: '2026-08-20' },
    { id: 'inv-5', name: 'Sparkling Water 330ml', category: 'Minibar', currentStock: 12, minThreshold: 24, unit: 'cans', unitCost: 65, supplier: 'AquaPurity Ltd', lastRestocked: '2026-09-02' },
    { id: 'inv-6', name: 'Hospital-Grade Disinfectant 5L', category: 'Housekeeping', currentStock: 8, minThreshold: 5, unit: 'canisters', unitCost: 1200, supplier: 'CleanMed Solutions', lastRestocked: '2026-09-08' }
  ]);

  const [laundry, setLaundry] = useState([
    { id: 'ld-1', batchNumber: 'LB-2026-081', itemType: 'Bed Sheets', quantity: 45, status: 'Washing', vendor: 'In-House Hydro-Laundry', sentDate: '2026-09-16 09:00', expectedReturnDate: '2026-09-16 17:00' },
    { id: 'ld-2', batchNumber: 'LB-2026-082', itemType: 'Bath Towels', quantity: 60, status: 'Ironing', vendor: 'In-House Hydro-Laundry', sentDate: '2026-09-16 10:00', expectedReturnDate: '2026-09-16 16:30' },
    { id: 'ld-3', batchNumber: 'LB-2026-083', itemType: 'Staff Uniforms', quantity: 22, status: 'Returned', vendor: 'Elite Dry Cleaners Ltd', sentDate: '2026-09-15 08:30', expectedReturnDate: '2026-09-16 12:00' }
  ]);

  const handleSaveRestock = () => {
    if (!restockModal) return;
    setInventory(inventory.map(item => {
      if (item.id === restockModal.id) {
        return {
          ...item,
          currentStock: item.currentStock + Number(restockQty),
          lastRestocked: new Date().toISOString().slice(0, 10)
        };
      }
      return item;
    }));
    setRestockModal(null);
  };

  const handleAdvanceLaundry = (id: string) => {
    setLaundry(laundry.map(b => {
      if (b.id === id) {
        const next = b.status === 'Washing' ? 'Ironing' : b.status === 'Ironing' ? 'Returned' : 'Washing';
        return { ...b, status: next };
      }
      return b;
    }));
  };

  const filteredStock = selectedCategory === 'All'
    ? inventory
    : inventory.filter(i => i.category === selectedCategory);

  return (
    <div className="animate-fade-in" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
            Inventory & Laundry Operations
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Kitchen stock alerts, guest amenities restocking, and linen turnaround tracking.
          </p>
        </div>

        {/* View mode toggle */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '9999px' }}>
          <button
            onClick={() => setActiveTab('stock')}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              backgroundColor: activeTab === 'stock' ? '#D4F05B' : 'transparent',
              color: activeTab === 'stock' ? '#0F172A' : '#64748B'
            }}
          >
            Stock Levels & Alerts
          </button>
          <button
            onClick={() => setActiveTab('laundry')}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              backgroundColor: activeTab === 'laundry' ? '#D4F05B' : 'transparent',
              color: activeTab === 'laundry' ? '#0F172A' : '#64748B'
            }}
          >
            Linen & Laundry Cycles
          </button>
        </div>
      </div>

      {activeTab === 'stock' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Categories */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Kitchen', 'Amenities', 'Linen', 'Minibar', 'Housekeeping'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  backgroundColor: selectedCategory === cat ? '#0F172A' : '#FFFFFF',
                  color: selectedCategory === cat ? '#FFFFFF' : '#64748B',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: selectedCategory === cat ? '#0F172A' : '#E2E8F0'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Stock Table */}
          <div className="lodgify-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item Name & Category</th>
                  <th>Current Stock</th>
                  <th>Min Threshold</th>
                  <th>Unit Cost</th>
                  <th>Supplier</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStock.map((item) => {
                  const isLow = item.currentStock <= item.minThreshold;
                  return (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: '800', color: '#0F172A' }}>{item.name}</div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>{item.category} • Last: {item.lastRestocked}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: isLow ? '#EF4444' : '#0F172A' }}>
                          {item.currentStock} {item.unit}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', color: '#64748B' }}>
                          {item.minThreshold} {item.unit}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', fontWeight: '600' }}>₹{item.unitCost}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', color: '#475569' }}>{item.supplier}</span>
                      </td>
                      <td>
                        {isLow ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#FEE2E2',
                            color: '#991B1B',
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: '9999px'
                          }}>
                            <AlertTriangle size={12} /> Low Stock Alert
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#D1FAE5',
                            color: '#065F46',
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: '9999px'
                          }}>
                            <CheckCircle2 size={12} /> Optimal
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            setRestockModal(item);
                            setRestockQty(item.minThreshold * 2);
                          }}
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '11px' }}
                        >
                          <Plus size={13} /> Restock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      ) : (
        /* Laundry Batch Cycles */
        <div className="lodgify-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Batch Number</th>
                <th>Linen Type</th>
                <th>Quantity</th>
                <th>Facility / Vendor</th>
                <th>Timeline</th>
                <th>Current Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {laundry.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div style={{ fontWeight: '800', color: '#0F172A' }}>{b.batchNumber}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Shirt size={14} color="#64748B" />
                      <span style={{ fontWeight: '600' }}>{b.itemType}</span>
                    </div>
                  </td>
                  <td>
                    <strong>{b.quantity} pcs</strong>
                  </td>
                  <td>{b.vendor}</td>
                  <td>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      Sent: {b.sentDate}
                    </div>
                    <div style={{ fontSize: '11px', color: '#0F172A', fontWeight: '600' }}>
                      Exp: {b.expectedReturnDate}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      backgroundColor: b.status === 'Returned' ? '#D1FAE5' : '#FEF3C7',
                      color: b.status === 'Returned' ? '#065F46' : '#92400E',
                      fontWeight: '700',
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '9999px'
                    }}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleAdvanceLaundry(b.id)}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '11px' }}
                    >
                      Advance Status →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Restock Modal */}
      {restockModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '24px', maxWidth: '420px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
              Restock {restockModal.name}
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '16px' }}>
              Current stock: {restockModal.currentStock} {restockModal.unit} (Supplier: {restockModal.supplier})
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
                Quantity to Add ({restockModal.unit})
              </label>
              <input
                type="number"
                min="1"
                value={restockQty}
                onChange={(e) => setRestockQty(Number(e.target.value))}
                className="input-clean"
                style={{ width: '100%', borderRadius: '10px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setRestockModal(null)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSaveRestock} className="btn-primary">
                Confirm Inward Restock
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
