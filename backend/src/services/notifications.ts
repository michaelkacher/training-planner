import dotenv from 'dotenv';

dotenv.config();

const isDevelopment = process.env.NODE_ENV !== 'production';
const mockNotifications = process.env.MOCK_NOTIFICATIONS === 'true';

interface EmailNotification {
  to: string;
  subject: string;
  body: string;
}

interface SMSNotification {
  to: string;
  message: string;
}

export class NotificationService {
  private twilioClient: any;

  constructor() {
    // Only initialize Twilio in production or when not mocking
    if (!mockNotifications && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        // Dynamic import to avoid issues if Twilio is not configured
        import('twilio').then(({ default: twilio }) => {
          this.twilioClient = twilio(
            process.env.TWILIO_ACCOUNT_SID!,
            process.env.TWILIO_AUTH_TOKEN!
          );
        });
      } catch (error) {
        console.warn('⚠️  Twilio not configured properly. SMS notifications will be mocked.');
      }
    }
  }

  async sendEmail(notification: EmailNotification): Promise<void> {
    if (mockNotifications || isDevelopment) {
      console.log('📧 [MOCK EMAIL]', {
        to: notification.to,
        subject: notification.subject,
        body: notification.body,
        timestamp: new Date().toISOString()
      });
      return;
    }

    // TODO: Implement actual email sending (e.g., using SendGrid, AWS SES, etc.)
    console.log('📧 Sending email to:', notification.to);
  }

  async sendSMS(notification: SMSNotification): Promise<void> {
    if (mockNotifications || isDevelopment) {
      console.log('📱 [MOCK SMS]', {
        to: notification.to,
        message: notification.message,
        timestamp: new Date().toISOString()
      });
      return;
    }

    if (!this.twilioClient) {
      throw new Error('Twilio client not initialized');
    }

    try {
      await this.twilioClient.messages.create({
        body: notification.message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: notification.to
      });
      console.log('📱 SMS sent to:', notification.to);
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }

  async sendWorkoutReminder(
    athleteName: string,
    workoutType: string,
    scheduledTime: string,
    contactMethod: 'email' | 'sms',
    contact: string
  ): Promise<void> {
    const message = `Hi ${athleteName}! Reminder: You have a ${workoutType} workout scheduled in 1 hour at ${scheduledTime}. Get ready to train! 🏐`;

    if (contactMethod === 'email') {
      await this.sendEmail({
        to: contact,
        subject: `Workout Reminder: ${workoutType}`,
        body: message
      });
    } else {
      await this.sendSMS({
        to: contact,
        message
      });
    }
  }
}

export const notificationService = new NotificationService();
