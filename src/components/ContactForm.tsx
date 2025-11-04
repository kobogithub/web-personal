import React, { useState } from 'react';

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

// Email validation constants
// RFC 5322-compliant regex pattern for email validation
// Validates: local-part@domain structure with allowed special characters
// Rejects: missing parts, consecutive dots, invalid characters, spaces
const EMAIL_VALIDATION_REGEX = /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// Maximum email length as per RFC 5322
const MAX_EMAIL_LENGTH = 254;

export default function ContactForm() {
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
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!EMAIL_VALIDATION_REGEX.test(formData.email) || formData.email.length > MAX_EMAIL_LENGTH) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'El asunto es requerido';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
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
      setSubmitMessage(`Por favor espera ${cooldownSeconds} segundos antes de enviar otro mensaje.`);
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
        
        setSubmitMessage('¡Gracias por tu mensaje! Te responderé pronto.');
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
        
        setSubmitMessage('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      setSubmitMessage('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
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
              Nombre *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white ${
                errors.name 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-zinc-600 focus:border-blue-500'
              }`}
              placeholder="Tu nombre"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-zinc-600 focus:border-blue-500'
              }`}
              placeholder="tu@email.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Asunto *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white ${
              errors.subject 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-zinc-600 focus:border-blue-500'
            }`}
            placeholder="¿De qué quieres hablar?"
          />
          {errors.subject && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mensaje *
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical dark:bg-zinc-800 dark:border-zinc-600 dark:text-white ${
              errors.message 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-zinc-600 focus:border-blue-500'
            }`}
            placeholder="Escribe tu mensaje aquí..."
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
                Enviando...
              </span>
            ) : cooldownSeconds > 0 ? (
              `Espera ${cooldownSeconds} segundos...`
            ) : (
              'Enviar Mensaje'
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