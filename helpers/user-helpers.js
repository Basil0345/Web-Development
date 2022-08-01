var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var objectId=require('mongodb').ObjectId


module.exports = {
    doSignup: (userData) => {

        return new Promise(async (resolve, reject) => {

            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then(async (data) => {
                const id = data.insertedId
                const array = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: id })
                resolve(array)
            })
        })
    },

    doLoginin: (userData) => {

        return new Promise(async (resolve, reject) => {

            let loginStatus = false
            let response = {}

            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })

            if (user) {

                bcrypt.compare(userData.password, user.password).then((status) => {

                    if (status) {

                        response.user = user
                        response.status = true
                        resolve(response)
                        console.log('Correct password')
                    } else {

                        resolve({ status: false })
                        console.log('Wrong password')

                    }
                })


            } else {

                resolve({ status: false })
                console.log('User not found');

            }


        })



    },

    addToCart:(productId,userId)=>{

        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})

            if(userCart){
                
                db.get().collection(collection.CART_COLLECTION).
                updateOne({user:objectId(userId)},{

                    $push:{products:objectId(productId)}

                }).then((response)=>{
                    resolve() 
                })

            }else{
                let cartObj={
                    user:objectId(userId),
                    products:[objectId(productId)]

                }

                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })

    },

    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
        let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
            {
                $match:{user:objectId(userId)}
            },
            {
                $lookup:{
                    from:collection.PRODUCT_COLLECTION,
                    let:{prodList:'$products'},
                    pipeline:[
                        {
                            $match:{
                                $expr:{     //compare fields from the same document in a $match stage.
                                           // $expr can compare fields using let variables.
                                    $in:['$_id',"$$prodList"]// $in operator selects the documents where the value of a field equals any value in the specified array. 
                                }
                            }
                        }
                    ],
                    as:'cartItems'

                }
            }
        ]).toArray() 
          resolve(cartItems[0].cartItems)

        })

    }

}
