ALTER TABLE public.whatsapp_config
  ALTER COLUMN message_template SET DEFAULT 'Tienes una cita [cuando] a las [hora] en [clínica].';

UPDATE public.whatsapp_config
SET message_template = 'Tienes una cita [cuando] a las [hora] en [clínica].';
