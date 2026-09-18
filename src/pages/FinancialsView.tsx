import React, { useState } from 'react';
import { 
  CreditCard, 
  Printer, 
  Sliders, 
  ShieldCheck,
  FileDown
} from 'lucide-react';

export const FinancialsView: React.FC = () => {
  const [activeFolioIndex, setActiveFolioIndex] = useState(0);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [payModal, setPayModal] = useState(false);
  const [paymentGateway, setPaymentGateway] = useState<'Stripe' | 'Razorpay' | 'PayPal'>('Stripe');

  // Dynamic Pricing Simulator State
  const [occupancyThreshold, setOccupancyThreshold] = useState(70);
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.25);
  const [weekendMultiplier, setWeekendMultiplier] = useState(1.15);
  const [isSurgeEnabled, setIsSurgeEnabled] = useState(true);

  // Sample Folios
  const [folios, setFolios] = useState([
    {
      id: 'fol-1001',
      invoiceNumber: 'INV-2026-0842',
      guestName: 'Sophia Laurent',
      roomNumber: '101',
      roomCategory: 'Deluxe',
      issuedDate: '2026-09-15',
      items: [
        { id: 'fi-1', date: '2026-09-15', description: 'Room Stay (3 Nights) - Deluxe', category: 'Room', amount: 10500, hsnSacCode: '996311', taxRate: 12 },
        { id: 'fi-2', date: '2026-09-15', description: 'Restaurant - Azure Fine Dining (Dinner)', category: 'Restaurant', amount: 1850, hsnSacCode: '996331', taxRate: 5 },
        { id: 'fi-3', date: '2026-09-16', description: 'Minibar - Artisan Chocolate & Perrier', category: 'Minibar', amount: 450, hsnSacCode: '996331', taxRate: 18 },
        { id: 'fi-4', date: '2026-09-16', description: 'Hydro-Laundry Express Valet', category: 'Laundry', amount: 600, hsnSacCode: '996331', taxRate: 18 }
      ],
      discount: 500,
      paidAmount: 11760,
      paymentMethod: 'Stripe',
      status: 'Open'
    },
    {
      id: 'fol-1002',
      invoiceNumber: 'INV-2026-0843',
      guestName: 'Lord Alistair Sterling',
      roomNumber: '301',
      roomCategory: 'Presidential Suite',
      issuedDate: '2026-09-15',
      items: [
        { id: 'fi-5', date: '2026-09-15', description: 'Presidential Suite (6 Nights)', category: 'Room', amount: 75000, hsnSacCode: '996311', taxRate: 18 },
        { id: 'fi-6', date: '2026-09-16', description: 'VIP Airport Limousine & Champagne', category: 'Concierge', amount: 4500, hsnSacCode: '996311', taxRate: 18 }
      ],
      discount: 2000,
      paidAmount: 93810,
      paymentMethod: 'Razorpay',
      status: 'Settled'
    }
  ]);

  const currentFolio = folios[activeFolioIndex];

  // GST Calculation for active folio
  const subtotal = currentFolio.items.reduce((sum, it) => sum + it.amount, 0);
  const totalTax = currentFolio.items.reduce((sum, it) => sum + Math.round(it.amount * (it.taxRate / 100)), 0);
  const cgst = Math.round(totalTax / 2);
  const sgst = totalTax - cgst;
  const grandTotal = subtotal - currentFolio.discount + totalTax;
  const balanceDue = Math.max(0, grandTotal - currentFolio.paidAmount);

  const handleSettlePayment = () => {
    setFolios(folios.map((f, idx) => {
      if (idx === activeFolioIndex) {
        return {
          ...f,
          paidAmount: grandTotal,
          status: 'Settled',
          paymentMethod: paymentGateway
        };
      }
      return f;
    }));
    setPayModal(false);
    alert(`Payment of ₹${balanceDue.toLocaleString()} processed successfully via ${paymentGateway}! Folio settled.`);
  };

  const handleExportToPDF = () => {
    // Open the current invoice/report modal and trigger the browser print dialog
    setInvoiceModal(true);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="animate-fade-in responsive-view-container">
      
      {/* Top Header */}
      <div className="responsive-action-header">
        <div>
          <h2 style={{ fontSize: 'clamp(18px, 2vw, 20px)', fontWeight: '800', color: '#0F172A', margin: 0 }}>
            Billing, GST Compliance & Dynamic Pricing
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Unified guest folio accounting, HSN/SAC taxation, payment gateways & demand pricing engine.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            id="financials-export-pdf-btn"
            onClick={handleExportToPDF} 
            className="btn-secondary"
            title="Trigger browser print dialog to export current invoice to PDF"
          >
            <FileDown size={15} color="#0F172A" /> Export to PDF
          </button>
          <button onClick={() => setInvoiceModal(true)} className="btn-secondary">
            <Printer size={15} /> Print Tax Invoice
          </button>
          {balanceDue > 0 && (
            <button onClick={() => setPayModal(true)} className="btn-primary">
              <CreditCard size={15} color="#0F172A" /> Settle Folio (₹{balanceDue.toLocaleString()})
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Folio details + Dynamic Pricing Simulator */}
      <div className="responsive-split-grid">
        
        {/* LEFT: GUEST FOLIO & ITEMIZED BILL */}
        <div className="lodgify-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Folio selector tabs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E8EEF5', paddingBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {folios.map((f, idx) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFolioIndex(idx)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    backgroundColor: activeFolioIndex === idx ? '#D4F05B' : '#F1F5F9',
                    color: activeFolioIndex === idx ? '#0F172A' : '#64748B'
                  }}
                >
                  Room {f.roomNumber} ({f.guestName})
                </button>
              ))}
            </div>

            <span style={{
              backgroundColor: currentFolio.status === 'Settled' ? '#D1FAE5' : '#FEF3C7',
              color: currentFolio.status === 'Settled' ? '#065F46' : '#92400E',
              fontWeight: '700',
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: '9999px'
            }}>
              {currentFolio.status === 'Settled' ? '✓ Settled' : '● Open Folio'}
            </span>
          </div>

          {/* Folio Metadata */}
          <div className="responsive-metadata-grid" style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Invoice No.</div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>{currentFolio.invoiceNumber}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Guest Name</div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>{currentFolio.guestName}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Room Assigned</div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Room {currentFolio.roomNumber}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Date Issued</div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>{currentFolio.issuedDate}</div>
            </div>
          </div>

          {/* Itemized Line Items Table */}
          <div className="responsive-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>SAC / HSN</th>
                  <th>GST Rate</th>
                  <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {currentFolio.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: '#0F172A' }}>{item.description}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{item.category} • {item.date}</div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#475569' }}>{item.hsnSacCode}</span>
                    </td>
                    <td>
                      <span style={{
                        backgroundColor: item.taxRate >= 18 ? '#FEF3C7' : '#D1FAE5',
                        color: item.taxRate >= 18 ? '#92400E' : '#065F46',
                        fontWeight: '700',
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '9999px'
                      }}>
                        {item.taxRate}%
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '800', color: '#0F172A' }}>
                      ₹{item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tax & Grand Total Summary */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            borderTop: '1px solid #E8EEF5',
            paddingTop: '16px',
            alignSelf: 'flex-end',
            width: '280px',
            fontSize: '13px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: '700', color: '#0F172A' }}>₹{subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
              <span>CGST:</span>
              <span style={{ fontWeight: '600', color: '#0F172A' }}>₹{cgst.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
              <span>SGST:</span>
              <span style={{ fontWeight: '600', color: '#0F172A' }}>₹{sgst.toLocaleString()}</span>
            </div>
            {currentFolio.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981' }}>
                <span>Loyalty Discount:</span>
                <span style={{ fontWeight: '700' }}>-₹{currentFolio.discount.toLocaleString()}</span>
              </div>
            )}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '16px',
              fontWeight: '800',
              color: '#0F172A',
              borderTop: '2px solid #0F172A',
              paddingTop: '8px',
              marginTop: '4px'
            }}>
              <span>Grand Total:</span>
              <span>₹{grandTotal.toLocaleString()}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '13px',
              fontWeight: '700',
              color: balanceDue > 0 ? '#EF4444' : '#10B981'
            }}>
              <span>Balance Due:</span>
              <span>{balanceDue > 0 ? `₹${balanceDue.toLocaleString()}` : 'Settled'}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: DYNAMIC PRICING ENGINE & SURGE SIMULATOR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="lodgify-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} color="#0F172A" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Dynamic Pricing Engine
                </h3>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isSurgeEnabled}
                  onChange={(e) => setIsSurgeEnabled(e.target.checked)}
                />
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>Auto Surge</span>
              </label>
            </div>

            <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '20px' }}>
              Adjust live occupancy surge triggers and weekend multipliers. Prices recalculate instantly across booking channels.
            </p>

            {/* Slider 1: Occupancy Threshold */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '600', color: '#475569' }}>Surge Trigger Occupancy</span>
                <span style={{ fontWeight: '800', color: '#0F172A' }}>{occupancyThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                step="5"
                value={occupancyThreshold}
                onChange={(e) => setOccupancyThreshold(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#D4F05B' }}
              />
            </div>

            {/* Slider 2: Surge Multiplier */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '600', color: '#475569' }}>High Occupancy Multiplier</span>
                <span style={{ fontWeight: '800', color: '#0F172A' }}>{surgeMultiplier}x (+{Math.round((surgeMultiplier - 1) * 100)}%)</span>
              </div>
              <input
                type="range"
                min="1.05"
                max="1.50"
                step="0.05"
                value={surgeMultiplier}
                onChange={(e) => setSurgeMultiplier(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#D4F05B' }}
              />
            </div>

            {/* Slider 3: Weekend Multiplier */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '600', color: '#475569' }}>Weekend Surcharge (Fri-Sat)</span>
                <span style={{ fontWeight: '800', color: '#0F172A' }}>{weekendMultiplier}x (+{Math.round((weekendMultiplier - 1) * 100)}%)</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="1.30"
                step="0.05"
                value={weekendMultiplier}
                onChange={(e) => setWeekendMultiplier(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#D4F05B' }}
              />
            </div>

            {/* Live Calculated Tariffs Card */}
            <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E8EEF5' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', marginBottom: '10px' }}>
                Live Effective Tariffs (Surge Active)
              </div>
              {[
                { name: 'Standard Room', base: 2500 },
                { name: 'Deluxe Room', base: 3500 },
                { name: 'Executive Suite', base: 6500 },
                { name: 'Presidential Suite', base: 12500 },
              ].map((tier) => {
                const dynamic = isSurgeEnabled ? Math.round(tier.base * surgeMultiplier) : tier.base;
                return (
                  <div key={tier.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                    <span style={{ color: '#475569' }}>{tier.name}</span>
                    <div>
                      <span style={{ textDecoration: isSurgeEnabled ? 'line-through' : 'none', color: '#94A3B8', marginRight: '6px' }}>
                        ₹{tier.base.toLocaleString()}
                      </span>
                      <span style={{ fontWeight: '800', color: '#0F172A' }}>
                        ₹{dynamic.toLocaleString()}/nt
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Integrated Payment Gateways info */}
          <div className="lodgify-card">
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', marginBottom: '12px' }}>
              Connected Payment Gateways
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'Stripe Payments', status: 'Live & Active', fee: '2.9% + 30¢', color: '#6366F1' },
                { name: 'Razorpay (India)', status: 'Live & Active (UPI/Cards)', fee: '2.0% + GST', color: '#3B82F6' },
                { name: 'PayPal Commerce', status: 'Live & Active', fee: '3.49% + 49¢', color: '#F59E0B' }
              ].map((gw) => (
                <div key={gw.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>{gw.name}</div>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>MDR: {gw.fee}</div>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#065F46', backgroundColor: '#D1FAE5', padding: '2px 8px', borderRadius: '9999px' }}>
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Payment Gateway Modal */}
      {payModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '28px', maxWidth: '440px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
              Settle Folio via Payment Gateway
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '18px' }}>
              Total Balance Due: <strong style={{ color: '#0F172A' }}>₹{balanceDue.toLocaleString()}</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {(['Stripe', 'Razorpay', 'PayPal'] as const).map((gw) => (
                <label
                  key={gw}
                  onClick={() => setPaymentGateway(gw)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: paymentGateway === gw ? '2px solid #0F172A' : '1px solid #E2E8F0',
                    backgroundColor: paymentGateway === gw ? '#F8FAFC' : '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="radio" checked={paymentGateway === gw} onChange={() => setPaymentGateway(gw)} />
                    <span style={{ fontWeight: '700', fontSize: '13px', color: '#0F172A' }}>{gw} Checkout</span>
                  </div>
                  <ShieldCheck size={18} color="#10B981" />
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setPayModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSettlePayment} className="btn-primary">
                Confirm & Charge ₹{balanceDue.toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Tax Invoice Modal */}
      {invoiceModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '36px', maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0F172A', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#0F172A', margin: 0 }}>THE GRAND AZURE HOTEL</h2>
                <div style={{ fontSize: '11px', color: '#64748B' }}>GSTIN: 27AABCT1234F1Z8 • SAC Code: 996311</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>42 Marina Boulevard, Coastal Promenade</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>TAX INVOICE</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{currentFolio.invoiceNumber}</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>{currentFolio.issuedDate}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '20px' }}>
              <div>
                <strong style={{ color: '#0F172A' }}>Billed To:</strong>
                <div>{currentFolio.guestName}</div>
                <div>Room {currentFolio.roomNumber} ({currentFolio.roomCategory})</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ color: '#0F172A' }}>Payment Status:</strong>
                <div style={{ color: '#065F46', fontWeight: '700' }}>{currentFolio.status === 'Settled' ? 'PAID IN FULL' : 'PARTIALLY PAID'}</div>
                <div>Method: {currentFolio.paymentMethod}</div>
              </div>
            </div>

            <table className="data-table" style={{ marginBottom: '20px' }}>
              <thead>
                <tr>
                  <th>Particulars</th>
                  <th>SAC</th>
                  <th>GST %</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {currentFolio.items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.description}</td>
                    <td>{it.hsnSacCode}</td>
                    <td>{it.taxRate}%</td>
                    <td style={{ textAlign: 'right', fontWeight: '700' }}>₹{it.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '12px', marginBottom: '24px' }}>
              <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal:</span>
                  <strong>₹{subtotal.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>CGST (6% / 9%):</span>
                  <strong>₹{cgst.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>SGST (6% / 9%):</span>
                  <strong>₹{sgst.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', borderTop: '1px solid #0F172A', paddingTop: '6px' }}>
                  <span>Grand Total:</span>
                  <strong>₹{grandTotal.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setInvoiceModal(false)} className="btn-secondary">
                Close
              </button>
              <button onClick={() => window.print()} className="btn-secondary">
                <Printer size={15} color="#0F172A" /> Print Invoice
              </button>
              <button 
                id="modal-export-pdf-btn"
                onClick={() => window.print()} 
                className="btn-primary"
                title="Trigger browser print dialog to export to PDF"
              >
                <FileDown size={15} color="#0F172A" /> Export to PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
