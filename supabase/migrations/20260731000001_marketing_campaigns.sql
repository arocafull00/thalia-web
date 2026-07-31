-- Campañas de marketing + envío por WhatsApp (issue #31)
--
-- Nivel 2 (sandbox de Twilio, texto libre dentro de la ventana de 24h) es lo
-- que se opera. Las columnas marcadas como "nivel 3" quedan creadas pero sin
-- uso hasta que WHATSAPP_MODE=production exija plantillas aprobadas por Meta;
-- así el salto a producción no necesita migración destructiva.

-- ---------------------------------------------------------------------------
-- Consentimiento de marketing (RGPD / LOPDGDD)
-- ---------------------------------------------------------------------------
-- Sin opt-in explícito no se puede enviar comunicación comercial. El filtro
-- vive en la query de segmentación, no en la UI.

ALTER TABLE patients
  ADD COLUMN marketing_opt_in BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN marketing_opt_out_at TIMESTAMPTZ;

CREATE INDEX idx_patients_marketing_opt_in
  ON patients (clinic_id)
  WHERE marketing_opt_in = true;

-- ---------------------------------------------------------------------------
-- campaign_templates
-- ---------------------------------------------------------------------------
-- En nivel 2 son plantillas propias reutilizables. En nivel 3 pasan a ser el
-- espejo de las plantillas registradas en Meta.

CREATE TABLE campaign_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  footer TEXT,
  image_url TEXT,
  -- Nivel 3
  meta_template_name TEXT,
  approval_status TEXT
    CHECK (approval_status IS NULL OR approval_status IN ('pending','approved','rejected')),
  variables JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_campaign_templates_clinic_id ON campaign_templates (clinic_id);

CREATE TRIGGER campaign_templates_updated_at BEFORE UPDATE ON campaign_templates
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- campaigns
-- ---------------------------------------------------------------------------

CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  footer_text TEXT,
  footer_website TEXT,
  footer_phone TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','scheduled','sent','cancelled')),
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  -- Nivel 3
  template_id UUID REFERENCES campaign_templates(id) ON DELETE SET NULL,
  variable_values JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Una campaña programada sin fecha nunca se dispararía: se rechaza en BD.
  CONSTRAINT campaigns_scheduled_requires_date
    CHECK (status <> 'scheduled' OR scheduled_at IS NOT NULL)
);

CREATE INDEX idx_campaigns_clinic_id ON campaigns (clinic_id);

-- Índice del despachador de la fase E: sólo las programadas pendientes.
CREATE INDEX idx_campaigns_pending_dispatch
  ON campaigns (scheduled_at)
  WHERE status = 'scheduled';

CREATE TRIGGER campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- campaign_segments
-- ---------------------------------------------------------------------------
-- config guarda los parámetros del filtro; su forma depende de segment_type
-- (p. ej. {"treatment_type_id": "..."} o {"months_since_last_visit": 6}).
-- En la fase B los filtros se combinan con AND.

CREATE TABLE campaign_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  segment_type TEXT NOT NULL
    CHECK (segment_type IN ('treatment_type','visit_count','last_visit_date','age_range','custom_filter')),
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_campaign_segments_campaign_id ON campaign_segments (campaign_id);

-- ---------------------------------------------------------------------------
-- campaign_recipients
-- ---------------------------------------------------------------------------
-- Se materializa al lanzar la campaña. phone se congela en el momento del
-- envío: si el paciente cambia de número después, el log sigue reflejando a
-- dónde se envió de verdad.

CREATE TABLE campaign_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','sent','failed')),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  provider_message_id TEXT,
  -- Fuera de alcance por ahora: poblarlas exige webhooks de estado de Twilio
  -- y URLs con redirect propio. Se crean para no migrar de nuevo más adelante.
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Un paciente aparece como mucho una vez por campaña. Un reintento actualiza
-- la fila existente en vez de crear una segunda, que sería un envío duplicado.
CREATE UNIQUE INDEX campaign_recipients_unique_per_campaign
  ON campaign_recipients (campaign_id, patient_id);

CREATE INDEX idx_campaign_recipients_campaign_id ON campaign_recipients (campaign_id);
CREATE INDEX idx_campaign_recipients_patient_id ON campaign_recipients (patient_id);

-- Cola de envío: las pendientes de una campaña concreta.
CREATE INDEX idx_campaign_recipients_pending
  ON campaign_recipients (campaign_id)
  WHERE status = 'pending';

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
-- Lectura: cualquier empleado de la clínica.
-- Escritura: admin y reception. Enviar comunicaciones masivas es una acción de
-- negocio, no clínica, así que doctor y auxiliary quedan fuera.

ALTER TABLE campaign_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY campaign_templates_select_same_clinic ON campaign_templates
  FOR SELECT USING (clinic_id = current_employee_clinic_id());

CREATE POLICY campaign_templates_write_allowed_roles ON campaign_templates
  FOR ALL USING (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() IN ('admin','reception')
  )
  WITH CHECK (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() IN ('admin','reception')
  );

CREATE POLICY campaigns_select_same_clinic ON campaigns
  FOR SELECT USING (clinic_id = current_employee_clinic_id());

CREATE POLICY campaigns_write_allowed_roles ON campaigns
  FOR ALL USING (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() IN ('admin','reception')
  )
  WITH CHECK (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() IN ('admin','reception')
  );

CREATE POLICY campaign_segments_select_same_clinic ON campaign_segments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_segments.campaign_id
      AND campaigns.clinic_id = current_employee_clinic_id()
    )
  );

CREATE POLICY campaign_segments_write_allowed_roles ON campaign_segments
  FOR ALL USING (
    current_employee_role() IN ('admin','reception')
    AND EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_segments.campaign_id
      AND campaigns.clinic_id = current_employee_clinic_id()
    )
  )
  WITH CHECK (
    current_employee_role() IN ('admin','reception')
    AND EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_segments.campaign_id
      AND campaigns.clinic_id = current_employee_clinic_id()
    )
  );

-- Los destinatarios son un log de envío: la app los lee, pero quien los
-- escribe es la edge function con service role, que se salta RLS.
CREATE POLICY campaign_recipients_select_same_clinic ON campaign_recipients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_recipients.campaign_id
      AND campaigns.clinic_id = current_employee_clinic_id()
    )
  );

-- ---------------------------------------------------------------------------
-- Storage: imágenes destacadas de campaña
-- ---------------------------------------------------------------------------
-- Bucket privado, igual que patient-images. Twilio recibe una URL firmada en
-- el momento del envío, no una URL pública permanente.
--
-- Convención de ruta: <clinic_id>/<uuid>.<ext>. La primera carpeta tiene que
-- ser el clinic_id porque es lo que comprueban las políticas de abajo; el
-- resto es libre. Se sube antes de que la campaña exista, así que la ruta no
-- puede depender del campaign_id.

INSERT INTO storage.buckets (id, name, public)
VALUES ('campaign-images', 'campaign-images', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY campaign_images_storage_select ON storage.objects
  FOR SELECT USING (
    bucket_id = 'campaign-images'
    AND (storage.foldername(name))[1]::uuid = current_employee_clinic_id()
  );

CREATE POLICY campaign_images_storage_insert ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'campaign-images'
    AND (storage.foldername(name))[1]::uuid = current_employee_clinic_id()
    AND current_employee_role() IN ('admin','reception')
  );

CREATE POLICY campaign_images_storage_delete ON storage.objects
  FOR DELETE USING (
    bucket_id = 'campaign-images'
    AND (storage.foldername(name))[1]::uuid = current_employee_clinic_id()
    AND current_employee_role() IN ('admin','reception')
  );
