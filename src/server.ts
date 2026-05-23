// the main file first comments 
// import './load-globals';
// import mongoose from 'mongoose';
// import http from 'http';
// import { Server } from 'socket.io';
// import app from './app';
// import config from './app/config';
// import seedSuperAdmin from './app/DB';
// import { setupSocketIO } from './app/socket/socket.config';

// // ✅ Safe global io instance (optional global accessor)
// let ioInstance: Server | null = null;
// export const getIO = (): Server | null => ioInstance;

// let server: http.Server;

// async function main() {
//   try {
//     await mongoose.connect(config.database_url as string);
//     console.log('✅ Connected to MongoDB');

//     await seedSuperAdmin();

//     server = http.createServer(app);

//     const io = new Server(server, {
//       path: '/socket.io',
//       cors: {
//         origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5000', 'https://sbm777.com', 'https://bm24api.xyz'],
//         methods: ['GET', 'POST', 'OPTIONS'],
//         allowedHeaders: ['Content-Type', 'Authorization'],
//         credentials: true,
//       },
//       transports: ['websocket'],
//       pingInterval: 25000,
//       pingTimeout: 60000,
//     });

//     ioInstance = io;
//     setupSocketIO(io);

//     // ✨ Preload LUA & warm Redis (cuts first-hit latency)
    

//     /** Keep-Alive alignment with Nginx */
//     server.keepAliveTimeout = 70_000; // < headersTimeout
//     server.headersTimeout = 75_000;   // >= keepAliveTimeout
//     server.requestTimeout = 0;        // no overall cap

//     server.listen(config.port, () => {
//       console.log(`🚀 Server running on port ${config.port}`);
//     });
//   } catch (error) {
//     console.error('❌ Error starting server:', error);
//   }
// }

// process.on('unhandledRejection', (err) => {
//   console.error('❌ Unhandled Rejection. Shutting down...', err);
//   if (server) {
//     server.close(() => process.exit(1));
//   }
// });

// process.on('uncaughtException', (err) => {
//   console.error('❌ Uncaught Exception. Shutting down...', err);
//   process.exit(1);
// });

// main();


import './load-globals';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import seedSuperAdmin from './app/DB';

let isConnected = false;

/**
 * ✅ Shared DB connection (safe for serverless & server)
 */
async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(config.database_url as string);
  await seedSuperAdmin();

  isConnected = true;
  console.log('✅ MongoDB connected');
}

/**
 * ================================
 * 🟢 MODE 1: VERCEL (SERVERLESS)
 * ================================
 */
export default async function handler(req: any, res: any) {
  if (process.env.VERCEL !== '1') {
    // Not running on Vercel → skip
    return;
  }

  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error('❌ Vercel handler error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * ================================
 * 🟢 MODE 2: LOCAL / VPS
 * ================================
 */
async function startServer() {
  if (process.env.VERCEL === '1') {
    // Running on Vercel → NEVER listen
    return;
  }

  try {
    await connectDB();

    const port = config.port || 5000;
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (err) {
    console.error('❌ Server start failed:', err);
    process.exit(1);
  }
}

startServer();

/**
 * ================================
 * 🟢 PROCESS SAFETY (VPS ONLY)
 * ================================
 */
if (process.env.VERCEL !== '1') {
  process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    process.exit(1);
  });

  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
  });
}

