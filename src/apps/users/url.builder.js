const BASE_URI = "https://apiesell.herokuapp.com/"

const uri = function(token, type) {
    return `${BASE_URI}/${type}/verify/${token}`
}

module.exports = uri
