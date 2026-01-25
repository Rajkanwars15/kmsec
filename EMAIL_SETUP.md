# Email Setup Instructions

The contact form is configured to send emails to `ceo.kmsa@gmail.com`. Currently, it uses a mailto fallback, but for better user experience, you should set up one of the following:

## Option 1: EmailJS (Recommended for Static Sites)

1. Sign up for a free account at https://www.emailjs.com/
2. Create an email service (Gmail recommended)
3. Create an email template with these variables:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{phone}}` - Phone number
   - `{{company}}` - Company name
   - `{{message}}` - Message content
4. Set the "To Email" field in the template to: `ceo.kmsa@gmail.com`
5. Get your Service ID and Template ID from EmailJS dashboard
6. Add these to `js/app.js` by uncommenting and updating:
   ```javascript
   window.EMAILJS_SERVICE_ID = 'your_service_id';
   window.EMAILJS_TEMPLATE_ID = 'your_template_id';
   ```

## Option 2: Backend API Endpoint

Create a backend endpoint at `/api/contact` that accepts POST requests with JSON:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91-1234567890",
  "company": "ABC Corp",
  "message": "Message content"
}
```

The endpoint should send an email to `ceo.kmsa@gmail.com` using:
- Node.js with Nodemailer
- PHP with mail() or PHPMailer
- Python with smtplib
- Or any other backend solution

## Option 3: Formspree

1. Sign up at https://formspree.io/
2. Create a new form
3. Set the form action to your Formspree endpoint
4. Update the form in `index.html` to use Formspree's endpoint

## Current Implementation

The form currently uses a mailto fallback which opens the user's email client. This works but requires user interaction. For a better experience, implement one of the options above.
