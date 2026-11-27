import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Mail, MapPin, Send } from "lucide-react";
import { motion } from "motion/react";

const INQUIRY_TOPICS = [
  "Healthcare Pilot",
  "University & Classroom Access",
  "Enterprise SDK Integration",
  "Deaf Linguistics Partnership",
];

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [topic, setTopic] = useState(INQUIRY_TOPICS[0]);
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please provide a valid work or personal email address.");
      return;
    }
    if (message.trim().length < 10) {
      setError("Please share at least a sentence about how you plan to use SignBridge.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          organization: organization.trim(),
          topic,
          message: message.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Could not submit your message.");
      }
      setConfirmationId(data.referenceId || "SB-RECEIVED");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setOrganization("");
    setTopic(INQUIRY_TOPICS[0]);
    setMessage("");
    setConfirmationId(null);
    setError(null);
  };

  return (
    <section id="contact" className="bg-[#F0E9FF] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Editorial Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5"
          >
            <p className="text-sm font-semibold text-[#7041B5]">Get in Touch</p>
            <h2 className="mt-2 font-[Poppins] text-3xl font-bold tracking-tight text-[#38205F] [text-wrap:balance] sm:text-4xl">
              Bring SignBridge to{" "}
              <span className="text-gradient-violet">your community or clinic.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#302343]/80">
              Whether you are piloting inclusive front-desk tablets, equipping university study
              spaces, or collaborating on regional sign corpora, our accessibility team responds
              within one business day.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3.5 rounded-2xl border border-[#D8C4FF]/80 bg-white/80 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#9061D8] to-[#7041B5] text-white">
                  <Mail className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-[#7041B5]">Direct accessibility desk</p>
                  <p className="mt-0.5 text-sm font-semibold text-[#38205F]">
                    hello@signbridge.ai
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl border border-[#D8C4FF]/80 bg-white/80 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#9061D8] to-[#7041B5] text-white">
                  <MapPin className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-[#7041B5]">Research studio</p>
                  <p className="mt-0.5 text-sm font-semibold text-[#38205F]">
                    Seattle, WA · Remote-first Deaf &amp; hearing team
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right White Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="rounded-[28px] border border-[#D8C4FF]/85 bg-white p-6 shadow-[0_20px_54px_-22px_rgba(112,65,181,0.22)] sm:p-9 lg:col-span-7"
          >
            {confirmationId ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#9061D8] to-[#7041B5] text-white shadow-md">
                  <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-[Poppins] text-2xl font-bold text-[#38205F]">
                  Message received
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#302343]/80">
                  Thank you, {name}. Our accessibility partnerships team will reach out to{" "}
                  <span className="font-semibold text-[#38205F]">{email}</span> regarding{" "}
                  {topic.toLowerCase()}.
                </p>
                <p className="mt-4 font-mono text-xs text-[#7041B5]">
                  Reference ID: {confirmationId}
                </p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="mt-7 rounded-xl border border-[#D8C4FF] bg-[#F8F5FF] px-5 py-2.5 text-sm font-semibold text-[#38205F] transition-colors hover:bg-[#F0E9FF]"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-semibold text-[#38205F]"
                    >
                      Full name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jordan Rivera"
                      className="mt-2 w-full rounded-xl border border-[#D8C4FF] bg-[#F8F5FF]/70 px-4 py-3 text-sm text-[#302343] placeholder:text-[#302343]/45 focus:border-[#9061D8] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-semibold text-[#38205F]"
                    >
                      Email address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jordan@organization.org"
                      className="mt-2 w-full rounded-xl border border-[#D8C4FF] bg-[#F8F5FF]/70 px-4 py-3 text-sm text-[#302343] placeholder:text-[#302343]/45 focus:border-[#9061D8] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-org"
                      className="block text-sm font-semibold text-[#38205F]"
                    >
                      Organization (optional)
                    </label>
                    <input
                      id="contact-org"
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Clinic, university, or company"
                      className="mt-2 w-full rounded-xl border border-[#D8C4FF] bg-[#F8F5FF]/70 px-4 py-3 text-sm text-[#302343] placeholder:text-[#302343]/45 focus:border-[#9061D8] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-topic"
                      className="block text-sm font-semibold text-[#38205F]"
                    >
                      Inquiry focus
                    </label>
                    <select
                      id="contact-topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-[#D8C4FF] bg-[#F8F5FF]/70 px-4 py-3 text-sm text-[#302343] focus:border-[#9061D8] focus:bg-white focus:outline-none"
                    >
                      {INQUIRY_TOPICS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-semibold text-[#38205F]"
                  >
                    How can SignBridge help?
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your setting, preferred sign dialects, and accessibility goals..."
                    className="mt-2 w-full resize-none rounded-xl border border-[#D8C4FF] bg-[#F8F5FF]/70 px-4 py-3 text-sm leading-relaxed text-[#302343] placeholder:text-[#302343]/45 focus:border-[#9061D8] focus:bg-white focus:outline-none"
                  />
                </div>

                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-xl border border-[#9061D8]/40 bg-[#F0E9FF] p-3.5 text-sm text-[#38205F]"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#7041B5]" aria-hidden="true" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <p className="text-xs text-[#302343]/70">
                    ASL video consultations available upon request.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gradient-primary inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white disabled:opacity-65 whitespace-nowrap shrink-0"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Request Consultation</span>
                        <Send className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
