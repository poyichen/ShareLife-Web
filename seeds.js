var mongoose = require("mongoose");
var Photo = require("./models/photo")
var Comment = require("./models/comment")

var data = [
        {title: "Lotus",
         image: "https://farm1.staticflickr.com/957/41096309124_923f7e3444_o.jpg",
         description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
         author:{
            id : "588c2e092403d111454fff76",
            username: "Jack"
        }
        },
        {title: "Cosmos bipinnatus",
         image: "https://farm6.staticflickr.com/5808/22574190329_3c5a0b6013_o.jpg",
         description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
         author:{
            id : "588c2e092403d111454fff71",
            username: "Jill"
         }
        },
        {title: "Rails",
         image: "https://farm6.staticflickr.com/5780/22912391024_3f4762a2f8_o.jpg",
         description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
         author:{
            id : "588c2e092403d111454fff77",
            username: "Jane"
         }
        }
    ]

function seedDB(){
    
    Photo.deleteMany({}, function(err){
        if(err){
            console.log(err)
        }
        else{
            console.log("Remove successfully!!");
        }
        data.forEach(function(seed){
            Photo.create(seed, function(err, photo){
                if(err) {
                    console.log(err)
                }
                else {
                    console.log("Add successfully!!")
                }
                Comment.create(
                    {
                        text: "bravo",
                        author:{
                            id : "588c2e092403d111454fff79",
                            username: "Jane"
                        }
                    }, function(err, newComment){
                        if(err){
                            console.log(err);
                        }
                        else{
                            photo.comments.push(newComment);
                            photo.save();
                            console.log("Created New Comment successfully!!!");
                        }
                    }
                )
            })
        })
    })
}



module.exports = seedDB;