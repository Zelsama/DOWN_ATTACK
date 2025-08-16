import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes/routes.js';

const app = express();
const allowedOrigins = [process.env.FRONTEND_URL];
const options = {
  origin: allowedOrigins,
};

app.use(cors(options));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", router);

const port = process.env.PORT || 8585;

app.listen(port, () => {
    console.log(`SERVIDOR RODANDO NA PORTA ${port}`);
});