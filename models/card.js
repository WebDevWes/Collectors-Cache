//Creating Card model
module.exports = (sequelize, DataTypes) => {

    const Card = sequelize.define("Card", {
        //None of the fields should be null
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        condition: {
            type: DataTypes.STRING,
            allowNull: false,
        },

    })
    // Assigns card to proper user via foreign key that is associated with the id of user that is logged in
    Card.associate = models => {

        Card.belongsTo(models.User, {

            foreignKey: {
                allowNull:false
            }

        })

    }
    
    return Card
}