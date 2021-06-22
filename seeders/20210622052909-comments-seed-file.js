'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments', Array.from(
      { length: 3 },
      () => ({
        text: faker.lorem.word(),
        UserId: 1,
        RestaurantId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    ))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null)
  }
}
