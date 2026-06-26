const MIN_INTERVAL_MS = 1000;

export type SendGuardState = {
  lastSentAt: number;
  lastBody: string;
};

export function canSendMessage(body: string, state: SendGuardState) {
  const now = Date.now();
  const normalizedBody = body.trim();

  if (now - state.lastSentAt < MIN_INTERVAL_MS) {
    return '連続投稿は1秒以上あけてください。';
  }

  if (state.lastBody && state.lastBody === normalizedBody) {
    return '同じ文章の連続投稿はできません。';
  }

  return null;
}

export function nextSendGuardState(body: string): SendGuardState {
  return {
    lastSentAt: Date.now(),
    lastBody: body.trim(),
  };
}
