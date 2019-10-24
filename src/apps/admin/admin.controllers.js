const verify = async (req, res) => {
    try {
        if (req.params.token === process.env.LFS_ADMIN)
            return res.status(200).json({
                verifed: true
            })
        return res.status(400).json({
            verifed: false
        })
    } catch (err) {
        return res.status(200).json({
            verifed: false
        })
    }
}

module.exports = { verify }
