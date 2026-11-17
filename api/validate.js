
function clean(value, max) {
  return String(value ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

function validateEnquiry(body) {
  if (!body || typeof body !== "object") return { error: "Invalid request." };
  if (body.website) return { spam: true }; // honeypot field

  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const interest = clean(body.interest, 100);
  const message = String(body.message ?? "").trim().slice(0, 2000);

  if (!name) return { error: "Please enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter a valid email." };
  if (!interest) return { error: "Please choose what you are interested in." };

  return { value: { name, email, interest, message } };
}

module.exports = { validateEnquiry };
