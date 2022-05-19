const { Op, Model, QueryTypes, DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_CONN);
const initModels = require('../models/init-models');
var models = initModels(sequelize);

class AbsentControllers {
    checkAbsentIn(data) {
        return models.presensi.findOne({
            attributes: {
                include: ['id_peg']
            },
            where: {
                id_peg: data.id_peg,
                tanggal: data.date
            },
        })
    }

    checkAbsentOut(data) {
        return models.presensi.findOne({
            attributes: {
                include: ['id_peg']
            },
            where: {
                id_peg: data.id_peg,
                tanggal: data.date,
                jam_plg: {
                    [Op.is]: null,
                },
            },
        })
    }

    createAbsentIn(data) {
        return models.presensi.create({
            id_peg: data.id_peg,
            tanggal: data.date,
            jam_msk: data.time,
            lokasi_msk: data.lokasi_msk,
            foto_msk: data.foto_msk
        })
    }

    updateAbsentIn(data) {
        return models.presensi.update({
            jam_plg: data.time,
            lokasi_plg: data.lokasi_plg,
            foto_plg: data.foto_plg
        }, {
            where: {
                id_peg: data.id_peg,
                tanggal: data.date,
            }
        })
    }

    getAllAbsent(data) {
        return models.presensi.findAll({
            attributes: {
                exclude: ['id_peg', 'id_pre'],
                include: ['pegawai.nama']
            },
            include: [
                { 
                    model:models.pegawai,
                    attributes: ['nama'],
                    required:true
                },
            ],
            where: {
                id_peg: sequelize.literal("pegawai.id_peg IN (SELECT id_peg FROM pegawai WHERE id_atasan =" + data.id_peg + ")"),
                tanggal: sequelize.literal("EXTRACT(year FROM tanggal) = EXTRACT(year FROM date('" + data.date + "')) and EXTRACT(month FROM tanggal) = EXTRACT(month FROM date('" + data.date + "'))")
            },
        })
    }
    
    getAllIzin(data) {
        return models.izin.findAll({
            attributes: {
                exclude: ['id_peg', 'id_izin'],
                include: ['pegawai.nama']
            },
            include: [
                { 
                    model:models.pegawai,
                    attributes: ['nama'],
                    required:true
                },
            ],
            where: {
                id_peg: sequelize.literal("pegawai.id_peg IN (SELECT id_peg FROM pegawai WHERE id_atasan =" + data.id_peg + ")"),
                tgl_awal: sequelize.literal("EXTRACT(year FROM tgl_awal) = EXTRACT(year FROM date('" + data.date + "')) and EXTRACT(month FROM tgl_awal) = EXTRACT(month FROM date('" + data.date + "'))")
            },
        })
    }
}

module.exports = AbsentControllers;