const mongoose = require('mongoose');

const jetskiSchema = mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Admin',
      },
    model: {
        type: String,
        required: [true, 'Please add a model']
    },
    year: {
        type: Number,
        required: [true, 'Please add a year']
    },
    image: {
        type: String,
        required: false,
      },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Jetski', jetskiSchema);
