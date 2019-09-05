'use strict';
module.exports = (sequelize, DataTypes) => {
  const AlbumsPurchases = sequelize.define(
    'AlbumsPurchases',
    {
      user: { type: DataTypes.STRING },
      album: { type: DataTypes.INTEGER },
      album_name: { type: DataTypes.STRING }
    },
    { tableName: 'albums_purchases', timestamps: false }
  );

  AlbumsPurchases.associate = models => {
    AlbumsPurchases.belongsTo(models.User, { foreignKey: 'user' });
  };

  return AlbumsPurchases;
};
