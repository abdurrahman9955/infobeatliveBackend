// src/controllers/classContactController.ts
import { Request, Response, NextFunction } from 'express';
import { ClassContactService } from './createContact';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!); 


async function sendResendOtp(email: string, subject: any): Promise<void> {
  try {
    await resend.emails.send({
      from: 'support@infobeatlive.com',
      to: email,
      subject: subject,
      html: `
       <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Thank You for Reaching Out</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      .container {
        background-color: #ffffff;
        max-width: 600px;
        margin: 30px auto;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 0 10px rgba(0,0,0,0.05);
      }
      .header {
        background-color: #599334;
        color: #ffffff;
        padding: 30px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .body {
        padding: 30px;
        color: #333333;
        line-height: 1.6;
      }
      .footer {
        background-color: #f1f1f1;
        text-align: center;
        padding: 15px;
        font-size: 13px;
        color: #888;
      }
      .button {
        display: inline-block;
        margin-top: 20px;
        background-color: #599334;
        color: #ffffff !important;
        padding: 12px 25px;
        text-decoration: none;
        border-radius: 5px;
      }
      .signature {
        margin-top: 25px;
        font-style: italic;
        color: #555;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Thank You for Contacting Infobeatlive</h1>
      </div>
      <div class="body">
        <p>Hi there,</p>

        <p>We’ve received your message and want to thank you for getting in touch with us.</p>

        <p>One of our support team members will review your inquiry and respond to you as soon as possible.</p>

        <p>We aim to get back to all inquiries within <strong>24 hours</strong> (often much sooner).</p>

        <p>In the meantime, feel free to explore our platform and learn more about how Infobeatlive helps
             students and instructors grow through smart and powerful e-learning solutions.</p>

        <a href="https://www.infobeatlive.com" class="button">Visit Our Website</a>

        <p class="signature">Warm regards,<br />
        The Infobeatlive Team</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Infobeatlive. All rights reserved.<br/>
        <a href="https://www.infobeatlive.com">infobeatlive</a>
      </div>
    </div>
  </body>
  </html>`,});

    console.log(`Resend: OTP email sent to ${email}`);
  } catch (error) {
    console.error('Resend email error:', error);
    throw new Error('Failed to send OTP via Resend');
  }
}

const contactService = new ClassContactService();

export class ClassContactController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
     
      const contacts = await contactService.getAllContacts();
      res.status(200).json(contacts);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {

      const { id } = req.params
    
      const contact = await contactService.getContactById(id);
      if (!contact) return res.status(404).json({ message: 'Contact not found' });
      res.status(200).json(contact);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {

      const contactData = req.body; // Ensure req.body contains name, email, reason, and statement
 
      const newContact = await contactService.createContact(contactData);
      await sendResendOtp(contactData.email, contactData.reason );
      res.status(201).json(newContact);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {

      const id = req.params.id

      const updatedContact = await contactService.updateContact(id, req.body);
      res.status(200).json(updatedContact);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {

      const id = req.params.id

      await contactService.deleteContact(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}


export default new ClassContactController();