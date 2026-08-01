BEGIN;

DELETE FROM public.transactions WHERE clinic_id = '92000000-0000-4000-8000-000000000001';
DELETE FROM public.appointment_treatments WHERE appointment_id::text LIKE '97000000-0000-4000-8000-00000000000%';
DELETE FROM public.appointments WHERE clinic_id = '92000000-0000-4000-8000-000000000001';
DELETE FROM public.treatment_inventory_items WHERE treatment_id::text LIKE '95000000-0000-4000-8000-00000000000%';
DELETE FROM public.inventory_items WHERE clinic_id = '92000000-0000-4000-8000-000000000001';
DELETE FROM public.treatment WHERE clinic_id = '92000000-0000-4000-8000-000000000001';
DELETE FROM public.patients WHERE clinic_id = '92000000-0000-4000-8000-000000000001';
DELETE FROM public.clinic_memberships WHERE clinic_id = '92000000-0000-4000-8000-000000000001';
DELETE FROM public.employees WHERE clinic_id = '92000000-0000-4000-8000-000000000001';
DELETE FROM public.clinics WHERE id = '92000000-0000-4000-8000-000000000001';
DELETE FROM auth.identities WHERE user_id::text LIKE '91000000-0000-4000-8000-00000000000%';
DELETE FROM auth.users WHERE id::text LIKE '91000000-0000-4000-8000-00000000000%';

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    '91000000-0000-4000-8000-000000000001',
    'authenticated', 'authenticated', 'video@thalia.local',
    crypt('ThaliaVideo123!', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Laura Martín","registration_profile_complete":true,"intended_operational_role":"admin"}',
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '91000000-0000-4000-8000-000000000002',
    'authenticated', 'authenticated', 'ana@thalia.local',
    crypt('ThaliaVideo123!', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Ana Soler","registration_profile_complete":true,"intended_operational_role":"doctor"}',
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '91000000-0000-4000-8000-000000000003',
    'authenticated', 'authenticated', 'marta@thalia.local',
    crypt('ThaliaVideo123!', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Marta Ruiz","registration_profile_complete":true,"intended_operational_role":"doctor"}',
    now(), now(), '', '', '', ''
  );

INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
)
VALUES
  (
    '91100000-0000-4000-8000-000000000001',
    '91000000-0000-4000-8000-000000000001',
    '91000000-0000-4000-8000-000000000001',
    '{"sub":"91000000-0000-4000-8000-000000000001","email":"video@thalia.local","email_verified":true}',
    'email', now(), now(), now()
  ),
  (
    '91100000-0000-4000-8000-000000000002',
    '91000000-0000-4000-8000-000000000002',
    '91000000-0000-4000-8000-000000000002',
    '{"sub":"91000000-0000-4000-8000-000000000002","email":"ana@thalia.local","email_verified":true}',
    'email', now(), now(), now()
  ),
  (
    '91100000-0000-4000-8000-000000000003',
    '91000000-0000-4000-8000-000000000003',
    '91000000-0000-4000-8000-000000000003',
    '{"sub":"91000000-0000-4000-8000-000000000003","email":"marta@thalia.local","email_verified":true}',
    'email', now(), now(), now()
  );

INSERT INTO public.clinics (
  id, name, address, phone, owner_id, specialty,
  opening_time, closing_time, open_days, timezone
)
VALUES (
  '92000000-0000-4000-8000-000000000001',
  'Clínica Áurea', 'Calle Velázquez 48, Madrid', '+34914567890',
  '91000000-0000-4000-8000-000000000001', 'Medicina estética',
  '08:00', '20:00', ARRAY[1,2,3,4,5], 'Europe/Madrid'
);

INSERT INTO public.employees (
  id, clinic_id, full_name, role, specialty, color, phone, active
)
VALUES
  ('91000000-0000-4000-8000-000000000001', '92000000-0000-4000-8000-000000000001', 'Laura Martín', 'admin', 'Dirección clínica', '#3D8FA0', '+34611000001', true),
  ('91000000-0000-4000-8000-000000000002', '92000000-0000-4000-8000-000000000001', 'Ana Soler', 'doctor', 'Medicina estética facial', '#7C6FCD', '+34611000002', true),
  ('91000000-0000-4000-8000-000000000003', '92000000-0000-4000-8000-000000000001', 'Marta Ruiz', 'doctor', 'Estética avanzada', '#D08B72', '+34611000003', true);

INSERT INTO public.clinic_memberships (
  id, user_id, clinic_id, role, status, joined_at
)
VALUES
  ('93000000-0000-4000-8000-000000000001', '91000000-0000-4000-8000-000000000001', '92000000-0000-4000-8000-000000000001', 'owner', 'active', now()),
  ('93000000-0000-4000-8000-000000000002', '91000000-0000-4000-8000-000000000002', '92000000-0000-4000-8000-000000000001', 'employee', 'active', now()),
  ('93000000-0000-4000-8000-000000000003', '91000000-0000-4000-8000-000000000003', '92000000-0000-4000-8000-000000000001', 'employee', 'active', now());

INSERT INTO public.patients (
  id, clinic_id, full_name, dni, birth_date, phone, email, address, notes
)
VALUES
  ('94000000-0000-4000-8000-000000000001', '92000000-0000-4000-8000-000000000001', 'Elena García', '48276114F', '1989-03-14', '+34621000001', 'elena.garcia@example.com', 'Madrid', 'Seguimiento facial trimestral. Piel sensible.'),
  ('94000000-0000-4000-8000-000000000002', '92000000-0000-4000-8000-000000000001', 'Sofía Navarro', '53198022P', '1992-08-21', '+34621000002', 'sofia.navarro@example.com', 'Madrid', 'Primera valoración completada.'),
  ('94000000-0000-4000-8000-000000000003', '92000000-0000-4000-8000-000000000001', 'Carla Mendoza', '26711480L', '1985-11-06', '+34621000003', 'carla.mendoza@example.com', 'Pozuelo de Alarcón', 'Plan de tratamiento personalizado.'),
  ('94000000-0000-4000-8000-000000000004', '92000000-0000-4000-8000-000000000001', 'Lucía Romero', '41972635H', '1996-05-29', '+34621000004', 'lucia.romero@example.com', 'Madrid', 'Revisión programada.'),
  ('94000000-0000-4000-8000-000000000005', '92000000-0000-4000-8000-000000000001', 'Paula Ortega', '30864571S', '1990-01-18', '+34621000005', 'paula.ortega@example.com', 'Majadahonda', 'Tratamiento de mantenimiento.'),
  ('94000000-0000-4000-8000-000000000006', '92000000-0000-4000-8000-000000000001', 'Irene Vidal', '57390216J', '1987-07-11', '+34621000006', 'irene.vidal@example.com', 'Madrid', 'Sin incidencias clínicas.');

INSERT INTO public.treatment (
  id, clinic_id, name, category, duration_minutes, color, price
)
VALUES
  ('95000000-0000-4000-8000-000000000001', '92000000-0000-4000-8000-000000000001', 'Diagnóstico facial avanzado', 'Facial', 45, '#3D8FA0', 95.00),
  ('95000000-0000-4000-8000-000000000002', '92000000-0000-4000-8000-000000000001', 'Hidratación profunda', 'Facial', 60, '#7C6FCD', 145.00),
  ('95000000-0000-4000-8000-000000000003', '92000000-0000-4000-8000-000000000001', 'Rejuvenecimiento luminosidad', 'Facial', 45, '#D08B72', 180.00);

INSERT INTO public.inventory_items (
  id, clinic_id, name, category, unit, stock, min_stock, unit_price
)
VALUES
  ('96000000-0000-4000-8000-000000000001', '92000000-0000-4000-8000-000000000001', 'Ácido hialurónico 1 ml', 'Inyectables', 'unidad', 24, 8, 42.00),
  ('96000000-0000-4000-8000-000000000002', '92000000-0000-4000-8000-000000000001', 'Mascarilla calmante', 'Cabina', 'unidad', 38, 12, 6.50),
  ('96000000-0000-4000-8000-000000000003', '92000000-0000-4000-8000-000000000001', 'Sérum antioxidante', 'Cabina', 'ml', 85, 25, 1.80),
  ('96000000-0000-4000-8000-000000000004', '92000000-0000-4000-8000-000000000001', 'Guantes de nitrilo', 'Consumibles', 'caja', 14, 5, 9.90);

INSERT INTO public.treatment_inventory_items (
  id, treatment_id, inventory_item_id, quantity
)
VALUES
  ('96100000-0000-4000-8000-000000000001', '95000000-0000-4000-8000-000000000001', '96000000-0000-4000-8000-000000000003', 5),
  ('96100000-0000-4000-8000-000000000002', '95000000-0000-4000-8000-000000000002', '96000000-0000-4000-8000-000000000002', 1),
  ('96100000-0000-4000-8000-000000000003', '95000000-0000-4000-8000-000000000003', '96000000-0000-4000-8000-000000000001', 1);

INSERT INTO public.appointments (
  id, clinic_id, patient_id, employee_id, starts_at, ends_at, status, notes
)
VALUES
  ('97000000-0000-4000-8000-000000000001', '92000000-0000-4000-8000-000000000001', '94000000-0000-4000-8000-000000000001', '91000000-0000-4000-8000-000000000002', (CURRENT_DATE + TIME '08:30') AT TIME ZONE 'Europe/Madrid', (CURRENT_DATE + TIME '09:15') AT TIME ZONE 'Europe/Madrid', 'confirmed', 'Revisión y diagnóstico facial.'),
  ('97000000-0000-4000-8000-000000000002', '92000000-0000-4000-8000-000000000001', '94000000-0000-4000-8000-000000000002', '91000000-0000-4000-8000-000000000003', (CURRENT_DATE + TIME '09:30') AT TIME ZONE 'Europe/Madrid', (CURRENT_DATE + TIME '10:30') AT TIME ZONE 'Europe/Madrid', 'confirmed', 'Hidratación profunda.'),
  ('97000000-0000-4000-8000-000000000003', '92000000-0000-4000-8000-000000000001', '94000000-0000-4000-8000-000000000003', '91000000-0000-4000-8000-000000000002', (CURRENT_DATE + TIME '10:45') AT TIME ZONE 'Europe/Madrid', (CURRENT_DATE + TIME '11:30') AT TIME ZONE 'Europe/Madrid', 'scheduled', 'Tratamiento de luminosidad.'),
  ('97000000-0000-4000-8000-000000000004', '92000000-0000-4000-8000-000000000001', '94000000-0000-4000-8000-000000000004', '91000000-0000-4000-8000-000000000003', (CURRENT_DATE + TIME '12:00') AT TIME ZONE 'Europe/Madrid', (CURRENT_DATE + TIME '12:45') AT TIME ZONE 'Europe/Madrid', 'confirmed', 'Valoración inicial.'),
  ('97000000-0000-4000-8000-000000000005', '92000000-0000-4000-8000-000000000001', '94000000-0000-4000-8000-000000000005', '91000000-0000-4000-8000-000000000002', (CURRENT_DATE + TIME '15:30') AT TIME ZONE 'Europe/Madrid', (CURRENT_DATE + TIME '16:30') AT TIME ZONE 'Europe/Madrid', 'scheduled', 'Hidratación y seguimiento.'),
  ('97000000-0000-4000-8000-000000000006', '92000000-0000-4000-8000-000000000001', '94000000-0000-4000-8000-000000000006', '91000000-0000-4000-8000-000000000003', (CURRENT_DATE + TIME '17:00') AT TIME ZONE 'Europe/Madrid', (CURRENT_DATE + TIME '17:45') AT TIME ZONE 'Europe/Madrid', 'confirmed', 'Rejuvenecimiento y control.'),
  ('97000000-0000-4000-8000-000000000007', '92000000-0000-4000-8000-000000000001', '94000000-0000-4000-8000-000000000001', '91000000-0000-4000-8000-000000000002', ((CURRENT_DATE - 14) + TIME '11:00') AT TIME ZONE 'Europe/Madrid', ((CURRENT_DATE - 14) + TIME '11:45') AT TIME ZONE 'Europe/Madrid', 'completed', 'Sesión completada sin incidencias.');

INSERT INTO public.appointment_treatments (
  id, appointment_id, treatment_id, price_at_booking
)
VALUES
  ('97100000-0000-4000-8000-000000000001', '97000000-0000-4000-8000-000000000001', '95000000-0000-4000-8000-000000000001', 95.00),
  ('97100000-0000-4000-8000-000000000002', '97000000-0000-4000-8000-000000000002', '95000000-0000-4000-8000-000000000002', 145.00),
  ('97100000-0000-4000-8000-000000000003', '97000000-0000-4000-8000-000000000003', '95000000-0000-4000-8000-000000000003', 180.00),
  ('97100000-0000-4000-8000-000000000004', '97000000-0000-4000-8000-000000000004', '95000000-0000-4000-8000-000000000001', 95.00),
  ('97100000-0000-4000-8000-000000000005', '97000000-0000-4000-8000-000000000005', '95000000-0000-4000-8000-000000000002', 145.00),
  ('97100000-0000-4000-8000-000000000006', '97000000-0000-4000-8000-000000000006', '95000000-0000-4000-8000-000000000003', 180.00),
  ('97100000-0000-4000-8000-000000000007', '97000000-0000-4000-8000-000000000007', '95000000-0000-4000-8000-000000000001', 95.00);

INSERT INTO public.transactions (
  id, clinic_id, appointment_id, type, category, amount, description, date, created_by
)
VALUES
  ('98000000-0000-4000-8000-000000000001', '92000000-0000-4000-8000-000000000001', '97000000-0000-4000-8000-000000000007', 'income', 'Tratamientos', 95.00, 'Diagnóstico facial avanzado', CURRENT_DATE - 14, '91000000-0000-4000-8000-000000000001'),
  ('98000000-0000-4000-8000-000000000002', '92000000-0000-4000-8000-000000000001', null, 'income', 'Tratamientos', 145.00, 'Hidratación profunda', CURRENT_DATE - 8, '91000000-0000-4000-8000-000000000001'),
  ('98000000-0000-4000-8000-000000000003', '92000000-0000-4000-8000-000000000001', null, 'income', 'Tratamientos', 180.00, 'Rejuvenecimiento luminosidad', CURRENT_DATE - 3, '91000000-0000-4000-8000-000000000001'),
  ('98000000-0000-4000-8000-000000000004', '92000000-0000-4000-8000-000000000001', null, 'expense', 'Material', 84.00, 'Reposición de consumibles', CURRENT_DATE - 5, '91000000-0000-4000-8000-000000000001'),
  ('98000000-0000-4000-8000-000000000005', '92000000-0000-4000-8000-000000000001', null, 'expense', 'Operaciones', 48.00, 'Material de cabina', CURRENT_DATE - 1, '91000000-0000-4000-8000-000000000001');

COMMIT;
