function ensureAuthenticated (req) {
  return req.isAuthenticated()
}

function getUser (req) {
  return req.user
}

function noteq (p1, p2, options) {
  if (p1 !== p2) {
    return options.fn(this)
  }
  return options.inverse(this)
}

module.exports = {
  ensureAuthenticated,
  getUser,
  noteq
}
