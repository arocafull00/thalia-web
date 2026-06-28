# Changelog

## 2-fix-redirección-post-auth

- Usuario autenticado sin clínica redirige a `/create-clinic` en lugar de quedarse en `/login`
- Botón "Salir" añadido en la página de creación de clínica
- Navegaciones en `CreateClinicPageClient` movidas a `useEffect` para evitar updates durante el render. Error javascript que sale en el navegador:
  Cannot update a component (`Router`) while rendering a different component (`CreateClinicPageClient`). To locate the bad setState() call inside `CreateClinicPageClient`, follow the stack trace as described in https://react.dev/link/setstate-in-render
- Botón "Salir" añadido en la página de registro de empleado: cierra sesión si hay sesión activa, redirige a `/login` si no la hay
