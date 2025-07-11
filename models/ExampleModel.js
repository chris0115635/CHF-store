// models/exampleModel.js
const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Example', exampleSchema);


