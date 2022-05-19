const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('presensi', {
    id_pre: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    id_peg: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pegawai',
        key: 'id_peg'
      }
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_DATE')
    },
    jam_msk: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: "CURRENT_TIME"
    },
    lokasi_msk: {
      type: "POINT",
      allowNull: false
    },
    foto_msk: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status_msk: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    jam_plg: {
      type: DataTypes.TIME,
      allowNull: true
    },
    lokasi_plg: {
      type: "POINT",
      allowNull: true
    },
    foto_plg: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status_plg: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'presensi',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "presensi_pkey",
        unique: true,
        fields: [
          { name: "id_pre" },
        ]
      },
    ]
  });
};
