import express from 'express';
import passport from 'passport';
import { ensureAuthenticated } from '../middleware/auth.js';
const authRouter = express.Router();

authRouter.get('/auth/discord', passport.authenticate('discord'));

authRouter.get('/auth/discord/callback', 
  passport.authenticate('discord', {
    failureRedirect: `${process.env.FRONTEND_URL}`
  }), 
  function(req, res) {
    res.redirect(process.env.FRONTEND_URL);
  }
);

authRouter.post('/logout', (req, res) => {
  req.logout((error)=>{
    if(error){
      return res.status(500).json({ success: false, message: 'Something went wrong', error: error });
    }
    res.status(204).send();
  })
});

authRouter.get('/me', ensureAuthenticated, (req, res) => {
  res.json({ id: req.user.id, username: req.user.username, discordId: req.user.discord_id, avatarUrl: req.user.avatar_url });
});
export default authRouter;