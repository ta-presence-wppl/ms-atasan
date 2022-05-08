var DataTypes = require("sequelize").DataTypes;
var crypto = require('crypto');
var _jabatan = require("./jabatan");
var _pegawai = require("./pegawai");
var _presensi = require("./presensi");
var _izin = require("./izin");

function initModels(sequelize) {
  var jabatan = _jabatan(sequelize, DataTypes);
  var pegawai = _pegawai(sequelize, DataTypes);
  var presensi = _presensi(sequelize, DataTypes);
  var izin = _izin(sequelize, DataTypes);

  jabatan.belongsTo(pegawai, { foreignKey: "id_atasan" });
  pegawai.hasMany(jabatan, { foreignKey: "id_atasan" });

  pegawai.belongsTo(jabatan, { foreignKey: "kode_jabatan" });
  jabatan.hasMany(pegawai, { foreignKey: "kode_jabatan" });

  presensi.belongsTo(pegawai, { foreignKey: "id_peg" });
  pegawai.hasMany(presensi, { foreignKey: "id_peg" });

  izin.belongsTo(pegawai, { foreignKey: "id_atasan" });
  pegawai.hasMany(izin, { foreignKey: "id_atasan" });
  izin.belongsTo(pegawai, { foreignKey: "id_peg" });
  pegawai.hasMany(izin, { foreignKey: "id_peg" });

  // pegawai.generateSalt = function () {
  //   return crypto.randomBytes(16).toString('base64')
  // }
  // pegawai.encryptPassword = function (plainText, salt) {
  //   return crypto
  //     .createHash('md5')
  //     .update(plainText)
  //     .update(salt)
  //     .digest('hex')
  // }

  // const setSaltAndPassword = user => {
  //   if (user.changed('password')) {
  //     user.salt = pegawai.generateSalt()
  //     user.password = pegawai.encryptPassword(user.password(), user.salt())
  //   }
  // }
  // pegawai.beforeCreate(setSaltAndPassword)
  // pegawai.beforeUpdate(setSaltAndPassword)

  return {
    jabatan,
    pegawai,
    presensi,
    izin,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;