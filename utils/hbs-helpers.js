const moment = require('moment')

module.exports = {
  noteq: function (p1, p2, options) {
    if (p1 !== p2) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  eq: function (p1, p2, options) {
    if (p1 === p2) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  moment: function (p1) {
    return moment(p1).fromNow()
  }
}
