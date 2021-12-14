/**
 * @author Ahmad Fathon Nurhidayat <fathon626@gmail.com>
 * @license MIT
 * @app Inventory-app
*/

const mongoose = require('mongoose')
const inventoris = mongoose.model('inventori', {
  kode: {
    type: String,
    required: true
  },
  nama: String,
  jumlah: String,
  keterangan: String
})

module.exports = inventoris;