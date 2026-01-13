export async function sendWhatsApp(to: string, message: string) {
  // Placeholder: integrate with WhatsApp Cloud API (Facebook) or Twilio
  const token = process.env.WHATSAPP_TOKEN;
  if (!token) throw new Error("WhatsApp not configured");
  // Simulate success for now
  return { ok: true };
}
