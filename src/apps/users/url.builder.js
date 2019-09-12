const BASE_URI = "https://apiesell.herokuapp.com/"

const uri = function(token, type, id) {
    return `${BASE_URI}/${type}/verify/${id}/${token}`
}

module.exports = uri
