-- Políticas ancladas al modelo de una sola clínica (issue #143)
--
-- `ec7b470` hizo globales a los empleados y eliminó `employees.clinic_id`, pero
-- dejó 18 políticas usando `current_employee_clinic_id()`, que ahora devuelve
-- sólo la PRIMERA membresía activa. Efecto: quien pertenece a dos clínicas
-- pierde citas, campañas, transacciones, tratamientos de cita, materiales y
-- ficheros de campaña al trabajar en la segunda.
--
-- No estaban duplicadas: en estas nueve tablas son las únicas que hay, así que
-- no se pueden borrar —una tabla con RLS y sin política deniega todo— sino
-- sustituir.
--
-- Tres efectos de paso:
--
--   1. Se cierra la fuga de `campaigns` → `campaign_recipients`, donde un
--      autónomo veía teléfonos de pacientes que no puede ver (#102).
--   2. Seis de ellas son FOR ALL, y en PostgreSQL eso concede también SELECT
--      combinándose con OR. Al pasar a `can_manage_clinic` —que empieza por
--      NOT is_external_user()— esa trampa queda cerrada.
--   3. Queda una sola fuente de verdad sobre quién es externo.

-- ---------------------------------------------------------------------------
-- appointments
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS appointments_select_same_clinic ON appointments;
DROP POLICY IF EXISTS appointments_select_accessible ON appointments;

CREATE POLICY appointments_select_accessible
  ON appointments FOR SELECT TO authenticated
  USING (
    (SELECT private.has_active_clinic_access(clinic_id))
    AND (
      NOT (SELECT private.is_external_user())
      OR employee_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS appointments_create_edit_allowed_roles ON appointments;
DROP POLICY IF EXISTS appointments_insert_internal ON appointments;

CREATE POLICY appointments_insert_internal
  ON appointments FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT private.can_manage_clinic(clinic_id, ARRAY['admin','reception','doctor']))
  );

DROP POLICY IF EXISTS appointments_update_allowed_roles ON appointments;
DROP POLICY IF EXISTS appointments_update_accessible ON appointments;

-- El autónomo sí edita sus propias citas: va a operar sobre su agenda (#89).
-- Por eso aquí no vale `can_manage_clinic` a secas, que lo excluiría entero.
CREATE POLICY appointments_update_accessible
  ON appointments FOR UPDATE TO authenticated
  USING (
    (SELECT private.has_active_clinic_access(clinic_id))
    AND current_employee_role() = ANY (ARRAY['admin','reception','doctor'])
    AND (
      NOT (SELECT private.is_external_user())
      OR employee_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    (SELECT private.has_active_clinic_access(clinic_id))
    AND current_employee_role() = ANY (ARRAY['admin','reception','doctor'])
    AND (
      NOT (SELECT private.is_external_user())
      OR employee_id = (SELECT auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- appointment_treatments y appointment_inventory_items
-- ---------------------------------------------------------------------------
--
-- Cuelgan de la cita: si el usuario no ve la cita, no debe ver su contenido. El
-- EXISTS pasa por la política de arriba, así que el aislamiento se hereda.

DROP POLICY IF EXISTS appointment_treatments_select_same_clinic ON appointment_treatments;
DROP POLICY IF EXISTS appointment_treatments_select_accessible ON appointment_treatments;

CREATE POLICY appointment_treatments_select_accessible
  ON appointment_treatments FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_treatments.appointment_id
    )
  );

DROP POLICY IF EXISTS appointment_treatments_write_allowed_roles ON appointment_treatments;
DROP POLICY IF EXISTS appointment_treatments_write_internal ON appointment_treatments;

CREATE POLICY appointment_treatments_write_internal
  ON appointment_treatments FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_treatments.appointment_id
        AND (SELECT private.can_manage_clinic(
               appointments.clinic_id, ARRAY['admin','reception','doctor']))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_treatments.appointment_id
        AND (SELECT private.can_manage_clinic(
               appointments.clinic_id, ARRAY['admin','reception','doctor']))
    )
  );

DROP POLICY IF EXISTS appointment_inventory_items_select_same_clinic ON appointment_inventory_items;
DROP POLICY IF EXISTS appointment_inventory_items_select_accessible ON appointment_inventory_items;

CREATE POLICY appointment_inventory_items_select_accessible
  ON appointment_inventory_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_inventory_items.appointment_id
    )
  );

DROP POLICY IF EXISTS appointment_inventory_items_write_allowed_roles ON appointment_inventory_items;
DROP POLICY IF EXISTS appointment_inventory_items_write_internal ON appointment_inventory_items;

CREATE POLICY appointment_inventory_items_write_internal
  ON appointment_inventory_items FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_inventory_items.appointment_id
        AND (SELECT private.can_manage_clinic(
               appointments.clinic_id, ARRAY['admin','reception','auxiliary']))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_inventory_items.appointment_id
        AND (SELECT private.can_manage_clinic(
               appointments.clinic_id, ARRAY['admin','reception','auxiliary']))
    )
  );

-- ---------------------------------------------------------------------------
-- Marketing: campaigns, segments, templates, recipients
-- ---------------------------------------------------------------------------
--
-- Aquí estaba la fuga. `campaigns_select_same_clinic` era sólo la clínica, sin
-- mirar rol ni si el usuario es externo, y `campaign_recipients` cuelga de ella
-- guardando `patient_id` y `phone`. Resultado reproducido: un autónomo que sólo
-- puede ver 1 paciente obtenía los teléfonos de 5.
--
-- El marketing es negocio de la clínica y el autónomo no pinta nada ahí, así
-- que el corte es por `is_external_user()` y no por caso particular.

