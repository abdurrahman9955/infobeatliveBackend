// src/controllers/classPricingController.ts
import { Request, Response } from "express";
import ClassVerifyService from "./create";
import { DatabaseSync } from "node:sqlite";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!); 


async function sendResendOtp(email: string): Promise<void> {
  try {
    await resend.emails.send({
      from: 'noreply@infobeatlive.com',
      to: email,
      subject:"we just receive your verification details",
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
        <h1>Thanks for sending your verification details</h1>
      </div>
      <div class="body">
        <p>Hi there,</p>

        <p>We’ve received your details and want to thank you for getting in touch with us.</p>

        <p> our verification team  will review your details and respond to you as soon as possible.</p>

        <p>We aim to get back to you  within <strong> 7 days </strong> (often much sooner).</p>

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

  } catch (error) {
    console.error('Resend email error:', error);
    throw new Error('Failed to send OTP via Resend');
  }
}

export default class ClassVerifyController {

  static async create(req: Request, res: Response) {
    try {
      const { 
        country,        
        state,          
        email,            
        fullName,           
        linkedinProfile,  
        phoneNumber,         
        aboutYourSelf,   
        howToRunClass,    
        personalBrand,     
        description,      
        why,  
      } = req.body;

      const { userId, bootcampId, } = req.params;

      const classPricing = await ClassVerifyService.createVerifyClass({
        userId,
        bootcampId,
        country,        
        state,          
        email,            
        fullName,           
        linkedinProfile,  
        phoneNumber,         
        aboutYourSelf,   
        howToRunClass,    
        personalBrand,     
        description,      
        why,  
      });

      await sendResendOtp(email);
      res.status(201).json(classPricing);
    } catch (error) {
      console.error("Error creating Payout:", error); // ✅ Log full error
      res.status(500).json({ error: "Failed to create class pricing" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { 
        userId, 
        bootcampId,
        isVerified,        
        verify,
        subject, 
        title, 
        reason,
        description, 
        conclusion,                
      } = req.body;

      const classPricing = await ClassVerifyService.updateVerifyClass({
        userId,
        bootcampId,
        isVerified,        
        verify, 
        subject, 
        title, 
        reason,
        description, 
        conclusion,               
      });

      res.status(201).json(classPricing);
    } catch (error) {
      console.error("Error creating Payout:", error); // ✅ Log full error
      res.status(500).json({ error: "Failed to create class pricing" });
    }
  }


  
  static async getAll(req: Request, res: Response) {
    try {

      const classPricings = await ClassVerifyService.getAllVerifyClass();
      res.json(classPricings);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve class pricings" });
    }
  }

  static async getAllVerifyByClassId(req: Request, res: Response) {
    try {
        
      const { bootcampId } = req.params;

      const classPricings = await ClassVerifyService.getClassVerifyClassId(bootcampId);
      res.json(classPricings);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve class pricings" });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const classPricing = await ClassVerifyService.getVerifyClass(id);
      if (!classPricing) return res.status(404).json({ error: "Not found" });

      res.json(classPricing);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve class pricing" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ClassVerifyService.deleteVerifyClass(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Failed to delete class pricing" });
    }
  }
}
