import React, { useState } from 'react';
import type { Lang } from '@src/i18n/index';
import { useContentTranslations } from '@src/i18n/translations';
import type { TranslationKey } from '@src/i18n/translations';
import Input from './atoms/Input';

const MAX_LENGTHS = {
  name: 100,
  email: 254, // RFC 5322
  subject: 200,
  message: 5000
};

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface FormspreeError {
  field: string;
  message: string;
}

interface FormspreeErrorResponse {
  errors?: FormspreeError[];
}

interface ContactFormProps {
  lang?: Lang;
}

type SubmitStatus = 'success' | 'error' | 'cooldown';

const STATUS_STYLES: Record<SubmitStatus, { rail: string; text: string; bg: string; dot: string }> = {
  success: { rail: 'border-t-magi-support', text: 'text-magi-support', bg: 'bg-magi-support/10', dot: 'bg-magi-support' },
  error: { rail: 'border-t-magi-danger', text: 'text-magi-danger', bg: 'bg-magi-danger/10', dot: 'bg-magi-danger' },
  cooldown: { rail: 'border-t-magi-violet', text: 'text-magi-violet', bg: 'bg-magi-violet/10', dot: 'bg-magi-violet' },
};

const STATUS_LABEL: Record<Lang, Record<SubmitStatus, string>> = {
  es: { success: 'TRANSMISIÓN RECIBIDA', error: 'FALLO DE TRANSMISIÓN', cooldown: 'EN ESPERA' },
  en: { success: 'TRANSMISSION RECEIVED', error: 'TRANSMISSION FAILED', cooldown: 'STANDING BY' },
};

