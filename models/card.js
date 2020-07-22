module.exports = (sequelize, DataTypes) => {

    const Card = sequelize.define("Card", {

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        smallURL: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        largeURL: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        condition: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }

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