/**
 * @author Ahmad Fathon Nurhidayat <fathon626@gmail.com>
 * @license MIT
 * @app Inventory-app
*/

// deklarasi mongoose

const mongoose = require('mongoose')
const uri = 'mongodb://127.0.0.1:27017/gudang'
mongoose.connect(uri, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB sudah terhubung'))
.catch(err => console.log(err));