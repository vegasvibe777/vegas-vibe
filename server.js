const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Database connection with error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/social-casino', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB successfully');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Routes
app.get('/api/games', (req, res) => {
    try {
        res.json([
            { id: 1, name: 'Slots', type: 'slots' },
            { id: 2, name: 'Blackjack', type: 'blackjack' },
            { id: 3, name: 'Poker', type: 'poker' }
        ]);
    } catch (error) {
        console.error('Error in /api/games route:', error);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

// Policy Pages
app.get('/privacy-policy', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'privacy-policy.html'));
});

app.get('/terms-and-conditions', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'terms-and-conditions.html'));
});

app.get('/cookie-policy', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cookie-policy.html'));
});

// Contact form route
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Here you would typically:
        // 1. Validate the input
        // 2. Send an email notification
        // 3. Store the message in your database
        
        // For now, we'll just log the message
        console.log('Contact form submission:', { name, email, subject, message });
        
        res.status(200).json({ message: 'Message received successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Failed to process contact form submission' });
    }
});

// Serve the main HTML file for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server with error handling
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
});

// Handle process termination
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Closing server...');
    server.close(() => {
        console.log('Server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
}); 