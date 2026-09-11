import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Check,
  AlertCircle,
  Mail,
  MapPin,
  Clock,
  Loader,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import emailjs from '@emailjs/browser';
import Footer from "../components/common/Footer";

const emailJsUserId = import.meta.env.VITE_EMAIL_JS_USER_ID;
const EmailjsServiceId = import.meta.env.VITE_EMAIL_JS_SERVICE_ID;
const EmailjsTemplateId = import.meta.env.VITE_EMAIL_JS_TEMPLATE_ID;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    emailjs.init(emailJsUserId);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const params = {
      from_name: formData.name,
      to_name: "PalsAnalytix",
      message: formData.message,
      from_email: formData.email,
      subject: formData.subject,
    };

    try {
      emailjs.init(emailJsUserId);

      const response = await emailjs.send(
        EmailjsServiceId,
        EmailjsTemplateId,
        params
      );

      setSubmitStatus("success");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-accent-orange2 mb-2">
            Get in touch
          </div>
          <h1 className="font-sora text-4xl font-bold text-charcoal tracking-tight sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-sand-900">
            Have questions about our platform? Get in touch with the
            PalsAnalytix team.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-sand-200 overflow-hidden">
          <div className="grid md:grid-cols-5">
            <div className="bg-ink text-paper p-8 md:p-12 md:col-span-2">
              <h2 className="font-sora text-2xl font-bold mb-6">Get in Touch</h2>
              <p className="mb-8 text-sand-400">
                We're here to help you succeed in your certification journey.
                Feel free to reach out with any questions about our platform.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Mail className="h-6 w-6 text-accent-orange2" />
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium">Email</p>
                    <p className="mt-1 text-sand-400">
                      palsanalytix.dev@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <MapPin className="h-6 w-6 text-accent-orange2" />
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium">Location</p>
                    <p className="mt-1 text-sand-400">
                      Virtual platform serving students worldwide
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Clock className="h-6 w-6 text-accent-orange2" />
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium">Support Hours</p>
                    <p className="mt-1 text-sand-400">
                      Monday - Friday: 9AM - 6PM EST
                    </p>
                    <p className="text-sand-400">Weekend: 10AM - 2PM EST</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="font-sora text-xl font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://www.facebook.com/people/PalsAnalytix/61553394107606/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="PalsAnalytix on Facebook"
                    className="bg-white/10 border border-line-light p-3 rounded-full hover:bg-accent-orange2 hover:text-charcoal transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/palsanalytix/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="PalsAnalytix on Instagram"
                    className="bg-white/10 border border-line-light p-3 rounded-full hover:bg-accent-orange2 hover:text-charcoal transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/palsanalytix-043732248/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="PalsAnalytix on LinkedIn"
                    className="bg-white/10 border border-line-light p-3 rounded-full hover:bg-accent-orange2 hover:text-charcoal transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href="https://youtube.com/@palsanalytix-l4h?si=98AaqvDWjrQNjXYF"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="PalsAnalytix on YouTube"
                    className="bg-white/10 border border-line-light p-3 rounded-full hover:bg-accent-orange2 hover:text-charcoal transition-colors"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12 md:col-span-3">
              <h2 className="font-sora text-2xl font-bold text-charcoal mb-6">
                Send Us a Message
              </h2>

              {submitStatus === "success" && (
                <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                  <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Message sent successfully!
                    </h3>
                    <p className="mt-1 text-sm text-green-700">
                      Thank you for contacting us. We'll get back to you shortly.
                    </p>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error sending message
                    </h3>
                    <p className="mt-1 text-sm text-red-700">
                      There was a problem sending your message. Please try again later.
                    </p>
                  </div>
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wide text-sand-800">
                      Full Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`block w-full rounded py-3 px-4 border bg-transparent text-charcoal ${
                          errors.name
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-sand-300 focus:border-accent-orange2 focus:ring-accent-orange2"
                        } focus:outline-none focus:ring-1`}
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wide text-sand-800">
                      Email Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full rounded py-3 px-4 border bg-transparent text-charcoal ${
                          errors.email
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-sand-300 focus:border-accent-orange2 focus:ring-accent-orange2"
                        } focus:outline-none focus:ring-1`}
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-mono uppercase tracking-wide text-sand-800">
                    Subject
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`block w-full rounded py-3 px-4 border bg-transparent text-charcoal ${
                        errors.subject
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-sand-300 focus:border-accent-orange2 focus:ring-accent-orange2"
                      } focus:outline-none focus:ring-1`}
                    />
                    {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wide text-sand-800">
                    Message
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className={`block w-full rounded py-3 px-4 border bg-transparent text-charcoal ${
                        errors.message
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-sand-300 focus:border-accent-orange2 focus:ring-accent-orange2"
                      } focus:outline-none focus:ring-1`}
                    ></textarea>
                    {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex justify-center items-center px-6 py-3 rounded-[3px] text-base font-semibold text-charcoal bg-brand-gradient-alt hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="-ml-1 mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
      <Footer/>
    </div>
  );
};

export default ContactPage;
