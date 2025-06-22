import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
import { inngest, functions } from './inngest/index.js';

const app = express();
const port = 3000;

await connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// Safe logging of Inngest functions
console.log('Inngest functions being served:');
functions.forEach((fn, index) => {
  if (!fn || !fn.config || !fn.config.id) {
    console.error(`Function at index ${index} is invalid:`, fn);
  } else {
    console.log(fn.config.id);
  }
});

// Filter valid functions only
const validFunctions = functions.filter(fn => fn && fn.config && fn.config.id);

// API Routes
app.get('/', (req, res) => res.send('Server is Live!'));
app.use('/api/inngest', serve({ client: inngest, functions: validFunctions }));

// Uncomment these when needed
// import showRouter from './routes/showRoutes.js';
// import bookingRouter from './routes/bookingRoutes.js';
// import adminRouter from './routes/adminRoutes.js';
// import userRouter from './routes/userRoutes.js';
// import { stripeWebhooks } from './controllers/stripeWebhooks.js';

// Stripe Webhooks Route
// app.use('/api/stripe', express.raw({type: 'application/json'}), stripeWebhooks);
// app.use('/api/show', showRouter);
// app.use('/api/booking', bookingRouter);
// app.use('/api/admin', adminRouter);
// app.use('/api/user', userRouter);

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
