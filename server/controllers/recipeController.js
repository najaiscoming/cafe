require('../models/database');
const Category = require('../models/Category')
const Recipe = require('../models/Recipe')


// GET Homepage
exports.homepage = async(req, res) => {

    try {
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
        const cappuccino = await Recipe.find({ 'category': 'Cappuccino' }).limit(limitNumber)
        const americano = await Recipe.find({ 'category': 'Americano' }).limit(limitNumber)
        const espresso = await Recipe.find({ 'category': 'Espresso' }).limit(limitNumber)
        const coffee = { latest, cappuccino, americano, espresso };
        res.render('index', { title: 'Cafe - Home', categories, coffee });
    } catch (error) {
        res.satus(500).send({message: error.message || "Error Occured"})
    }
}

// GET /categories

exports.exploreCategories = async(req, res) => {

    try {
        const limitNumber = 6;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories', { title: 'Cafe - Categories', categories });
    } catch (error) {
        res.satus(500).send({message: error.message || "Error Occured"})
    }
}

// GET /categories/:id

exports.exploreCategoriesById = async(req, res) => { 
    try {
      let categoryId = req.params.id;
      const limitNumber = 20;
      const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
      res.render('categories', { title: 'Cafe - Categoreis', categoryById } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 


// GET /recipe/:id

exports.exploreRecipe = async(req, res) => {
    try {
      let recipeId = req.params.id;
      const recipe = await Recipe.findById(recipeId);
      res.render('recipe', { title: 'Cafe - Recipe', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 


// POST /search

exports.searchRecipe = async(req, res) => {
    try {
      let searchTerm = req.body.searchTerm;
      let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
      res.render('search', { title: 'Cafe - Search', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  }

  
// GET /explore-latest

exports.exploreLatest = async(req, res) => {
    try {
      const limitNumber = 20;
      const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
      res.render('explore-latest', { title: 'Cafe - Explore Latest', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 


// GET /explore-random

exports.exploreRandom = async(req, res) => {
    try {
      let count = await Recipe.find().countDocuments();
      let random = Math.floor(Math.random() * count);
      let recipe = await Recipe.findOne().skip(random).exec();
      res.render('explore-random', { title: 'Cafe - Explore Latest', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 

// GET submit recipe
exports.submitRecipe = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', { title: 'Cafe - Submit Recipe', infoErrorsObj, infoSubmitObj } );
} 

// POST submit recipe

exports.submitRecipeOnPost = async(req, res) => {

  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err) {
        if(err) return res.status(500).send(err);
      })

    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });

    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.');
    res.redirect('/submit-recipe');
  } catch(error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
} 

// INFO

exports.about = async(req, res) => {
  res.render('about', { title: 'Cafe - About'} );
} 

exports.contact = async(req, res) => {
  res.render('contact', { title: 'Cafe - Contact'} );
} 






// UPDATE inside Database
// async function updateRecipe() {
//   try {
//     const res = await Recipe.updateOne({ name: 'a'}, {name: 'a test'});
//     res.n;
//     res.nModified;
//   } catch(error) {
//     console.log(error);
//   }
// }
// updateRecipe();


// Delete inside Database
// async function deleteRecipe() {
//   try {
//     await Recipe.deleteOne({ name: 'test'});
//   } catch(error) {
//     console.log(error);
//   }
// }
// deleteRecipe();










// async function insertDummyCategoryData(){

//     try {
//         await Category.insertMany([
//                    {
//                      "name": "Cappuccino",
//                      "image": "l1.png"
//                    },
//                    {
//                      "name": "Americano",
//                      "image": "l2.png"
//                    }, 
//                    {
//                      "name": "Espresso",
//                      "image": "l3.png"
//                    },
//                    {
//                      "name": "Macchiato",
//                      "image": "l4.png"
//                    }, 
//                    {
//                      "name": "Mocha",
//                      "image": "l5.png"
//                    },
//                    {
//                      "name": "Latte",
//                      "image": "l6.png"
//                    }
//                  ]);

//     } catch (error) {
//         console.log('err', + error)
//     }
// }

// insertDummyCategoryData();


// async function insertDymmyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       { 
//         "name": "Cappuccino Mix",
//         "description": `
//         - Mash orange peel with a mortar and pestle.
//         - Stir ingredients together.
//         - Process in a blender until powdered.
//         - Use 2 Tablespoons for each cup of hot water. Makes about 2 1/4 cups of mix.
//         `,
//         "email": "naja@test.com",
//         "ingredients": [
//           "1/2 cup Instant Coffee",
//           "3/4 cup Sugar",
//           "1 c Nonfat Dry Milk",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "Cappuccino", 
//         "image": "c1.jpg"
//       },
//       {
//         "name": "Classic Cappuccino Espresso Drinks",
//         "description": `
//         Tools Needed
//         - Espresso brewing device
//         - Milk frother or a whisk and a glass

//         - Pour the espresso into a mug.
//         - Place the milk in a wide glass or glass jar and microwave on high power for 30 seconds until it is very hot but not boiling.
//         Alternatively, heat the milk in a saucepan over medium heat for about 5 minutes until very hot but not boiling, watching it carefully.
//         - Using a milk frother, froth the milk until you don't see any bubbles and you have a very thick froth, 20 to 30 seconds.
//         - Swirl the glass and lightly tap it on the counter repeatedly to pop the larger bubbles. Repeat this step as needed.
//         - Using a spoon to hold back the foam (it should be mostly foam), pour the milk into the espresso. Spoon the remaining foam on top
//         `,
//         "email": "naja@test.com",
//         "ingredients": [
//           "2 ounces Espresso",
//           "4 ounces Milk",
//         ],
//         "category": "Cappuccino", 
//         "image": "c2.jpg",
//       },

//       {
//         "name": "Classic Flat White Espresso Drinks",
//         "description": `
//         Tools Needed
//         - Espresso brewing device
//         - Milk frother or a whisk and a glass

//         PREPARE COFFEE
//         - Pour the espresso into a mug.
//         - Place the milk in a wide glass or glass jar and microwave for 30 seconds until it is very hot but not boiling.
//         Alternatively, heat the milk in a saucepan over medium heat for about 5 minutes until very hot but not boiling, watching it carefully.
//         - Using a milk frother, froth the milk until you don’t see any bubbles and you have a very thick froth, 20 to 30 seconds.
//         - Swirl the glass and lightly tap it on the counter repeatedly to pop the larger bubbles. Repeat this step as needed.
//         - Scoop out and discard any foam on top of the steamed milk. Pour the milk into the center of the espresso, making a tiny white circle in the middle.
//         `,
//         "email": "naja@test.com",
//         "ingredients": [
//           "2 ounces Espresso",
//           "4 ounces Milk",
//         ],
//         "category": "Espresso", 
//         "image": "c3.jpg",
//       },

//       {
//         "name": "Classic Cortado Espresso Drinks",
//         "description": `
//         Tools Needed
//         - Espresso brewing device
//         - Milk frother or a whisk and a glass

// 	    PREPARE COFFEE
//         - Pour the espresso into a mug.
//         - Place the milk in a wide glass or glass jar and microwave for 20 to 30 seconds until it is very hot but not boiling, watching it carefully. If you have a food thermometer, aim for between 115°F and 125°F.
//         - Using a milk frother, froth the milk only until you have a very light froth, about 10 seconds.
//         - Swirl the glass and lightly tap it on the counter repeatedly to pop the larger bubbles. Repeat this step as needed.
//         - Pour the milk into the espresso.
//         `,
//         "email": "naja@test.com",
//         "ingredients": [
//           "2 ounces Espresso",
//           "2 ounces Milk",
//         ],
//         "category": "Espresso", 
//         "image": "c4.jpg",
//       },

//       {
//         "name": "Classic Cubano Espresso Drinks",
//         "description": `
//         Tools Needed
//         - Espresso brewing device
//         - Milk frother or a whisk and a glass

//         PREPARE COFFEE
//         - Pour the espresso into a mug and add the sugar.
//         - Place the half-and-half in a wide glass or glass jar and microwave for 20 to 30 seconds until it is very hot but not boiling.
//         Alternatively, heat the milk in a saucepan over medium heat for about 5 minutes until very hot but not boiling, watching it carefully.
//         - Using a milk frother, froth the half-and-half until you don't see any bubbles and you have a medium-thick froth, 20 to 30 seconds.
//         - Swirl the glass and lightly tap it on the counter repeatedly to pop the larger bubbles. Repeat this step as needed.
//         - Using a spoon to hold back the foam, pour the half-and-half into the espresso. Spoon the remaining foam on top.
//         - Sprinkle on a pinch of sea salt to finish.
//         `,
//         "email": "naja@test.com",
//         "ingredients": [
//           "2 ounces Espresso",
//           "1 teaspoon raw Sugar",
//           "10 ounces Half & Half",
//           "Pinch sea Salt",
//         ],
//         "category": "Espresso", 
//         "image": "c5.jpg",
//       },

//       {
//         "name": "Classic Americano Espresso Drinks",
//         "description": `
//         Tools Needed
//         - Espresso brewing device

//         PREPARE COFFEE
//         - Simply boil water around 200 ml or 6 oz or 2/3 cup and pour in a cup or mug.
//         - Extract 1 shot of espresso around 75 ml or 2 oz (more if you like it stronger) over the hot water.
//         - Enjoy it black or add cream and sugar, as you like.
//         `,
//         "email": "naja@test.com",
//         "ingredients": [
//           "2 ounces Espresso",
//           "6 to 10 ounces hot Water",
//           "for serving Cream",
//           "for serving Sugar",
//         ],
//         "category": "Americano", 
//         "image": "c6.jpg",
//       },

//       {
//         "name": "Classic Red Eye Espresso Drinks",
//         "description": `
//         Tools Needed
//         - Espresso brewing device
//         - Coffee brewing device

//         PREPARE COFFEE
//         - In a mug, combine the espresso and coffee.
//         - Enjoy it black or add cream and sugar to taste.
//         `,
//         "email": "naja@test.com",
//         "ingredients": [
//           "2 ounces Espresso",
//           "10 ounces brewed Coffee",
//           "for serving Cream",
//           "for serving Sugar"
//         ],
//         "category": "Espresso", 
//         "image": "c7.jpg",
//       },

//       {
//         "name": "Classic Espresso Con Panna Drinks",
//         "description": `
//         Tools Needed
//         - Espresso brewing device

//         PREPARE COFFEE
//         Pour the espresso into a mug and add a dollop of whipped cream on top.
//         `,
//         "email": "naja@test.com",
//         "ingredients": [
//           "2 ounces Espresso",
//           "for Topping Whipped Cream",
//         ],
//         "category": "Espresso", 
//         "image": "c8.jpg",
//       },

//       {
//         "name": "Classic Breve Espresso Drinks",
//         "description": `
//         Tools Needed
//         - Espresso brewing device
//         - Milk frother or a whisk and a glass

//         PREPARE COFFEE
//         - Pour the espresso into a mug.
//         - Place the half-and-half in a wide glass or glass jar and microwave for 20 to 30 seconds until it is very hot but not boiling.
//         Alternatively, heat the half-and-half in a saucepan over medium heat for about 5 minutes until very hot but not boiling, watching it carefully.
//         - Using a milk frother, froth the half-and-half until you don’t see any bubbles and you have a medium-thick froth, 20 to 30 seconds.
//         - Swirl the glass and lightly tap it on the counter repeatedly to pop the larger bubbles. Repeat this step as needed.
//         - Using a spoon to hold back the foam, pour the half-and-half into the espresso. Spoon the remaining foam on top.
//         `,
//         "email": "naja@test.com",
//         "ingredients": [
//           "2 ounces Espresso",
//           "10 ounces Half&Half",
//         ],
//         "category": "Espresso", 
//         "image": "c9.jpg",
//       },

//       {
//         "name": "Classic Macchiato Espresso Drinks",
//         "description": `
//         Tools Needed
//         - Espresso brewing device
//         - Milk frother or a whisk and a glass

//         PREPARE COFFEE
//         - Pour the espresso into a mug.
//         - Place the milk in a wide glass or glass jar and microwave for 30 seconds until it is very hot but not boiling.
//         Alternatively, heat the milk in a saucepan over medium heat for about 5 minutes until very hot but not boiling, watching it carefully.
//         - Using a milk frother, froth the milk until you don’t see any bubbles and you have a very thick froth, 20 to 30 seconds.
//         - Swirl the glass and lightly tap it on the counter repeatedly to pop the larger bubbles. Repeat this step as needed.
//         - Scoop out a dollop of foam and put it on top of your espresso.
//         `,
//         "email": "naja@test.com",
//         "ingredients": [
//           "2 ounces Espresso",
//           "1 ounces Milk",
//         ],
//         "category": "Macchiato", 
//         "image": "c10.jpg",
//       },

//       {
//         "name": "Classic Café Latte Espresso Drinks",
//         "description": `
//         Tool Needed
//         - Espresso brewing device
//         - Milk frother or a whisk and a glass
//         PREPARE LATTE
//         - Pour the espresso into a mug.
//         - Place the milk in a wide glass or glass jar and microwave for about 30 seconds until it is very hot but not boiling.
//         Alternatively, heat the milk in a saucepan over medium heat for about 5 minutes until very hot but not boiling, watching it carefully.
//         - Using a milk frother, froth the milk until you don’t see any bubbles and you have a very thick froth, 20 to 30 seconds.
//         - Swirl the glass and lightly tap it on the counter repeatedly to pop the larger bubbles. Repeat this step as needed.
//         - Using a spoon to hold back the foam, pour the milk into the espresso. Spoon the remaining foam on top.
//         `,
//         "email": "naja@test.com",
//         "ingredients": [
//           "2 ounces Espresso",
//           "10 ounces Milk",
//         ],
//         "category": "Latte", 
//         "image": "c11.jpg",
//       },

//       {
//         "name": "Black Forest Mocha Coffee",
//         "description": `
//         MIX ALL INGREDIENTS
//         - Make fresh, hot, strong coffee and keep warm until ready to mix.
//         - With a hand blender combine coffee, chocolate syrup, and cherry juice in a cup; mix well until it is smooth, thick and creamy.
//         - Pour the coffee into a larger coffee mug (the larger the mug - the more room for whipped cream).
//         - Add the chocolate syrup and cherry juice and stir.
//         - Top generously with whipped cream, chocolate shavings and a cherry.
//         - Serves & Enjoy!
//         `,
//         "email": "naja@test.com",
//         "ingredients": [
//           "6 oz Fresh Brewed Coffee or Espresso",
//           "2 tablespoon Chocolate Syrup",
//           "1 tablespoonMaraschino Cherry Juice",
//           "Whipped Cream",
//           "Shaved Chips/ Chocolate",
//           "Maraschino Cherries",
//         ],
//         "category": "Mocha", 
//         "image": "c12.jpg",
//       },

//       {
//         "name": "Hot Rum Mocha",
//         "description": `
//         MIX ALL INGREDIENTS
//         - In a medium-size saucepan over medium-low heat combine: Half & Half (Cream and Milk), Dark Chocolate. Stir until chocolate is fully melted.
//         - Reduce the heat to low and add Amber Aged Rum, Kahlúa, Amaretto, Strong hot coffee.
//         - Using a hand mixer, blend the ingredients in the saucepan over very low heat until well blended and frothy.
//         - Pour into warm mug (pre-warm by filling it with hot water. Let sit for a minute then empty)
//         - Top with softly Whipped Cream, and float Banana Liqueur over top.
//         - Serve & Enjoy!
//         `,
//         "email": "naja@test.com",
//         "ingredients": [
//           "2 oz Half & Half",
//           "About 1/2 a bar or 2 Dark Chocolate",
//           "1.5 oz Amber Aged Rum",
//           "1/2 oz Kahlúa",
//           "3 oz Strong Hot Coffee or Espresso",
//           "Whipped Cream",
//           "Banana Liqueur",
//         ],
//         "category": "Mocha", 
//         "image": "c13.jpg",
//       },

//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();