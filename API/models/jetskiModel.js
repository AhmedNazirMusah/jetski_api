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
    file: {
        type: String,
        required: [true, "add an image"]
    },
    url: {
        type: String,
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model('Jetski', jetskiSchema);
