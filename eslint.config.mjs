import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "react-hooks/incompatible-library": "off",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
          pathGroups: [
            { pattern: "@/**", group: "internal", position: "before" },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
        },
      ],
      "import/no-duplicates": "error",
      "import/newline-after-import": "error",
      "react/no-multi-comp": ["error", { ignoreStateless: false }],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/**/index", "./*/index", "../*/index"],
              message:
                "No importes desde barrel files (index.ts). Importa directamente desde el módulo.",
            },
          ],
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    files: [
      "src/components/ui/combobox.tsx",
      "src/components/ui/input-group.tsx",
      "src/components/ui/sheet.tsx",
      "src/components/ui/sidebar.tsx",
      "src/components/ui/table.tsx",
      "src/components/ui/tooltip.tsx",
      "src/components/ui/popover.tsx",
      "src/components/ui/select.tsx",
      "src/components/ui/calendar.tsx",
      "src/components/ui/dropzone.tsx",
      "src/components/ui/dropzone.tsx",
      "src/components/ui/*"
    ],
    rules: {
      "react/no-multi-comp": "off",
    },
  },
  {
    // Edge functions (Deno): console.log es su mecanismo de logging, lo captura
    // Supabase. La regla no-console apunta a código de navegador.
    files: ["supabase/functions/**/*.ts"],
    rules: {
      "no-console": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "*.tsbuildinfo",
    ".vercel/**",
    "certificates/**",
    ".agents/**",
    // Artefactos generados: bundles minificados que disparaban cientos de
    // errores falsos y dejaban `pnpm lint` inservible tras correr los E2E o
    // `supabase functions serve`.
    "playwright-report/**",
    "test-results/**",
    "supabase/.temp/**",
  ]),
]);

export default eslintConfig;
