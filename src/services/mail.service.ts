import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter =
      nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: 'sharon.zieme7@ethereal.email',
          pass: 'HNVhWbEaC8EPHbej11',
        },
      }) ??
      (() => {
        throw new Error('Failed to create transporter');
      });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `http://teste.com/reset-password?token=${token}`;

    const mailOptions = {
      from: 'Auth API',
      to,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
