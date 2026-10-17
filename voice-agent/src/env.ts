/**
 * Loads a local .env file into process.env when one exists (Node 20.12+ built-in).
 * Variables already present in the environment win, as on Render or in Docker.
 */
export function loadDotEnv(path = ".env"): void {
  try {
    process.loadEnvFile(path);
  } catch {
    // No .env file: the real environment is the only source, which is the production case.
  }
}
