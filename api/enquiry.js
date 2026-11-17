const { validateEnquiry } = require("./validate");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const result = validateEnquiry(req.body);
  if (result.spam) return res.status(200).json({ ok: true });
  if (result.error) return res.status(400).json({ error: result.error });

  const { RESEND_API_KEY, ENQUIRY_TO, ENQUIRY_FROM } = process.env;
  if (!RESEND_API_KEY || !ENQUIRY_TO || !ENQUIRY_FROM) {
    return res.status(503).json({ error: "Enquiries are not configured yet." });
  }

  const { name, email, interest, message } = result.value;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: ENQUIRY_FROM,
      to: [ENQUIRY_TO],
      reply_to: email,
      subject: `Evoque enquiry: ${interest}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Interested in: ${interest}`,
        "",
        `Message: ${message || "No additional message"}`,
      ].join("\n"),
    }),
  });

  if (!response.ok) return res.status(502).json({ error: "Could not send your enquiry." });
  return res.status(200).json({ ok: true });
};
