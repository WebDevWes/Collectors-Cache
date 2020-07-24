module.exports = (sequelize, DataTypes) => {

    const Card = sequelize.define("Card", {

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

    Card.associate = models => {

        Card.belongsTo(models.User, {

            foreignKey: {
                allowNull:false
            }

        })

    }
    
    return Card
}