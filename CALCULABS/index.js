import express from 'express';
import session from 'express-session';
import cors from 'cors';
import router from './routes/routes.js';
import client from './connection/redis-client.js';
import RedisStore from 'connect-redis';

const app = express();
const allowedOrigins = [process.env.FRONTEND_URL];
const options = {
  origin: allowedOrigins,
};

app.use(cors(options));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('trust proxy', 1) 
app.use(session({
  store: new RedisStore({ 
    client: client,
    prefix: 'myapp:'
   }),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7
   }
}))
app.use((req, res, next) => {
  next();
});
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