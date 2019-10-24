const createError = require("http-errors")
const express = require("express")
const logger = require("morgan")
const mongoose = require("mongoose")

const usersRouter = require("./src/apps/users/users.routes")
const cardsRouter = require("./src/apps/cards/cards.routes")
const merchantRouter = require("./src/apps/merchants/merchants.routes")

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

app.get("/admin/:token", verifyAdmin)
app.use("/users", usersRouter)
app.use("/merchants", merchantRouter)
app.use("/cards", cardsRouter)

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

const verifyAdmin = async (req, res) => {
    try {
        if (req.params.token === process.env.LFS_ADMIN)
            return res.status(200).json({
                verifed: true
            })
        return res.status(400).json({
            verifed: false
        })
    } catch {
        return res.status(200).json({
            verifed: false
        })
    }
}

module.exports = app
