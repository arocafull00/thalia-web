-- El bucket de avatares deja de ser público (issue #125)
--
-- `avatars` tenía `public = true` y se servía con `getPublicUrl`, mientras que
-- los otros tres buckets —patient-images, patient-files, campaign-images— ya
-- eran privados con URL firmada.
--
-- Ahí van las fotos de los pacientes: `uploadPatientAvatar` sube a
-- `patients/{id}/avatar.webp`. Con el bucket público, cualquiera con la URL veía
-- la cara de un paciente sin autenticarse, y ninguna política intervenía: en un
-- bucket público el RLS no se aplica.

UPDATE storage.buckets SET public = false WHERE id = 'avatars';

-- ---------------------------------------------------------------------------
-- Quién puede leer cada avatar
-- ---------------------------------------------------------------------------
--
-- Dos tipos de objeto conviven en el bucket, distinguibles por el prefijo:
--
--   patients/{patientId}/avatar.webp
--   employees/{userId}/avatar.webp
--
-- El de paciente se rige por `can_access_patient`, exactamente el mismo criterio
-- que la tabla `patients` (#102): un autónomo sólo ve los de sus citas. No se
-- reutiliza `can_access_patient_storage` porque esa espera la ruta del storage
-- clínico, que empieza por el id de clínica, y aquí no lo hay.
--
-- El de empleado lo ve uno mismo y quien comparta una clínica activa con él: es
-- lo que necesita la barra lateral y el listado de personal.

CREATE OR REPLACE FUNCTION private.can_access_avatar(p_storage_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
DECLARE
  tipo TEXT;
  id_objetivo UUID;
BEGIN
  tipo := split_part(p_storage_name, '/', 1);
  id_objetivo := split_part(p_storage_name, '/', 2)::UUID;

  IF tipo = 'patients' THEN
    RETURN (SELECT private.can_access_patient(id_objetivo));
  END IF;

  IF tipo = 'employees' THEN
    RETURN id_objetivo = (SELECT auth.uid())
        OR (SELECT private.shares_active_clinic(id_objetivo));
  END IF;

  -- Un prefijo que no reconocemos no se sirve. Preferible a abrir por defecto.
  RETURN false;
-- Una ruta cuyo segundo segmento no sea un UUID no pertenece a nadie.
EXCEPTION WHEN invalid_text_representation THEN
  RETURN false;
END;
$$;

GRANT EXECUTE ON FUNCTION private.can_access_avatar(TEXT) TO authenticated;

DROP POLICY IF EXISTS avatars_storage_select ON storage.objects;
CREATE POLICY avatars_storage_select
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (SELECT private.can_access_avatar(name))
  );

-- ---------------------------------------------------------------------------
-- Quién puede subirlos y reemplazarlos
-- ---------------------------------------------------------------------------
--
-- La subida usa `upsert: true`, así que hace falta INSERT y UPDATE.
--
-- El avatar del paciente lo cambia quien puede editar pacientes, que excluye al
-- autónomo: para él los pacientes son de sólo lectura (#101). El propio, uno
-- mismo.

CREATE OR REPLACE FUNCTION private.can_write_avatar(p_storage_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
DECLARE
  tipo TEXT;
  id_objetivo UUID;
  clinica UUID;
BEGIN
  tipo := split_part(p_storage_name, '/', 1);
  id_objetivo := split_part(p_storage_name, '/', 2)::UUID;

  IF tipo = 'patients' THEN
    SELECT patient.clinic_id INTO clinica
    FROM public.patients patient WHERE patient.id = id_objetivo;

    IF clinica IS NULL THEN
      RETURN false;
    END IF;

    RETURN (SELECT private.can_manage_clinic(
      clinica, ARRAY['admin', 'reception', 'doctor']
    ));
  END IF;

  IF tipo = 'employees' THEN
    RETURN id_objetivo = (SELECT auth.uid());
  END IF;

  RETURN false;
EXCEPTION WHEN invalid_text_representation THEN
  RETURN false;
END;
$$;

GRANT EXECUTE ON FUNCTION private.can_write_avatar(TEXT) TO authenticated;

DROP POLICY IF EXISTS avatars_storage_insert ON storage.objects;
CREATE POLICY avatars_storage_insert
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (SELECT private.can_write_avatar(name))
  );

DROP POLICY IF EXISTS avatars_storage_update ON storage.objects;
CREATE POLICY avatars_storage_update
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (SELECT private.can_write_avatar(name))
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND (SELECT private.can_write_avatar(name))
  );

DROP POLICY IF EXISTS avatars_storage_delete ON storage.objects;
CREATE POLICY avatars_storage_delete
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (SELECT private.can_write_avatar(name))
  );
