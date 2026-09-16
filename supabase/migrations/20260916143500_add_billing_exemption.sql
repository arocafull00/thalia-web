ALTER TABLE public.clinic_billing
  ADD COLUMN billing_exempt BOOLEAN NOT NULL DEFAULT false;

GRANT SELECT (billing_exempt)
  ON public.clinic_billing TO authenticated;

CREATE OR REPLACE FUNCTION private.clinic_billing_allows_access(
  p_clinic_id UUID
)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT
    COALESCE((
      SELECT employee.account_type = 'external'
      FROM public.employees employee
      WHERE employee.id = (SELECT auth.uid())
    ), false)
    OR EXISTS (
      SELECT 1
      FROM public.clinic_billing billing
      WHERE billing.clinic_id = p_clinic_id
        AND (
          billing.billing_exempt
          OR billing.subscription_status IN ('trialing', 'active')
        )
    )
$$;
