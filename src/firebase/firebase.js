const admin = require("firebase-admin")

let serviceAccount =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    require("/home/bee/secrets.json")

serviceAccount =
    typeof serviceAccount === "object"
        ? serviceAccount
        : JSON.parse(serviceAccount)

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://esell-e5235.appspot.com/"
})

module.exports = admin.storage().bucket()
