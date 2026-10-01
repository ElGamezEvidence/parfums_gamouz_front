/**
 * Contact Service
 * Simulates communication with backend mailer or CRM.
 */

export const contactService = {
  async sendMessage(contactData) {
    // Simulate network delay
    await new Promise((res) => setTimeout(res, 600));

    // Basic validation
    if (!contactData.name || !contactData.email || !contactData.message) {
      throw new Error('Required fields missing');
    }

    return {
      success: true,
      message: 'Message sent successfully',
      timestamp: new Date().toISOString(),
    };
  },

  async subscribeNewsletter(email) {
    await new Promise((res) => setTimeout(res, 500));
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email');
    }

    if (typeof window !== 'undefined') {
      try {
        const list = JSON.parse(localStorage.getItem('gamouze_subscribers') || '[]');
        if (!list.includes(email)) {
          list.push(email);
          localStorage.setItem('gamouze_subscribers', JSON.stringify(list));
        }
      } catch (e) {
        console.error('Error saving subscriber', e);
      }
    }

    return {
      success: true,
      message: 'Subscription successful',
    };
  }
};

