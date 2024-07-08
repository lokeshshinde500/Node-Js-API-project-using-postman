const passport = require("passport")
const passportJwt = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt;
const adminModel = require("../models/v1/adminModel");
const managerModel = require("../models/v1/managerModel");
const employeeModel = require("../models/v1/employeeModel");

// admin jwt
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'RNW'
}

passport.use(new passportJwt(opts, async (data, done) => {
    const verifiedUser = await adminModel.findById(data.verifiedAdmin._id);
    if (verifiedUser) {
        return done(null, verifiedUser);
    } else {

        return done(null, false);
    }
}))

// manager jwt
const managerOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'RNW'
}

passport.use("managerJwt", new passportJwt(managerOpts, async (data, done) => {
    const verifiedUser = await managerModel.findById(data.verifiedManager._id);
    if (verifiedUser) {
        return done(null, verifiedUser);
    } else {
        return done(null, false);
    }
}))

// employee jwt
const employeeOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'RNW'
}

passport.use("employeeJwt", new passportJwt(employeeOpts, async (data, done) => {
    const verifiedUser = await employeeModel.findById(data.verifiedEmployee._id);
    if (verifiedUser) {
        return done(null, verifiedUser);
    } else {
        return done(null, false);
    }
}))


// serializeUser & deserializeUser

passport.serializeUser((user, done) => {
    if (user) {
        return done(null, user.id);
    } else {
        return done(null, false);
    }
})

passport.deserializeUser((id, done) => {
    return done(null, id);
})

