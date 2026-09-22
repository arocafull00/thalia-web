let queryEpoch = 0;

export function advanceQueryEpoch() {
  queryEpoch += 1;
}

export function getQueryEpoch() {
  return queryEpoch;
}

export function isCurrentQueryEpoch(epoch: number) {
  return queryEpoch === epoch;
}
