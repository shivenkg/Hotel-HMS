/**
 * ============================================================================
 * IDENTITY & RBAC DOMAIN MODULE
 * Handles Authentication, User Provisioning, and Role-Based Access Scoping
 * ============================================================================
 */

import { Router, Request, Response } from 'express';
import { store, SystemUser, getRolePermissions } from '../../data/store.js';

export const identityRouter = Router();

identityRouter.post('/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = store.systemUsers.find(u => 
    (u.username.toLowerCase() === String(username).toLowerCase() || (u.username === 'admin' && username === 'admin@grandazure.com')) &&
    (u.password === password || u.passwordHash === password)
  );

  if (user) {
    store.logAudit(user.name, user.role, 'USER_LOGIN', `User ${user.username} (${user.role}) logged in successfully.`);
    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        department: user.department,
        allowedTabs: user.allowedTabs,
        landingTab: user.landingTab,
        token: `jwt-simulated-${Date.now()}`
      }
    });
  }
  return res.status(401).json({ success: false, error: 'Invalid User ID or Password' });
});

identityRouter.get('/users', (req: Request, res: Response) => {
  const sanitized = store.systemUsers.map(({ password: _p, passwordHash: _ph, ...rest }) => rest);
  res.json(sanitized);
});

identityRouter.post('/users', (req: Request, res: Response) => {
  const { name, username, password, role } = req.body;
  if (!name || !username || !password || !role) {
    return res.status(400).json({ error: 'Name, username, password, and role are required' });
  }

  const existing = store.systemUsers.find(u => u.username.toLowerCase() === String(username).toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'A user with this username already exists' });
  }

  const permissions = getRolePermissions(role);
  const newUser: SystemUser = {
    id: `usr-${Date.now()}`,
    name,
    username: String(username).toLowerCase().trim(),
    password,
    role,
    department: permissions.department,
    allowedTabs: permissions.allowedTabs,
    landingTab: permissions.landingTab,
    createdAt: new Date().toISOString().slice(0, 10)
  };

  store.systemUsers.unshift(newUser);
  store.logAudit('Jaylon Dorwart', 'Administrator', 'USER_CREATED', `Created new system user: ${newUser.username} with role [${newUser.role}]`);

  const { password: _p, passwordHash: _ph, ...userProfile } = newUser;
  res.status(201).json(userProfile);
});
