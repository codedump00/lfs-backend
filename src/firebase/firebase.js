const admin = require("firebase-admin")

let serviceAccount =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    require("/home/bee/lfs-cards-secrets.json")

serviceAccount =
    typeof serviceAccount === "object"
        ? serviceAccount
        : JSON.parse(serviceAccount)

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://lfs-cards.appspot.com/"
})

module.exports = admin.storage().bucket()
