import emailjs from '@emailjs/browser';

export const sendWelcomeEmail = async (name, email, role) => {
  try {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey || serviceId === 'service_placeholder') {
      console.warn('EmailJS credentials are not configured. Skipping welcome email.');
      return;
    }

    const templateParams = {
      to_name: name,
      to_email: email,
      user_role: role,
      message: 'Thank you for joining RentWheels! We are excited to have you on board.',
    };

    await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Failed to send welcome email', error);
  }
};

export const sendBookingEmail = async (name, email, subject, message) => {
  try {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey || serviceId === 'service_placeholder') {
      console.warn('EmailJS credentials are not configured. Skipping booking email.');
      return;
    }

    const templateParams = {
      to_name: name,
      to_email: email,
      subject: subject,
      message: message,
    };

    await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log('Booking email sent successfully');
  } catch (error) {
    console.error('Failed to send booking email', error);
  }
};
