// Simple in-memory store — later replace with Redis or MongoDB

const sessions = new Map();

/**
 * Save message to a user’s conversation context.
 */
export function saveContext(sessionId, role, message) {
  if (!sessions.has(sessionId)) sessions.set(sessionId, []);
  sessions.get(sessionId).push({ role, message, timestamp: new Date() });
}

/**
 * Retrieve last N messages for the context.
 */
export function getContext(sessionId, limit = 5) {
  const msgs = sessions.get(sessionId) || [];
  return msgs.slice(-limit);
}

/**
 * Clear user context (on admin command or timeout)
 */
export function clearContext(sessionId) {
  sessions.delete(sessionId);
}
