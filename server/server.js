import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import { handleClerkWebhook } from './controllers/clerkWebhooks.js';
import showRouter from './routes/showRouter.js';
import bookingRouter from './routes/bookingRoutes.js';

const app = express();
const port = 3000;

await connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// Clerk Webhook for user synchronization
app.post('/api/webhooks/clerk', express.raw({ type: 'application/json' }), handleClerkWebhook);

// API Routes
app.get('/', (req, res) => res.send('Server is Live!'));
app.use('/api/show', showRouter);

// Uncomment these when needed
// import adminRouter from './routes/adminRoutes.js';
// import userRouter from './routes/userRoutes.js';
// import { stripeWebhooks } from './controllers/stripeWebhooks.js';

// Stripe Webhooks Route
// app.use('/api/stripe', express.raw({type: 'application/json'}), stripeWebhooks);
app.use('/api/booking', bookingRouter);
// app.use('/api/admin', adminRouter);
// app.use('/api/user', userRouter);

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
