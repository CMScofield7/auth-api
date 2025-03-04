import { Test } from '@nestjs/testing';
import { MailService } from '../mail.service';
import * as nodemailer from 'nodemailer';

describe('MailService', () => {
  let mailService: MailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    mailService = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined and should create transporter on constructor', () => {
    expect(mailService).toBeDefined();
    expect(mailService['transporter']).toBeDefined();
    expect(mailService['transporter'].sendMail).toBeDefined();
  });

  it('should throw an error when constructor fails', () => {
    jest.spyOn(nodemailer, 'createTransport').mockImplementation(() => {
      throw new Error('Failed to create transporter');
    });

    expect(() => new MailService()).toThrow('Failed to create transporter');
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email', async () => {
      const sendMail = jest
        .spyOn(mailService['transporter'], 'sendMail')
        .mockResolvedValue({});

      const result = await mailService.sendPasswordResetEmail(
        'test@user.com',
        'token',
      );

      expect(sendMail).toHaveBeenCalledWith({
        from: 'Auth API',
        to: 'test@user.com',
        subject: 'Password Reset',
        html: '<p>Click <a href="http://teste.com/reset-password?token=token">here</a> to reset your password.</p>',
      });
      expect(result).toBeUndefined();
    });

    it('should throw an error when sending email fails', async () => {
      jest
        .spyOn(mailService['transporter'], 'sendMail')
        .mockRejectedValue(new Error('Failed to send email'));

      await expect(
        mailService.sendPasswordResetEmail('test@user.com', 'token'),
      ).rejects.toThrow('Failed to send email');
    });
  });
});
