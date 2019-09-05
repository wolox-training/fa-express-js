'use strict';
module.exports = (sequelize, DataTypes) => {
  const AlbumsPurchases = sequelize.define(
    'AlbumsPurchases',
    {
      user: {
        type: DataTypes.STRING,
        field: 'email'
      },
      album: { type: DataTypes.INTEGER }
    },
    { tableName: 'albums_purchases', timestamps: false }
  );

  AlbumsPurchases.associate = models => {
    AlbumsPurchases.belongsTo(models.User, { foreignKey: 'email' });
  };

  return AlbumsPurchases;
};
