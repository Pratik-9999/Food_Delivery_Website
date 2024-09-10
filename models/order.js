const mongoose =  require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref:'User'
    },
    items:[
        {
      fooditemId: {
        type:mongoose.SchemaTypes.ObjectId,
        require:true,
        ref:'fooditemId'
      },
      quantity: { 
        type:Number,
        require:true,
        

      },
    }
    ],

    totalAmount:{
        type:Number,
    },
    deliveryAddress: {
        type:String
    },
    status:{
        type:String,
        default: 'Pending'
    },
    CreatedAt:{
        type:Date,
        default: Date.now()
    },

});

module.exports = mongoose.model('Order',OrderSchema);