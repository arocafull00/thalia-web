type UseBootLoadingPhaseInput = {
  authLoading: boolean;
  clinicLoading: boolean;
};

export function useBootLoadingPhase({
  authLoading,
  clinicLoading,
}: UseBootLoadingPhaseInput) {
  if (authLoading) {
    return { activeStepIndex: 0 };
  }

  if (clinicLoading) {
    return { activeStepIndex: 1 };
  }

  return { activeStepIndex: 2 };
}
