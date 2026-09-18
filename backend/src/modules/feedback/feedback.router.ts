/**
 * ============================================================================
 * GUEST EXPERIENCE & LOYALTY DOMAIN MODULE
 * Handles Post-Stay Surveys, NPS Analytics, Sentiment Scoring, and Tiered Perks
 * ============================================================================
 */

import { Router, Request, Response } from 'express';
import { store } from '../../data/store.js';
import { outbox } from '../../events/outboxProcessor.js';

export const feedbackRouter = Router();

feedbackRouter.get('/guest-exp/feedback', (req: Request, res: Response) => {
  res.json(store.feedbackList);
});

feedbackRouter.post('/guest-exp/feedback', (req: Request, res: Response) => {
  const { guestName, roomNumber, npsScore, ratingCleanliness, ratingStaff, ratingFood, ratingValue, comments } = req.body;
  const score = Number(npsScore);
  const sentiment = score >= 8 ? 'Positive' : score >= 6 ? 'Neutral' : 'Negative';

  const fb = {
    id: `fb-${Date.now()}`,
    reservationId: `res-${Math.floor(1000 + Math.random() * 9000)}`,
    guestName,
    roomNumber,
    npsScore: score,
    ratingCleanliness: Number(ratingCleanliness) || 5,
    ratingStaff: Number(ratingStaff) || 5,
    ratingFood: Number(ratingFood) || 5,
    ratingValue: Number(ratingValue) || 5,
    comments: comments || 'Delightful hospitality stay',
    sentiment: sentiment as 'Positive' | 'Neutral' | 'Negative',
    date: new Date().toISOString().slice(0, 10)
  };

  store.feedbackList.unshift(fb);

  outbox.recordEvent('feedback.received', 'CustomerFeedback', fb.id, {
    guestName,
    npsScore: score,
    sentiment
  });

  store.logAudit(guestName, 'Guest', 'FEEDBACK_SUBMITTED', `NPS Score: ${score}/10 - "${(comments || '').slice(0, 30)}..."`);
  res.status(201).json(fb);
});

feedbackRouter.get('/guest-exp/loyalty', (req: Request, res: Response) => {
  res.json(store.loyaltyMembers);
});
