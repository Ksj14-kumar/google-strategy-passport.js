const express = require('express');
const User = require("./db/user")
require("dotenv").config()
const port = process.env.PORT || 3101
const app = express()
const router = require("./Router/router")
const cors = require("cors")
const mongoose = require('mongoose');
const session = require("express-session")

mongoose.connect(process.env.URL, (err) => {
    if (err) {
        console.log("not connected", process.env.URL)

    }
    else {
        console.log("conenctred")
    }
})

const GoogleStrategy = require("passport-google-oauth20")
const passport = require("passport")
//now setup the staretegy

app.use(cors())
// passport.use(new GoogleStrategy({}, () => {
//     console.log("call back fuhnction")
// }))


passport.serializeUser((user, done) => {
    done(null, user.id)
})


passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        if (err) {
            done(null, false,{message:"invalid data"})
        }
        else {
            done(null, user.id)
        }
    })
})

passport.use(new GoogleStrategy({
    callbackURL: "/google/auth",
    clientID: process.env.cliendId,
    clientSecret: process.env.clientSecret
}, (accessToken, refreshToken, profile, done) => {

    User.findOne({ googleID: profile.id }, (err, currentUse) => {
        if (err) {
            done(null, false, { message: "Something error" })
        }
        if (currentUse) {
            done(null, currentUse)
        }
        else {
            new User({
                name: profile.displayName,
                googleID: profile.id
            }).save((err, result) => {
                if (err) {
                    done(null, false, { message: "user not save please try again" })
                }
                else {
                    done(null, result)
                }
            })
        }

    })

}))




app.use(session({
    name: "session",
    secret: "key",
    saveUninitialized: true,
    resave: true
}))

app.use(passport.initialize())
app.use(passport.session())




app.set("view engine", "ejs")

app.use("/", router)









app.listen(port, (err) => {
    if (err) {
        console.log("server not start")
    }
    else {
        console.log(`server start at port ${port}`)
    }
})