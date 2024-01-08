//require express
const path = require('path');//used to get path it is inbuild model
const express = require('express');



const port = 8000;
//to setup database above express fireup

const db = require('./config/mongoose');
// console.log(db);
const Contact = require('./models/contact');
const app = express();

// console.log(app);
//this app has all functionality to run the server

//how to setup ejs template engine.__>
/**
 * set up steps
 * 1. install ejs
 * 2.app.set()- view engine and template engine used then and set path using join dirname and view folder
 * 3.setup view directory and then finally we render
 * 4. using res.render();
 */
//app has multiple property 
app.set('view engine', 'ejs');
// app.set(setting, val);

app.set('views', path.join(__dirname,'views'));

//just after a set do this below it also called as a middleware
app.use(express.urlencoded());//used as a bodyParser... this is used to read form not params
/**
 * midlleware is used to manipulate or change req,res data.
 * MiddleWare has acess to req and res of data  before every controller app.use call express.urlencoder()
 * takes req and it reads data and convert form data into key-value pair put this data into req.body
 * we can make multiple middleware no problem.
 * It can also override the req data 
 * MiddleWare1
 */
// app.use(callback)
// app.use(function(req,res,next){
//     req.name = "Pranav";
//     console.log("MIddle Ware 1 called ");
//     //till will get stuck here becz we dont pass to next to execute
//     // so make call next
//     next();
//     // after this it pass to ctrler 
// })

// app.use(function(req,res,next){
//     console.log("this is m2 ->",req.name);
//     console.log("middle ware 2 called");
//     next();
// })

//to acess a static folder we have express.static
app.use(express.static('assets'))

//create a local var 
var contactList = [
    {
        name:"Pranav",
        phone:"9300082829"
    },
    {
        name:"Prasad",
        phone:"960455383"
    },
    {
        name:"Saurabh",
        phone:"930772829"
    }

]


//whenever req comes we have to return else it gives cannot get /
//alll switch cases is merge into this
// app.get('/',function(req,res){
//     //if u want to sisplay tiltile dynamic then assign obj to render call
//     return res.render('home',{title:"My contacts"});
//     console.log("direcotry name",__dirname ,"and the path is :",path.dirname('./'));
//     //req-->

//     console.log(req);//deafultEnding utf8 ->  inside header accept, cookie,host this all data send to browser
//     //route,
//     //here we do app.get()->to fetch data data already present in server
//     // .post()=> req.it help to make some changes in database / to update data we make post call
//     //put() => means there is something already present  and the value is missing then we use put to full fill the missing info
//     //patch()=> suppose u want to update age : then pathch is used..
//     //Delete() = > this is used to remove a data with unique id
//     //this works with ajax req.
    

//     // if(req.complete) console.log("WOW completed");
//     // res.send("cool is it running....");
// })

app.get('/',function(req,res){

    console.log("from get home",req.name);
    //below part called context
    // return res.render('home',{
    //     title:"Home",
    //     contact_list : contactList,
    // });
    //passing value of as parameter to html..

    //fetching data in mongobd
    // console.log(Contact);
    // Contact.find({name:String,phone:String},function(err,contactsfound){
    //     if(err){
    //         console.log("Error in Fetching...");
    //         return;
    //     }
    //     return res.render('home',{
    //         title:"Home",
    //         contact_list : contactsfound,
    //     });

    // })

    //here promise needed because simple are not supported for above version.....
    Contact.find({})
        .then((contactsfound)=>{
            // console.log("Fetching Data Please wait........",contactsfound);
            return res.render('home',{
                title:"Home",
                contact_list : contactsfound,
            });
        })
        .catch((err)=>{
            console.log("Error While Rendering.......");
        })

})
app.get('/play',function(req,res){
    return res.render('practise',{title:"PlayGround",
    arr:[1,2,3,4,5]});
    //passing value of as parameter to html..
})


//to get form data
app.post('/create-contact',function(req,res){
    //append to arr i.e list
    /**
     * data from form 
     * then we use parser from express
     * then we can get data in body obj becz of form is in body 
     */
    //no need to add in arraylist instead of that push to database
    // contactList.push(req.body);
   


    //using promise
    let data = {
        name: req.body.name,
        phone: req.body.phone
    };
    
    Contact.create(data)
        .then((newContact) => {
            // console.log("Contact created:", newContact);
            // res.send("Contact created successfully");
            res.redirect('back');
        })
        .catch((err) => {
            console.error("Error creating contact:", err);
            res.status(500).send("Error while creating contact");
        });
    
    // console.log(req.body);
    // return res.redirect('/'); //or
    // return res.redirect('back')//froom where u come previously
})

//to delete 
app.get('/delete-contact/',function(req,res){
//suppose here route is 
/**
 * delete-contact/10 here 10 is param
 * delte-contact/?phone=9922something this is known as query param
 * with using above we goeing to delte contacts 
 * in query param u can go chanining... as u 
 */

    // console.log(req.query);
    // let phone = req.query.phone;
    // phone.toString().trim();
    // let contactIndex = contactList.findIndex(contact=>contact.phone==(phone));
    // console.log(contactIndex);
    // if(contactIndex != -1){
    //     contactList.splice(contactIndex,1);
    // }
    // return res.redirect('back');
    //another way u can use
    // Contact.findByIdAndDelete(id, options)

    //perform deletion using promise
    Contact.deleteOne({_id:req.query.id})
        .then(()=>{
            // console.log(req.query);
            console.log("Successfully Deleted........");
            res.redirect('/');
        })
        .catch((err)=>{
            console.log("Error While delteing...........");
        })
});


// app.listen(port, hostname, backlog)
app.listen(port, function(err){
    if(err) console.log("error");
   
    console.log("Server started////");
    
})