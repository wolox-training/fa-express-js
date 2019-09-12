'use strict';
module.exports = (sequelize, DataTypes) => {
  const AlbumsPurchases = sequelize.define(
    'AlbumsPurchases',
    {
      id: { type: DataTypes.STRING, unique: true, allowNull: false, primaryKey: true },
      userId: { type: DataTypes.STRING },
      albumId: { type: DataTypes.INTEGER },
      album_name: { type: DataTypes.STRING }
    },
    { tableName: 'albums_purchases', timestamps: false }
  );

  AlbumsPurchases.associate = models => {
    AlbumsPurchases.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return AlbumsPurchases;
};
