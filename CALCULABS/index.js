import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/routes.js';
import authRouter from './routes/discordRoutes.js';
import client from './connection/redis-client.js';
import RedisStore from 'connect-redis';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import db from './database/connection.js';

dotenv.config();

const app = express();
const allowedOrigins = [process.env.FRONTEND_URL];
const options = {
  origin: allowedOrigins,
  credentials: true,
};
const port = process.env.PORT || 8080;
const scopes = ['identify'];

app.set('trust proxy', 1);
app.use(cors(options));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
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
    maxAge: 1000 * 60 * 60 * 24 * 7,
    partitioned: process.env.NODE_ENV === 'production'
   }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {  
  try {  
    const user = await db('users').where({ id: id }).first();  
    if (!user) {  
      return done(new Error('User not found'));  
    }
    done(null, user);  
  } catch (error) {  
    done(error, null);
  }  
});

passport.use(new DiscordStrategy({  
  clientID: process.env.DISCORD_CLIENT_ID,  
  clientSecret: process.env.DISCORD_CLIENT_SECRET,  
  callbackURL: `${process.env.BACKEND_URL}/auth/discord/callback`,  
  scope: scopes  
}, async (accessToken, refreshToken, profile, done) => {  
  try {  
    const user = await db('users').where({ discord_id: profile.id }).first();  
    if (user) {  
      return done(null, user);  
    }  
    const [newUserId] = await db('users').insert({  
      discord_id: profile.id,  
      username: profile.username,  
      avatar_url: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,  
    });  
    const newUser = await db('users').where({ id: newUserId }).first();    
    return done(null, newUser);  
  } catch (error) {  
    return done(error);  
  }  
}));

app.use("/", apiRouter);
app.use("/", authRouter);

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