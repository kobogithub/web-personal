import React, { useState } from 'react';
import type { Lang } from '@src/i18n/index';
import { useContentTranslations } from '@src/i18n/translations';
import type { TranslationKey } from '@src/i18n/translations';

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
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const COOLDOWN_MS = 60000; // 1 minute
  const STORAGE_KEY = 'lastContactSubmit';

  // Helper to replace placeholders in translation strings
  const tr = (key: TranslationKey, params?: Record<string, string | number>): string => {
    let text = t(key);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
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
        
        setSubmitMessage(tr('contactForm.message.error'));
      }
    } catch (error) {
      setSubmitMessage(tr('contactForm.message.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {tr('contactForm.label.name')} *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={MAX_LENGTHS.name}
              className={`w-full px-4 py-3 rounded-lg border transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white ${
                errors.name 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-zinc-600 focus:border-blue-500'
              }`}
              placeholder={tr('contactForm.placeholder.name')}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {tr('contactForm.label.email')} *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              maxLength={MAX_LENGTHS.email}
              className={`w-full px-4 py-3 rounded-lg border transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-zinc-600 focus:border-blue-500'
              }`}
              placeholder={tr('contactForm.placeholder.email')}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {tr('contactForm.label.subject')} *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            maxLength={MAX_LENGTHS.subject}
            className={`w-full px-4 py-3 rounded-lg border transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white ${
              errors.subject 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-zinc-600 focus:border-blue-500'
            }`}
            placeholder={tr('contactForm.placeholder.subject')}
          />
          {errors.subject && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {tr('contactForm.label.message')} *
            </label>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formData.message.length}/{MAX_LENGTHS.message}
            </span>
          </div>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            maxLength={MAX_LENGTHS.message}
            className={`w-full px-4 py-3 rounded-lg border transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical dark:bg-zinc-800 dark:border-zinc-600 dark:text-white ${
              errors.message 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-zinc-600 focus:border-blue-500'
            }`}
            placeholder={tr('contactForm.placeholder.message')}
          />
          {errors.message && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting || cooldownSeconds > 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

        {submitMessage && (
          <div className={`p-4 rounded-lg ${
            submitMessage.includes('espera')
              ? 'bg-yellow-50 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
              : submitMessage.includes('error') || submitMessage.includes('Hubo un error')
              ? 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
              : 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
          }`}>
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  );
}