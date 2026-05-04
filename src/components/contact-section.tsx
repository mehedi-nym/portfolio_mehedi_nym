"use client";

import { useState } from "react";
import { Send, CheckCircle2, ArrowRight } from "lucide-react"; // Added icons
import { FadeIn } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { submitContactMessage } from "@/lib/supabase-client";
import type { ContactLink } from "@/lib/portfolio-data";
import { AnimatePresence, motion } from "framer-motion"; // Added for smooth state switching

type Props = {
  contactLinks: ContactLink[];
};

export function ContactSection({ contactLinks }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false); // Track completion state
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setErrorMsg("");

    if (!form.name || !form.email || !form.message) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      await submitContactMessage({ ...form });

      // Trigger the "Success" state
      setIsSent(true);
      
      // Reset form fields behind the scenes
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-shell py-24">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Left Column - Contact Links */}
        <div className="section-card p-8 sm:p-10">
          <SectionHeading
            eyebrow="Contact"
            title="Let’s connect around product delivery, systems and travel-tech execution."
            description="Available for collaboration, technical coordination roles, and conversations around systems."
          />

          <div className="mt-8 grid gap-4">
            {contactLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="rounded-[1.5rem] border border-line/80 bg-surface/80 p-5 hover:-translate-y-0.5 hover:border-accent/40 transition-all"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted">
                  {item.label}
                </p>
                <p className="group relative mt-2 w-fit text-base font-semibold text-fg">
                  {item.value}
                  <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-current transition-all duration-300 group-hover:w-full"></span>
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Right Column - Form with Dynamic State */}
        <FadeIn delay={0.08} className="section-card overflow-hidden p-8 sm:p-10">
          <AnimatePresence mode="wait">
            {!isSent ? (
              // FORM STATE
              <motion.div
                key="contact-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <SectionHeading
            eyebrow="Send a message"
            title="Let’s discuss"
            description="how I can help with your systems, product delivery, or travel-tech execution."
          />
                  </div>
                  <Send className={`text-accent ${loading ? "animate-pulse" : ""}`} />
                </div>

                <form
                  className="mt-8 grid gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm text-muted">
                      Name
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="rounded-2xl border border-line bg-surface px-4 py-3 text-fg outline-none transition focus:border-accent"
                      />
                    </label>

                    <label className="grid gap-2 text-sm text-muted">
                      Email
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="rounded-2xl border border-line bg-surface px-4 py-3 text-fg outline-none transition focus:border-accent"
                      />
                    </label>
                  </div>

                  <label className="grid gap-2 text-sm text-muted">
                    Subject
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Project, role, or collaboration topic"
                      className="rounded-2xl border border-line bg-surface px-4 py-3 text-fg outline-none transition focus:border-accent"
                    />
                  </label>

                  <label className="grid gap-2 text-sm text-muted">
                    Message
                    <textarea
                      rows={6}
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Share a quick overview..."
                      className="rounded-[1.5rem] border border-line bg-surface px-4 py-3 text-fg outline-none transition focus:border-accent"
                    />
                  </label>

                  {errorMsg && (
                    <motion.p 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="text-sm text-red-500 font-medium"
                    >
                      {errorMsg}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-accent disabled:opacity-60 dark:bg-white dark:text-ink"
                  >
                    {loading ? "Transmitting..." : "Send Inquiry"}
                  </button>
                </form>
              </motion.div>
            ) : (
              // SUCCESS STATE
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex h-full min-h-[400px] flex-col items-center justify-center text-center"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-fg">Inquiry Dispatched</h3>
                <p className="mt-4 max-w-[280px] text-muted leading-relaxed">
                  The data has been routed successfully. I’ll review your systems and get back to you shortly.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="group mt-10 flex items-center gap-2 text-sm font-semibold text-accent"
                >
                  Send another message
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </FadeIn>
      </div>
    </section>
  );
}