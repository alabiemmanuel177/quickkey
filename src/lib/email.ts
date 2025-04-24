import nodemailer from 'nodemailer';

// Create email transporter
// For development, we're using a test account
// In production, you should use a real SMTP service
export const createTransporter = async () => {
  // For development/testing - create a test account
  // In production, replace with your actual SMTP configuration
  const testAccount = await nodemailer.createTestAccount();
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || testAccount.smtp.host,
    port: parseInt(process.env.SMTP_PORT || testAccount.smtp.port.toString()),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || testAccount.user,
      pass: process.env.SMTP_PASSWORD || testAccount.pass,
    },
  });
  
  return { transporter, testAccount };
};

// Send welcome email to new users
export async function sendWelcomeEmail(to: string, name: string) {
  const { transporter, testAccount } = await createTransporter();
  
  const info = await transporter.sendMail({
    from: `"QuickKey" <${process.env.EMAIL_FROM || 'noreply@quickkey.app'}>`,
    to,
    subject: "Welcome to QuickKey!",
    text: `Hi ${name},\n\nWelcome to QuickKey! We're excited to have you join our typing community.\n\nStart typing now and improve your skills!\n\nBest regards,\nThe QuickKey Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Welcome to QuickKey!</h2>
        <p>Hi ${name},</p>
        <p>Welcome to QuickKey! We're excited to have you join our typing community.</p>
        <p>Here's what you can do:</p>
        <ul>
          <li>Take typing tests to measure your speed and accuracy</li>
          <li>Track your progress over time</li>
          <li>Compete on our leaderboards</li>
          <li>Improve your typing skills with regular practice</li>
        </ul>
        <div style="margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" 
             style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Start Typing Now
          </a>
        </div>
        <p>Best regards,<br>The QuickKey Team</p>
      </div>
    `,
  });
  
  // For development, log the test URL
  if (testAccount) {
    console.log('Welcome email sent! Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
  
  return info;
}

// Send a leaderboard achievement email
export async function sendLeaderboardEmail(to: string, name: string, position: number, wpm: number) {
  const { transporter, testAccount } = await createTransporter();
  
  const info = await transporter.sendMail({
    from: `"QuickKey" <${process.env.EMAIL_FROM || 'noreply@quickkey.app'}>`,
    to,
    subject: "You're on the QuickKey Leaderboard!",
    text: `Hi ${name},\n\nCongratulations! You've made it to position #${position} on the QuickKey leaderboard with an impressive ${wpm} WPM.\n\nKeep up the great typing!\n\nBest regards,\nThe QuickKey Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">You're on the Leaderboard!</h2>
        <p>Hi ${name},</p>
        <p><strong>Congratulations!</strong> 🎉</p>
        <p>You've made it to position <strong>#${position}</strong> on the QuickKey leaderboard with an impressive <strong>${wpm} WPM</strong>.</p>
        
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="font-size: 18px; margin: 0; text-align: center;">
            Position: <strong style="color: #3b82f6;">#${position}</strong> | 
            Speed: <strong style="color: #10b981;">${wpm} WPM</strong>
          </p>
        </div>
        
        <p>Keep practicing to maintain or improve your position!</p>
        
        <div style="margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/leaderboard" 
             style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Leaderboard
          </a>
        </div>
        
        <p>Best regards,<br>The QuickKey Team</p>
      </div>
    `,
  });
  
  // For development, log the test URL
  if (testAccount) {
    console.log('Leaderboard email sent! Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
  
  return info;
}

// Send a login notification email
export async function sendLoginEmail(to: string, name: string, time: string, browser: string, os: string) {
  const { transporter, testAccount } = await createTransporter();
  
  const info = await transporter.sendMail({
    from: `"QuickKey Security" <${process.env.EMAIL_FROM || 'security@quickkey.app'}>`,
    to,
    subject: "New Login to Your QuickKey Account",
    text: `Hi ${name},\n\nWe detected a new login to your QuickKey account.\n\nTime: ${time}\nBrowser: ${browser}\nOS: ${os}\n\nIf this was you, you can ignore this email. If you didn't log in, please secure your account immediately.\n\nBest regards,\nThe QuickKey Security Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">New Login to Your Account</h2>
        <p>Hi ${name},</p>
        <p>We detected a new login to your QuickKey account.</p>
        
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Browser:</strong> ${browser}</p>
          <p><strong>OS:</strong> ${os}</p>
        </div>
        
        <p>If this was you, you can ignore this email. If you didn't log in, please secure your account immediately.</p>
        
        <div style="margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings" 
             style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Account Settings
          </a>
        </div>
        
        <p>Best regards,<br>The QuickKey Security Team</p>
      </div>
    `,
  });
  
  // For development, log the test URL
  if (testAccount) {
    console.log('Login email sent! Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
  
  return info;
} 