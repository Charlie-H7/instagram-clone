import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override linting enforcement for my jest files, which use commonJS imports
  {
    files: ["jest.config.js"],
    rules:{
        "@typescript-eslint/no-require-imports": "off",
        // "eslint-disable-next-line react-hooks/set-state-in-effect" // Used for ignoring stateSetters in useEffect needed for infiniteScroll
      },
  },

  {
    files: ["app/app/u/components/ProfilePosts.tsx", "app/components/CreatePost.tsx", "app/app/components/Feed.tsx", "app/app/@modal/components/CommentSection.tsx"], // Add all files that have state setters in useEffect for infiniteScroll
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
