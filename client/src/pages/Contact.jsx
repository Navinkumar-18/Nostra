import { useState } from 'react';
import api from '../services/api';

const Contact = ({ showNotification }) => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.name || !form.email || !form.subject || !form.message) {
      showNotification('Please fill in all fields.');
      return;
    }
    if (!emailRegex.test(form.email)) {
      showNotification('Please enter a valid email address.');
      return;
    }
    try {
      await api.contact.submit(form);
      showNotification(`Thank you for your message, ${form.name}! We will get back to you soon.`);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      showNotification(error.message);
    }
  };

  return (
    <div className="contact-section">
      <div className="contact-container">
        <div className="contact-info">
          <h2>Get In Touch</h2>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

          <div className="contact-item">
            <i className="fa-solid fa-location-dot"></i>
            <div>
              <h3>Address</h3>
              <p>123 Fashion Street<br />Style City, SC 12345</p>
            </div>
          </div>

          <div className="contact-item">
            <i className="fa-solid fa-phone"></i>
            <div>
              <h3>Phone</h3>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>

          <div className="contact-item">
            <i className="fa-solid fa-envelope"></i>
            <div>
              <h3>Email</h3>
              <p>info@nostra.com</p>
            </div>
          </div>

          <div className="contact-item">
            <i className="fa-solid fa-clock"></i>
            <div>
              <h3>Business Hours</h3>
              <p>Mon - Fri: 9:00 AM - 6:00 PM<br />Sat: 10:00 AM - 4:00 PM<br />Sun: Closed</p>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <h2>Send Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <input type="email" name="email" placeholder="Your Email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <input type="text" name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <textarea name="message" placeholder="Your Message" rows="5" value={form.message} onChange={handleChange} required />
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
