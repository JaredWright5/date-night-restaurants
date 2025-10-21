import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const newsletter = formData.get('newsletter') as string;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create email content
    const emailContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject}
Newsletter: ${newsletter ? 'Yes' : 'No'}

Message:
${message}

---
Sent from Date Night Restaurants contact form
    `.trim();

    // For now, we'll just log the submission
    // In production, you would integrate with an email service like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Nodemailer with SMTP
    
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      subject,
      message,
      newsletter: newsletter === 'on'
    });

    // TODO: Replace this with actual email sending
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: 'jaredwright2718@gmail.com',
      from: 'noreply@datenightrestaurants.com',
      subject: `Contact Form: ${subject}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>')
    };
    
    await sgMail.send(msg);
    */

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
