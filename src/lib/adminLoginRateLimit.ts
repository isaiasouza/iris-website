const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

type AttemptState = {
  attempts: number;
  windowStartedAt: number;
  blockedUntil: number;
};

const attempts = new Map<string, AttemptState>();

function currentState(identifier: string, now = Date.now()): AttemptState {
  const state = attempts.get(identifier);
  if (!state || now - state.windowStartedAt >= WINDOW_MS) {
    const fresh = { attempts: 0, windowStartedAt: now, blockedUntil: 0 };
    attempts.set(identifier, fresh);
    return fresh;
  }
  return state;
}

export function loginRateLimit(identifier: string) {
  const now = Date.now();
  const state = currentState(identifier, now);
  return {
    blocked: state.blockedUntil > now,
    retryAfterSeconds: Math.max(0, Math.ceil((state.blockedUntil - now) / 1000)),
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - state.attempts),
  };
}

export function recordFailedLogin(identifier: string) {
  const now = Date.now();
  const state = currentState(identifier, now);
  state.attempts += 1;
  if (state.attempts >= MAX_ATTEMPTS) state.blockedUntil = now + BLOCK_MS;
  attempts.set(identifier, state);
  return loginRateLimit(identifier);
}

export function clearFailedLogins(identifier: string) {
  attempts.delete(identifier);
}
