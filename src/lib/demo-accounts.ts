/**
 * Cuentas demo habilitadas para el ingreso de un click en /login.
 * Es también el allowlist del server action: nada fuera de esta lista puede
 * iniciar sesión con la contraseña demo del servidor.
 */
export type DemoAccount = { email: string; label: string };

export const DEMO_ACCOUNTS: DemoAccount[] = [
  { email: "sofia.estudiante@demo.cl", label: "Estudiante 3° HC (Sofía)" },
  { email: "benjamin.estudiante@demo.cl", label: "Estudiante con informe entregado (Benjamín)" },
  { email: "isidora.tp@demo.cl", label: "Estudiante TP (Isidora)" },
  { email: "orientador@losandes.cl", label: "Orientadora HC" },
  { email: "psicologo@losandes.cl", label: "Psicólogo HC" },
  { email: "utp@losandes.cl", label: "UTP" },
  { email: "profesor@losandes.cl", label: "Profesor jefe" },
  { email: "orientador@valleverde.cl", label: "Orientadora TP" },
  { email: "apoderado.sofia@demo.cl", label: "Apoderado (de Sofía)" },
  { email: "partner@agroelroble.cl", label: "Partner" },
  { email: "admin@enruta.cl", label: "Admin ENRUTA" },
];
