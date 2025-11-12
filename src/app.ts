import express from "express";
import cors from "cors";
import studentRoutes from "./routes/students.routes";
import authRoutes from "./routes/auth.routes";
import staffRoutes from "./routes/staff.routes";
const app = express();

// CORS configuration for production
const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:3000',
            process.env.FRONTEND_URL, // Your production frontend URL
        ].filter(Boolean); // Remove undefined values

        if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app') || origin.includes('netlify.app') || origin.includes('render.com')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'LaundryLink API is running',
        timestamp: new Date().toISOString()
    });
});

app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/laundry", staffRoutes);

export default app;
