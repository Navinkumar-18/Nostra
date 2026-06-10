const Newsletter = require('../models/Newsletter');

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.subscribed) {
        return res.status(400).json({ message: 'Already subscribed' });
      }
      existing.subscribed = true;
      existing.subscribedAt = Date.now();
      await existing.save();
      return res.json({ message: 'Successfully resubscribed' });
    }

    const subscriber = await Newsletter.create({ email });
    res.status(201).json({ message: 'Successfully subscribed', subscriber });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already subscribed' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const subscriber = await Newsletter.findOne({ email: req.params.email });
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    subscriber.subscribed = false;
    await subscriber.save();

    res.json({ message: 'Successfully unsubscribed' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ subscribed: true })
      .sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
