const passport = require('passport');

const router = require('express').Router();


// google authenticator middleware


// const auth =




router.get("/", (req, res) => {
    res.render("home")
})



router.get("/google/login",  passport.authenticate("google", { scope: ["email", "profile"] }))


router.get("/google/auth", passport.authenticate("google"), (req, res) => {
    console.log("success")
    // res.send(req.user)
    res.redirect("/profile")
    // res.end()
})



router.get("/profile", (req, res) => {
    res.send("welcome to profile")
})


module.exports = router