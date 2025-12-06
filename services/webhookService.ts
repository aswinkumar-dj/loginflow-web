export async function sendSignupWebhook(payload: any) {
  try {
    await fetch(process.env.NEXT_PUBLIC_WEBHOOK as string, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Webhook failed", err);
  }
}
