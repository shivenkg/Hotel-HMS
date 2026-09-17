import React, { useState } from 'react';
import { Award, Plus } from 'lucide-react';

export const ReviewsView: React.FC = () => {
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [reviews, setReviews] = useState([
    {
      id: 'fb-1',
      guestName: 'Charles Montgomery',
      room: 'Room 201 (Executive Suite)',
      date: '14 Sep 2026',
      nps: 10,
      cleanliness: 5,
      staff: 5,
      food: 4,
      value: 5,
      sentiment: 'Positive',
      comment: 'Impeccable concierge service and the suite views are sensational. The breakfast buffet was a highlight!'
    },
    {
      id: 'fb-2',
      guestName: 'Maria Garcia',
      room: 'Room 104 (Standard)',
      date: '13 Sep 2026',
      nps: 9,
      cleanliness: 5,
      staff: 4,
      food: 5,
      value: 4,
      sentiment: 'Positive',
      comment: 'Delicious artisan mocktails and rapid digital check-in. The bed was extraordinarily comfortable.'
    },
    {
      id: 'fb-3',
      guestName: 'Kenji Sato',
      room: 'Room 106 (Standard)',
      date: '11 Sep 2026',
      nps: 7,
      cleanliness: 4,
      staff: 4,
      food: 3,
      value: 3,
      sentiment: 'Neutral',
      comment: 'Room was very quiet, although the room service order took 35 minutes to arrive on Friday evening.'
    }
  ]);

  const [loyaltyMembers] = useState([
    { name: 'Lord Alistair Sterling', tier: 'Platinum', points: 14500, nights: 22, spend: 245000, perk: 'Free Upgrade + Butler' },
    { name: 'Sophia Laurent', tier: 'Gold', points: 4800, nights: 9, spend: 68000, perk: '15% Off Dining + Late Checkout' },
    { name: 'Marcus Chen', tier: 'Silver', points: 1200, nights: 4, spend: 25000, perk: 'Complimentary High-speed Wi-Fi' }
  ]);

  const [newFeedback, setNewFeedback] = useState({
    guestName: '',
    room: 'Room 101',
    nps: 9,
    comment: ''
  });

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setReviews([
      {
        id: `fb-${Date.now()}`,
        guestName: newFeedback.guestName || 'Recent Guest',
        room: newFeedback.room,
        date: 'Today',
        nps: Number(newFeedback.nps),
        cleanliness: 5,
        staff: 5,
        food: 5,
        value: 5,
        sentiment: Number(newFeedback.nps) >= 8 ? 'Positive' : 'Neutral',
        comment: newFeedback.comment
      },
      ...reviews
    ]);
    setFeedbackModal(false);
    setNewFeedback({ guestName: '', room: 'Room 101', nps: 9, comment: '' });
  };

  return (
    <div className="animate-fade-in" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
            Guest Reviews, NPS & Loyalty Rewards
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Guest sentiment analytics, post-checkout feedback loops, and tiered customer loyalty perks.
          </p>
        </div>

        <button onClick={() => setFeedbackModal(true)} className="btn-primary">
          <Plus size={16} color="#0F172A" />
          <span>Record Guest Feedback</span>
        </button>
      </div>

      {/* Grid: Feedback list (Left) + Loyalty Program (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px' }}>
        
        {/* LEFT: REVIEWS FEED */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map((r) => (
            <div key={r.id} className="lodgify-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>{r.guestName}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{r.room} • {r.date}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    backgroundColor: r.nps >= 8 ? '#D1FAE5' : '#FEF3C7',
                    color: r.nps >= 8 ? '#065F46' : '#92400E',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '3px 10px',
                    borderRadius: '9999px'
                  }}>
                    NPS {r.nps}/10
                  </span>
                  <span style={{
                    backgroundColor: '#F1F5F9',
                    color: '#0F172A',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '3px 8px',
                    borderRadius: '9999px'
                  }}>
                    {r.sentiment}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5, marginBottom: '14px' }}>
                "{r.comment}"
              </p>

              <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #F1F5F9', paddingTop: '10px', fontSize: '11px', color: '#64748B' }}>
                <span>Cleanliness: <strong>{r.cleanliness}/5</strong></span>
                <span>Staff: <strong>{r.staff}/5</strong></span>
                <span>Dining: <strong>{r.food}/5</strong></span>
                <span>Value: <strong>{r.value}/5</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: LOYALTY TIERS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="lodgify-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Award size={18} color="#0F172A" />
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Azure Loyalty Club Members
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {loyaltyMembers.map((m) => {
                const isPlat = m.tier === 'Platinum';
                const isGold = m.tier === 'Gold';
                return (
                  <div
                    key={m.name}
                    style={{
                      backgroundColor: '#F8FAFC',
                      padding: '14px',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '800', fontSize: '13px', color: '#0F172A' }}>{m.name}</span>
                      <span style={{
                        backgroundColor: isPlat ? '#E0E7FF' : isGold ? '#FEF08A' : '#E2E8F0',
                        color: isPlat ? '#3730A3' : isGold ? '#854D0E' : '#334155',
                        fontWeight: '800',
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '9999px'
                      }}>
                        {m.tier} Tier
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '6px' }}>
                      {m.points.toLocaleString()} Points Accrued • {m.nights} Nights Stayed
                    </div>
                    <div style={{ fontSize: '11px', color: '#065F46', fontWeight: '700' }}>
                      🎁 Perk: {m.perk}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lodgify-card" style={{ backgroundColor: '#F4FBD0', borderColor: '#D4F05B' }}>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>
              Automated Guest Communications
            </div>
            <p style={{ fontSize: '12px', color: '#4D6B00', lineHeight: 1.4 }}>
              Pre-arrival SMS & digital key reminders are configured via Twilio & SendGrid. Post-checkout review surveys are dispatched 2 hours after folio settlement.
            </p>
          </div>

        </div>
      </div>

      {/* New Feedback Modal */}
      {feedbackModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '28px', maxWidth: '460px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>
              Record Guest Experience Survey
            </h3>
            <form onSubmit={handleAddFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Guest Name</label>
                <input
                  type="text"
                  required
                  placeholder="Guest Name"
                  value={newFeedback.guestName}
                  onChange={(e) => setNewFeedback({ ...newFeedback, guestName: e.target.value })}
                  className="input-clean"
                  style={{ width: '100%', borderRadius: '10px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>NPS Score (0 - 10)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={newFeedback.nps}
                  onChange={(e) => setNewFeedback({ ...newFeedback, nps: Number(e.target.value) })}
                  className="input-clean"
                  style={{ width: '100%', borderRadius: '10px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Comments</label>
                <textarea
                  rows={3}
                  placeholder="Guest remarks or compliments..."
                  value={newFeedback.comment}
                  onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                  className="input-clean"
                  style={{ width: '100%', borderRadius: '10px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setFeedbackModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
