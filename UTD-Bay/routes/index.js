var express = require('express');
const fs = require('fs');
var postmark = require("postmark");


var router = express.Router();

var monk = require('monk');


var db = monk('localhost:27017/utdhackathon');

var users = db.get('users');
var products = db.get('products');

var currUser = ""

router.post('/signup', function (req, res) {
  var obj = {
    name: req.body.name,
    address: req.body.address,
    contact: req.body.contact,
    email: req.body.email,
    password: req.body.password
  };


  currUser = req.body.email
  users.insert(obj,
    function (err) {

      if (err) throw err;
      products.find({}, function (err, products) {
        console.log(err)
        if (err) throw err;

        res.render('buy', { results: products, x: clicker });
      });
    });

})

router.get('/login', function (req, res) {
  res.render('login')
})

router.post('/login', function (req, res) {
  var email = req.body.email
  var password = req.body.password



  users.findOne({ email: email }, 'password',
    function (err, user) {
      if (err) throw err;

      if (password == user.password) {
        console.log("verified");
        currUser = email;
        res.render('signup');
      }
    });

});

/* GET home page. */
router.get('/signup', function (req, res, next) {
  res.render('signup');
});

router.post('/sell', function (req, res) {
  // console.log("hello", req.body.image)
  var product = {
    category: req.body.category,
    availability: req.body.availability,
    itemName: req.body.itemName,
    area: req.body.area,
    cost: req.body.cost,
    description: req.body.desc,
    imageUrl: req.body.image,
    owner: currUser
  }

  console.log(req.body)
  fs.copyFile('/home/hp/UTD-Bay/images/' + req.body.image, '/home/hp/UTD-Bay/public/images/' + req.body.image, (err) => {
    if (err) throw err;
    console.log('File was copied to destination');
  });

  // localStorage.setItem('/home/hp/vidzy-ejs (copy)', document.getElementById("avatar").value)

  products.insert(product,
    function (err) {
      if (err) throw err;

      products.find({}, function (err, products) {
        console.log(err)
        if (err) throw err;
    
        res.render('buy', { results: products, x: clicker });
      });
    });
});

router.get('/sell', function (req, res) {
  res.render('sell');
});

router.get('/buy', function (req, res) {
  products.find({}, function (err, products) {
    console.log(err)
    if (err) throw err;

    res.render('buy', { results: products, x: clicker });
  });
});


router.post('/search', function (req, res) {
  var searchItem = req.body.searchItem;
  console.log(searchItem)

  products.find({}, function (err, products) {
    console.log(err)
    if (err) throw err;

    const resp = products.filter((product) => {
      console.log(product.itemName)
      return product.itemName.toLowerCase().includes(searchItem.toLowerCase());
    });

    res.render('buy', { results: resp });
  });



});

router.post('/interested/', function (req, res) {
  
});


function clicker() {
  console.log("Button Working!");
};
// function check(product) {
//   return product.itemName.includes()
// }
// router.get('/videos', function(req, res) {
// console.log("query param - ", req.query)
// console.log("query param - ", req.body)
//   if (req.query.search == "true") {
//     console.log("--------------------------------------------------", videos)

//     collection.find({}, {fields:{ title: req.body.title, genre: req.body.geners }},
//       function(err, videos) {
//         console.log("--------------------------------------------------", videos)
//         if (err) throw err;

//         res.render('index', { results : videos });
//       });
//   } else {
//     collection.find({}, function (err, videos) {
//       if (err) throw err;

//       res.render('index', { results : videos });
//   });
//   }


// });

// router.post('/videos', function(req, res) {



//   var title = req.body.title
//   var genre = req.body.genre
//   var image = req.body.image
//   var desc = req.body.desc

//   var obj = {
//     title: title,
//     genre: genre,
//     description: desc,
//     image: image
//   }

//       collection.insert(obj,
//           function(err) {
//             if (err) throw err;
//         });

//   res.redirect('/')
// });

// router.get('/videos/new', function(req, res) {

//   res.render('new')
// });


// router.get('/videos/:id', function(req, res) {

//   collection.findOne({ _id: req.params.id }, 
//     function (err, video) {
//       if (err) throw err;

//       res.render('show', { video : video });
//   });
// });

// router.get('/videos/:id/edit', function(req, res) {


//   collection.findOne({ _id: req.params.id }, 
//     function (err, video) {
//       if (err) throw err;
//       console.log("id in edit router ", video)
//       res.render('edit', { video : video });
//   });
// });

// router.post('/videos/:id', function(req, res) {

//   if (req.query._method == "DELETE") {
//     collection.remove({ _id: req.params.id },
//       function (err) {
//         if (err) {
//           console.log("error is ", err)
//           throw err;
//         }
//         res.redirect('/videos');
//       });
//   }

//   if (req.query._method == "PUT") {
//     var title = req.body.title
//     var genre = req.body.genre
//     var image = req.body.image
//     var desc = req.body.desc

//     var obj = {
//       title: title,
//       genre: genre,
//       description: desc,
//       image: image
//     }
//     collection.update({ _id: req.params.id }, {$set: {
//       title: title,
//       genre: genre,
//       image: image,
//       description: desc
//     }})
//     res.redirect('/videos');
//   }


// });




module.exports = router;