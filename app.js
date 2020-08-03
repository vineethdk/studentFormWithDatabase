//Should import package in Hyper terminal.

//Like importing packages.
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require("mongoose");
// const alert = require("alert");

mongoose.connect('mongodb://localhost:27017/StudentDB', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
 app.use(bodyParser.urlencoded({extended:true}));//To grab the form that is entered by user.
app.use(express.static("public"));//folders like css and images and sounds etc.

app.set('view engine', 'ejs');

const studentsSchema = {
  firstName:String,
  lastName:String,
  userName:String,
  email:String
}

const Student = mongoose.model("Student",studentsSchema);

//To send html and css to the initial screen.
app.get("/",function(req,res){
  res.render("home");
});


//First posts it into the location spcified in action in html like "/" and
//and server picks it up that is in the form and posts to the screen after user hits submit butto or something.
app.post("/",function(req,res){

  const stu = new Student({
    firstName:req.body.fname,
    lastName:req.body.lname,
    userName:req.body.uname,
    email:req.body.email
  });

  // console.log(req.body);
  Student.find({userName:req.body.uname},function(err,foundItem){
    if(!err){
      if(foundItem.length===0){
        stu.save();
        res.redirect("/submit")
      }
      else{
         res.render("home");
        console.log("The specified userNmae is already taken please enter different one!");
      }
    }
  })
})

app.get("/submit",function(req,res){
  Student.find({},function(erro,newStudents){
    if(!erro){
      // console.log(newStudents);
      res.render("aftersubmit",{newStudents:newStudents});
    }
  })
});

app.post("/delete",function(req,res){
  Student.findByIdAndRemove(req.body.cb,function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("successfully deleted!");
      res.redirect("/submit");
    }
  });
});


//Calling the server
app.listen(3000,function(){
  console.log("Server is running in port 3000")
})
