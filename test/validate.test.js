const test = require("node:test");
const assert = require("node:assert");
const { validateEnquiry } = require("../api/validate");

const good = { name: "Ada", email: "ada@example.com", interest: "Book a test drive", message: "Hi" };

test("accepts a valid enquiry", () => {
  assert.deepStrictEqual(validateEnquiry(good).value, good);
});
test("rejects bad email", () => {
  assert.ok(validateEnquiry({ ...good, email: "nope" }).error);
});
test("rejects missing name", () => {
  assert.ok(validateEnquiry({ ...good, name: " " }).error);
});
test("flags honeypot as spam", () => {
  assert.ok(validateEnquiry({ ...good, website: "x" }).spam);
});
test("strips newlines from header-bound fields", () => {
  assert.strictEqual(validateEnquiry({ ...good, name: "A\r\nBcc: x" }).value.name, "A Bcc: x");
});
