type UseBootLoadingPhaseInput = {
  authLoading: boolean;
  clinicLoading: boolean;
};

export function useBootLoadingPhase({
  authLoading,
  clinicLoading,
}: UseBootLoadingPhaseInput) {
  if (authLoading) {
    return { activeStepIndex: 0, progressValue: 25 };
  }

  if (clinicLoading) {
    return { activeStepIndex: 1, progressValue: 58 };
  }

  return { activeStepIndex: 2, progressValue: 88 };
}