DROP POLICY IF EXISTS campaigns_select_same_clinic ON campaigns;
DROP POLICY IF EXISTS campaigns_select_internal ON campaigns;

CREATE POLICY campaigns_select_internal
  ON campaigns FOR SELECT TO authenticated
  USING (
    NOT (SELECT private.is_external_user())
    AND (SELECT private.has_active_clinic_access(clinic_id))
  );

DROP POLICY IF EXISTS campaigns_write_allowed_roles ON campaigns;
DROP POLICY IF EXISTS campaigns_write_internal ON campaigns;

CREATE POLICY campaigns_write_internal
  ON campaigns FOR ALL TO authenticated
  USING ((SELECT private.can_manage_clinic(clinic_id, ARRAY['admin','reception'])))
  WITH CHECK ((SELECT private.can_manage_clinic(clinic_id, ARRAY['admin','reception'])));

DROP POLICY IF EXISTS campaign_segments_select_same_clinic ON campaign_segments;
DROP POLICY IF EXISTS campaign_segments_select_internal ON campaign_segments;

CREATE POLICY campaign_segments_select_internal
  ON campaign_segments FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM campaigns WHERE campaigns.id = campaign_segments.campaign_id)
  );

DROP POLICY IF EXISTS campaign_segments_write_allowed_roles ON campaign_segments;
DROP POLICY IF EXISTS campaign_segments_write_internal ON campaign_segments;

CREATE POLICY campaign_segments_write_internal
  ON campaign_segments FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_segments.campaign_id
        AND (SELECT private.can_manage_clinic(campaigns.clinic_id, ARRAY['admin','reception']))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_segments.campaign_id
        AND (SELECT private.can_manage_clinic(campaigns.clinic_id, ARRAY['admin','reception']))
    )
  );

DROP POLICY IF EXISTS campaign_templates_select_same_clinic ON campaign_templates;
DROP POLICY IF EXISTS campaign_templates_select_internal ON campaign_templates;

CREATE POLICY campaign_templates_select_internal
  ON campaign_templates FOR SELECT TO authenticated
  USING (
    NOT (SELECT private.is_external_user())
    AND (SELECT private.has_active_clinic_access(clinic_id))
  );

DROP POLICY IF EXISTS campaign_templates_write_allowed_roles ON campaign_templates;
DROP POLICY IF EXISTS campaign_templates_write_internal ON campaign_templates;

CREATE POLICY campaign_templates_write_internal
  ON campaign_templates FOR ALL TO authenticated
  USING ((SELECT private.can_manage_clinic(clinic_id, ARRAY['admin','reception'])))
  WITH CHECK ((SELECT private.can_manage_clinic(clinic_id, ARRAY['admin','reception'])));

-- Hereda de campaigns, que ya excluye al externo. Es la tabla con los teléfonos.
DROP POLICY IF EXISTS campaign_recipients_select_same_clinic ON campaign_recipients;
DROP POLICY IF EXISTS campaign_recipients_select_internal ON campaign_recipients;

CREATE POLICY campaign_recipients_select_internal
  ON campaign_recipients FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM campaigns WHERE campaigns.id = campaign_recipients.campaign_id)
  );

-- ---------------------------------------------------------------------------
-- transactions
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS transactions_admin_same_clinic ON transactions;
DROP POLICY IF EXISTS transactions_admin_internal ON transactions;

CREATE POLICY transactions_admin_internal
  ON transactions FOR ALL TO authenticated
  USING ((SELECT private.can_manage_clinic(clinic_id, ARRAY['admin'])))
  WITH CHECK ((SELECT private.can_manage_clinic(clinic_id, ARRAY['admin'])));

-- ---------------------------------------------------------------------------
-- Ficheros de campaña en storage
-- ---------------------------------------------------------------------------
--
-- La ruta es <clinic_id>/<resto>, igual que en el storage clínico.

DROP POLICY IF EXISTS campaign_images_storage_select ON storage.objects;
CREATE POLICY campaign_images_storage_select
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'campaign-images'
    AND NOT (SELECT private.is_external_user())
    AND (SELECT private.has_active_clinic_access(split_part(name, '/', 1)::uuid))
  );

DROP POLICY IF EXISTS campaign_images_storage_insert ON storage.objects;
CREATE POLICY campaign_images_storage_insert
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'campaign-images'
    AND (SELECT private.can_manage_clinic(
           split_part(name, '/', 1)::uuid, ARRAY['admin','reception']))
  );

DROP POLICY IF EXISTS campaign_images_storage_delete ON storage.objects;
CREATE POLICY campaign_images_storage_delete
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'campaign-images'
    AND (SELECT private.can_manage_clinic(
           split_part(name, '/', 1)::uuid, ARRAY['admin','reception']))
  );

-- ---------------------------------------------------------------------------
-- Una sola fuente de verdad sobre quién es externo
-- ---------------------------------------------------------------------------
--
-- `current_membership_role()` la introdujo #99 leyendo `clinic_memberships.role`,
-- mientras el refactor lee `employees.account_type`. Coincidían, pero dos
-- mecanismos para la misma pregunta acaban divergiendo sin que nada falle de
-- forma visible. Ya no la usa ninguna política.

DROP FUNCTION IF EXISTS public.current_membership_role();
