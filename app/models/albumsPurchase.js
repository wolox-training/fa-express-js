'use strict';
module.exports = (sequelize, DataTypes) => {
  const AlbumsPurchases = sequelize.define(
    'AlbumsPurchases',
    {
      id: { type: DataTypes.INTEGER, unique: true, autoIncrement: true, allowNull: false, primaryKey: true },
      userId: { type: DataTypes.STRING, field: 'user_id' },
      albumId: { type: DataTypes.INTEGER, field: 'album_id' },
      albumName: { type: DataTypes.STRING, field: 'album_name' }
    },
    { tableName: 'albums_purchases', timestamps: false }
  );

  AlbumsPurchases.associate = models => {
    AlbumsPurchases.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return AlbumsPurchases;
};