export default function ContactForm({ lang = 'es' }: ContactFormProps) {
  const t = useContentTranslations(lang);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Type out the status message like a terminal readout
  React.useEffect(() => {
    if (!submitMessage) {
      setDisplayedMessage('');
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setDisplayedMessage(submitMessage);
      return;
    }
    const chars = Array.from(submitMessage);
    setDisplayedMessage('');
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedMessage(chars.slice(0, i).join(''));
      if (i >= chars.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [submitMessage]);

  const COOLDOWN_MS = 60000; // 1 minute
  const STORAGE_KEY = 'lastContactSubmit';

  // Helper to replace placeholders in translation strings
  const tr = (key: TranslationKey, params?: Record<string, string | number>): string => {
    let text = t(key);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replaceAll(`{${k}}`, String(v));
      });
    }
    return text;
  };

  // Check rate limit on mount and set up countdown timer
  React.useEffect(() => {
    const checkRateLimit = () => {
      const lastSubmit = localStorage.getItem(STORAGE_KEY);
      if (lastSubmit) {
        const timeSince = Date.now() - parseInt(lastSubmit, 10);
        if (timeSince < COOLDOWN_MS) {
          const remainingSeconds = Math.ceil((COOLDOWN_MS - timeSince) / 1000);
          setCooldownSeconds(remainingSeconds);
          return;
        }
      }
      setCooldownSeconds(0);
    };

    checkRateLimit();

    // Update countdown every second
    const interval = setInterval(() => {
      setCooldownSeconds(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = tr('contactForm.error.nameRequired');
    } else if (formData.name.trim().length > MAX_LENGTHS.name) {
      newErrors.name = tr('contactForm.error.nameMaxLength', { max: MAX_LENGTHS.name });
    }
    
    if (!formData.email.trim()) {
      newErrors.email = tr('contactForm.error.emailRequired');
    } else if (formData.email.trim().length > MAX_LENGTHS.email) {
      newErrors.email = tr('contactForm.error.emailMaxLength', { max: MAX_LENGTHS.email });
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = tr('contactForm.error.emailInvalid');
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = tr('contactForm.error.subjectRequired');
    } else if (formData.subject.trim().length > MAX_LENGTHS.subject) {
      newErrors.subject = tr('contactForm.error.subjectMaxLength', { max: MAX_LENGTHS.subject });
    }
    
    if (!formData.message.trim()) {
      newErrors.message = tr('contactForm.error.messageRequired');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = tr('contactForm.error.messageMinLength', { min: 10 });
    } else if (formData.message.trim().length > MAX_LENGTHS.message) {
      newErrors.message = tr('contactForm.error.messageMaxLength', { max: MAX_LENGTHS.message });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limit
    if (cooldownSeconds > 0) {
      setSubmitStatus('cooldown');
      setSubmitMessage(tr('contactForm.message.cooldown', { seconds: cooldownSeconds }));
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('https://formspree.io/f/mrbyjjoq', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (response.ok) {
        // Set rate limit
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
        setCooldownSeconds(Math.ceil(COOLDOWN_MS / 1000));

        setSubmitStatus('success');
        setSubmitMessage(tr('contactForm.message.success'));
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        // Try to get error details from Formspree response
        const errorData: FormspreeErrorResponse = await response.json().catch(() => ({ errors: [] }));
        
        // Map Formspree field errors if available
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const newErrors: FormErrors = {};
          errorData.errors.forEach((error: FormspreeError) => {
            if (error.field && error.message) {
              newErrors[error.field as keyof FormErrors] = error.message;
            }
          });
          if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
          }
        }
        
        setSubmitStatus('error');
        setSubmitMessage(tr('contactForm.message.error'));
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(tr('contactForm.message.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {submitStatus !== 'success' && (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="name"
            name="name"
            label={tr('contactForm.label.name')}
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            maxLength={MAX_LENGTHS.name}
            placeholder={tr('contactForm.placeholder.name')}
          />
          <Input
            id="email"
            name="email"
            type="email"
            label={tr('contactForm.label.email')}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            maxLength={MAX_LENGTHS.email}
            placeholder={tr('contactForm.placeholder.email')}
          />
        </div>

        <Input
          id="subject"
          name="subject"
          label={tr('contactForm.label.subject')}
          value={formData.subject}
          onChange={handleChange}
          error={errors.subject}
          maxLength={MAX_LENGTHS.subject}
          placeholder={tr('contactForm.placeholder.subject')}
        />

        <Input
          as="textarea"
          id="message"
          name="message"
          label={tr('contactForm.label.message')}
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
          maxLength={MAX_LENGTHS.message}
          placeholder={tr('contactForm.placeholder.message')}
          showCounter
        />

        <div>
          <button
            type="submit"
            disabled={isSubmitting || cooldownSeconds > 0}
            className="corner-cut w-full bg-magi-accent hover:brightness-110 hover:shadow-[0_0_20px_-4px_var(--magi-accent)] disabled:opacity-50 disabled:hover:shadow-none text-magi-accent-ink font-mono font-semibold uppercase tracking-wider py-3 px-6 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-magi-accent focus:ring-offset-2 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {tr('contactForm.button.submitting')}
              </span>
            ) : cooldownSeconds > 0 ? (
              tr('contactForm.button.cooldown', { seconds: cooldownSeconds })
            ) : (
              tr('contactForm.button.submit')
            )}
          </button>
        </div>
        </>
        )}

        {submitMessage && submitStatus && (
          <div
            key={submitMessage}
            className={`transmit-in corner-mark border border-magi-line border-t-2 ${STATUS_STYLES[submitStatus].rail} ${STATUS_STYLES[submitStatus].bg} p-4`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`inline-block w-2 h-2 shrink-0 animate-pulse ${STATUS_STYLES[submitStatus].dot}`} />
              <span className={`font-mono text-xs uppercase tracking-wider ${STATUS_STYLES[submitStatus].text}`}>
                {STATUS_LABEL[lang][submitStatus]}
              </span>
            </div>
            <p className={`typewriter-cursor font-mono text-sm ${STATUS_STYLES[submitStatus].text}`}>
              {displayedMessage}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}