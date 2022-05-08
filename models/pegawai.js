const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
  var pegawaiSchema = sequelize.define('pegawai', {
    id_peg: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    nama: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tgl_lahir: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "pegawai_email_key"
    },
    no_telp: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "pegawai_no_telp_key"
    },
    kode_jabatan: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'jabatan',
        key: 'kode_jabatan'
      }
    },
    salt: {
      type: DataTypes.STRING,
      get() {
        return () => this.getDataValue('salt')
      }
    }
  }, {
    sequelize,
    tableName: 'pegawai',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pegawai_email_key",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "pegawai_no_telp_key",
        unique: true,
        fields: [
          { name: "no_telp" },
        ]
      },
      {
        name: "pegawai_pkey",
        unique: true,
        fields: [
          { name: "id_peg" },
        ]
      },
    ],
    hooks: {
      // beforeCreate: async (user) => {
      //   if (user.password) {
      //     const salt = await bcrypt.genSaltSync(10, 'a');
      //     user.password = bcrypt.hashSync(user.password, salt);
      //   }
      // },
      beforeCreate: async function(user) {
        const salt = await bcrypt.genSalt(10, 'a'); //whatever number you want
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async function(user) {
        if (user.password) {
          const salt = await bcrypt.genSaltSync(10, 'a');
          user.password = bcrypt.hashSync(user.password, salt);
        }
      },
    },
    // instanceMethods: {
    //   validPassword: async (password) => {
    //     return await bcrypt.compareSync(password, this.password);
    //   }
    // }
  });

  // pegawaiSchema.beforeCreate(async (user, options) => {
  //   try {
  //     const hash = await bcrypt.hash(user.password, 10);
  //     user.password = hash;
  //   } catch (err) {
  //     throw new Error();
  //   }
  // });

  // pegawaiSchema.prototype.validPassword = async (password, hash) => {
  //   return await bcrypt.compareSync(password, hash);
  // }

  pegawaiSchema.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  }

  return pegawaiSchema;
};
