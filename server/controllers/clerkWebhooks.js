import User from '../models/User.js';

export const handleClerkWebhook = async (req, res) => {
  try {
    const event = JSON.parse(req.body);
    
    switch (event.type) {
      case 'user.created':
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
          _id: id,
          email: email_addresses[0].email_address,
          name: first_name + " " + last_name,
          image: image_url,
        };
        await User.create(userData);
        break;
        
      case 'user.updated':
        const updateData = {
          _id: event.data.id,
          email: event.data.email_addresses[0].email_address,
          name: event.data.first_name + " " + event.data.last_name,
          image: event.data.image_url,
        };
        await User.findByIdAndUpdate(event.data.id, updateData);
        break;
        
      case 'user.deleted':
        await User.findByIdAndDelete(event.data.id);
        break;
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
}; 