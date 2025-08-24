import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes/routes.js';
import client from './connection/redis-client.js';

const app = express();
const allowedOrigins = [process.env.FRONTEND_URL];
const options = {
  origin: allowedOrigins,
};

app.use(cors(options));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", router);

const port = process.env.PORT || 8080;


const startup = async () => {
  try{
      await client.connect();

      setInterval(async () => {
        try {
          if(client.isOpen){
            await client.ping();
            console.log("Pong!");
          }
        } catch (error) {
          console.error("Falha no ping do Redis:", error);
        }
      }, 300000);

      app.listen(port, () => {
      console.log(`SERVIDOR RODANDO NA PORTA ${port}`);
    });
  }catch(error){
      console.error("Falha ao iniciar o servidor ou conectar com o Redis:", error);
  }
};

startup();