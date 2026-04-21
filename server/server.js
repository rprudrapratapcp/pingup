import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import {inngest, functions} from './inngest/index.js'
import {serve} from 'inngest/express';

const app = express();
await connectDB();

app.use(express.json());
app.use(cors());

// 🔥 ADD THIS
console.log("INNGEST:", inngest);
console.log("FUNCTIONS:", functions);

app.get('/',(req,res)=>res.send('server is running'));
app.use(
  "/api/inngest",
  serve(inngest, functions)
);

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>console.log(`server is running on port ${PORT} `));