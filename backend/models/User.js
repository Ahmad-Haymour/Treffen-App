
const {Schema, model, SchemaTypes} = require('mongoose')

const userSchema = Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    gender: {
        type: String, 
        enum: ['Male', 'Female'],

    },
    age: {type: String, required: true},
    avatar: {type: String},
    events: [{
        type: SchemaTypes.ObjectId,
        ref: 'Event'
    }],
    // Joined Events in list
    eventslist:[{
        type: SchemaTypes.ObjectId,
        ref: 'Event'
    }],
    token: {type: String},

    messenger: [{
        type: SchemaTypes.ObjectId,
        ref: 'Chat'
    }]
})

// userSchema.methods.toJSON = function(){
//     const result = {firstname: this.firstname, lastname: this.lastname, email: this.email, avatar: this.avatar, age: this.age, _id: this._id}
//     return result
// }

module.exports = model('User', userSchema)