//Initalization

const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");

const app = express();

app.set('view engine','ejs');


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

//Setting up database usign monogoDB

mongoose.connect("mongodb+srv://clashofa1057:temppass@cluster0.fqzvj3u.mongodb.net/RESTfulAPI?retryWrites=true&w=majority")
    .then(()=>{console.log("mongodb connect success")})
    .catch((err)=>{console.log(err)});

const articleSchema = new mongoose.Schema({
    title:String,
    content:String
});

const Article = mongoose.model("Article",articleSchema);


//Handling Requests 

/////////////Requests Trageting all articles ///////////////////////
app.route("/articles")
.get((req,res)=>{
    Article.find({})
        .then((foundArticles)=>{
            res.send(foundArticles);
        })
        .catch((err)=>{
            console.log(err);
        })
})

.post((req,res)=>{

    const newArticle = new Article({
        title: req.body.title,
        content:req.body.content
    });

    newArticle.save()
        .then(()=>{
            res.send("save success");
        })
        .catch((err)=>{
            res.send(err);
        });
})

.delete((req,res)=>{
    Article.deleteMany()
        .then(()=>{
            res.send("delete success");
        })
        .catch((err)=>{
            res.send(err);
        })
});

/////////////Requests Trageting specific articles ///////////////////////

app.route("/articles/:articleTitle")

    .get((req,res)=>{
        Article.findOne({title: req.params.articleTitle})
            .then((foundArticles)=>{
                if(foundArticles){
                    res.send(foundArticles);
                }else{
                    res.send("No matching articles found");
                }
            })
            .catch((err)=>{
                console.log(err);
            });
    })

    .put((req,res)=>{
        Article.update(
            {title: req.params.articleTitle},
            {title: req.body.title,
             content: req.body.content},
             {overwrite:true}
        )
        .then(()=>{console.log("update success")})
        .catch((err)=>{console.log(err)});
    })

    .patch((req,res)=>{
        Article.update(
            {title: req.params.articleTitle},
            {$set: req.body},
        )
        .then(()=>{console.log("update success")})
        .catch((err)=>{console.log(err)});
    })

    .delete((req,res)=>{
        Article.deleteOne(
            {title: req.params.articleTitle}
        )
        .then(()=>{console.log("delete success")})
        .catch((err)=>{console.log(err)});
    });


    

app.listen("3000",()=>{
    console.log("Server started on port 3000");
});