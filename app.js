const createError = require("http-errors")
const express = require("express")
const logger = require("morgan")
const mongoose = require("mongoose")

const usersRouter = require("./src/users/users.routes")
const merchantRouter = require("./src/merchants/merchants.routes")

const app = express()

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

mongoose
    // eslint-disable-next-line no-undef
    .connect(process.env.LFS_URI, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log("Connected to mongodb ..."))
    .catch(err => console.log(err))

app.use("/users", usersRouter)
app.use("/merchants", merchantRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404))
})

// error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get("env") === "development" ? err : {}

    res.status(err.status || 500).json({
        error: "error ocurred!"
    })
})

module.exports = app
