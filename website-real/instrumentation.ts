export async function register() {
  if (process.env.NEXT_RUNTIME !== "browser") {
    return
  }

  await import("./instrumentation.client")
}
