const mongoose = require('mongoose');

const reservationSchema =  mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jetskis: [{
        type: Schema.Types.ObjectId,
        ref: 'Jetski',
        required: true
    }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
}, {
    timestamps: true,
}
)

module.exports = mongoose.model('Reservation', reservationSchema);
