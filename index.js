const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Create express app
const app = express();
const port = 5000;


const swaggerOptions = {
    swaggerDefinition: {
        info: {
            itle:'Chick Fil A Website',
            version: '1.0.0',
            description: 'Website for Chick Fil A customers, servers, and managers.'
        }
    },
    apis:['index.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));


const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = "929197340915-rtv5p06u87gjq3cbipg7224mm16dt495.apps.googleusercontent.com"
const client = new OAuth2Client(CLIENT_ID);

// Create pool
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

// Add process hook to shutdown pool
process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    const data = {name: 'Sana'};
    res.render('index', data);
});

// SERVER *****************************************************

// entrees
/**
* @swagger
* /entrees:
*   get:
*     tags:
*       - Server Entrees
*     summary: Getting Entrees for Server side
*     description: Reading from the database the menu items that are under the 'entrees' category.
*     parameters:
*       - name: entree_items
*         in: query
*         description: is a list of entree items from the menu
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/
app.get('/entrees', checkAuthenticatedServer, (req, res) => {
    entree_items = []
    pool
        .query('SELECT * FROM menu_items WHERE category=\'entree\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                entree_items.push(query_res.rows[i]);
            }
            const data = {entree_items: entree_items};
            // console.log(entree_items);
            res.render('entrees', data);
        });
});

// waffle fries
/**
* @swagger
* /waffle_fries:
*   get:
*     tags:
*       - Server Waffle Fries
*     summary: Getting Waffle Fries for Server side
*     description: Reading from the database the menu items that are under the 'waffle fries' category.
*     parameters:
*       - name: waf_items
*         in: query
*         description: is a list of waffle fries items from the menu
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/
app.get('/waffle_fries', checkAuthenticatedServer, (req, res) => {
    waf_items = []
    pool
        .query('SELECT * FROM menu_items WHERE category=\'waffle fries\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                waf_items.push(query_res.rows[i]);
            }
            const data = {waf_items: waf_items};
            res.render('waffle_fries', data);
        });
});

// nugget entrees
/**
* @swagger
* /nuggets:
*   get:
*     tags:
*       - Server Nugget Entrees
*     summary: Getting Nugget Entrees for Server side
*     description: Reading from the database the menu items that are under the 'nugget entrees' category.
*     parameters:
*       - name: nugget_items
*         in: query
*         description: is a list of nugget entree items from the menu
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/
app.get('/nuggets', checkAuthenticatedServer, (req, res) => {
    nugget_items = []
    pool
        .query('SELECT * FROM menu_items WHERE category=\'nugget entrees\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                nugget_items.push(query_res.rows[i]);
            }
            const data = {nugget_items: nugget_items};
            res.render('nuggets', data);
        });
});

// sides
/**
* @swagger
* /sides:
*   get:
*     tags:
*       - Server Sides
*     summary: Getting Sides for Server side
*     description: Reading from the database the menu items that are under the 'sides' category.
*     parameters:
*       - name: sides
*         in: query
*         description: is a list of side items from the menu
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

app.get('/sides', checkAuthenticatedServer, (req, res) => {
    sides = []
    pool
        .query('SELECT * FROM menu_items WHERE category=\'sides\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                sides.push(query_res.rows[i]);
            }
            const data = {sides: sides};
            res.render('sides', data);
        });
});

// drinks
/**
* @swagger
* /drinks:
*   get:
*     tags:
*       - Server Drinks
*     summary: Getting Drinks for Sever side
*     description: Reading from the database the menu items that are under the 'drinks' category.
*     parameters:
*       - name: drinks
*         in: query
*         description: is a list of drink items from the menu
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

app.get('/drinks', checkAuthenticatedServer, (req, res) => {
    drinks = []
    pool
        .query('SELECT * FROM menu_items WHERE category=\'drinks\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                drinks.push(query_res.rows[i]);
            }
            const data = {drinks: drinks};
            res.render('drinks', data);
        });
});

// desserts
/**
* @swagger
* /desserts:
*   get:
*     tags:
*       - Server Desserts
*     summary: Getting Desserts for Server side
*     description: Reading from the database the menu items that are under the 'desserts' category.
*     parameters:
*       - name: desserts
*         in: query
*         description: is a list of dessert items from the menu
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

app.get('/desserts', checkAuthenticatedServer, (req, res) => {
    desserts = []
    pool
        .query('SELECT * FROM menu_items WHERE category=\'desserts\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                desserts.push(query_res.rows[i]);
            }
            const data = {desserts: desserts};
            res.render('desserts', data);
        });
});

// salads
/**
* @swagger
* /salads:
*   get:
*     tags:
*       - Server Salads
*     summary: Getting Salads for Server side
*     description: Reading from the database the menu items that are under the 'salads' category.
*     parameters:
*       - name: salads
*         in: query
*         description: is a list of salad items from the menu
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

app.get('/salads', checkAuthenticatedServer, (req, res) => {
    salads = []
    pool
        .query('SELECT * FROM menu_items WHERE category=\'salads\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                salads.push(query_res.rows[i]);
            }
            const data = {salads: salads};
            res.render('salads', data);
        });
});

// dressings
/**
* @swagger
* /dressings:
*   get:
*     tags:
*       - Server Dressings
*     summary: Getting Dressings for Server side
*     description: Reading from the database the menu items that are under the 'dressings' category.
*     parameters:
*       - name: dressings
*         in: query
*         description: is a list of dressing items from the menu
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

app.get('/dressings', checkAuthenticatedServer, (req, res) => {
    dressings = []
    pool
        .query('SELECT * FROM menu_items WHERE category=\'dressings\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                dressings.push(query_res.rows[i]);
            }
            const data = {dressings: dressings};
            res.render('dressings', data);
        });
});

// sauces
/**
* @swagger
* /sauces:
*   get:
*     tags:
*       - Server Sauces
*     summary: Getting Sauces for Server side
*     description: Reading from the database the menu items that are under the 'sauces' category.
*     parameters:
*       - name: sauces
*         in: query
*         description: is a list of sauce items from the menu
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

app.get('/sauces', checkAuthenticatedServer, (req, res) => {
    sauces = []
    pool
        .query('SELECT * FROM menu_items WHERE category=\'sauces\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                sauces.push(query_res.rows[i]);
            }
            const data = {sauces: sauces};
            res.render('sauces', data);
        });
});

/**
* @swagger
* /entreeform:
*   post:
*     tags:
*       - Server Current Order
*     summary: Inserts to 'current_order' table
*     description: Inserts into 'current_order' table in database to keep track of what items the customer has added to their cart.
*
*/

app.post('/entreeform', checkAuthenticatedServer, (req, res) => {
   
    pool.query("INSERT INTO current_order (order_id, item_id, item_name, item_price, side) VALUES (((select max(id) from orders)+1), $1, $2, $3, 1);",
    [req.body.itemid, req.body.itemname, req.body.itemprice], (err, results) => {
        if (err){
            console.log(err);
        }

        // console.log(req.body.itemname);
        // console.log('/' + req.body.page);
        // res.redirect('/' + req.body.page);
        
    });

    res.redirect('/server');
});

/**
* @swagger
* /deleteitem:
*   post:
*     tags:
*       - Server Delete Item
*     summary: Deletes item from 'current_order' table
*     description: Deletes the item the customer had selected that was in their cart. Essentially, deletes the row containing that item from the 'current_order' table in the database.
*
*/

app.post('/deleteitem', (req, res) => {

    pool.query("DELETE FROM current_order WHERE item_id=$1 and side=1 and row_id=$2;",
    [req.body.currentitemid, req.body.currentrowid], (err, results) => {
        if (err){
            console.log(err);
        }
    });
 
    res.redirect('/server');
});

/**
* @swagger
* /deletetable:
*   post:
*     tags:
*       - Server Submits Order
*     summary: Server Submits Order
*     description: When server submits their order, their order in table 'current_order' is copied to the 'orders' and 'order_items' table then deleted from 'current_order'. 
*     parameters:
*       - name: date
*         in: query
*         description: a variable holding the current date.
*         required: false
*       - name: timestamp
*         in: query
*         description: a variable holding the timestamp formatting needed to be inserted into the 'orders' table in the database.
*         required: false
*/

app.post('/deletetable', (req, res) => {

    let date = new Date(Date.now());
    //console.log(date.toISOString().split('T')[0]);
    var timestamp = date.getUTCFullYear() + "-" + date.toISOString().substr(5,2) + "-" + date.getDate() + " " + date.getHours() + ":" + date.toISOString().substr(14,5);
    //console.log(timestamp);


    pool.query("INSERT INTO orders (employee_id, total_price, time_stamp) VALUES (24, $1, $2);",
    [req.body.totalprice, timestamp], (err, results) => {
        if (err){
            console.log(err);
        }

        for (var i=0, len=current_items.length; i<len; i++) {
                pool.query("INSERT INTO order_items (order_id, menu_id) VALUES ($1, $2);",
                [current_items[i].order_id, current_items[i].item_id], (err, results) => {
                    if (err){
                        console.log(err);
                    }
                });
            }
    
    });


    pool.query("DELETE FROM current_order where side=1;", (err, results) => {
        if (err){
            console.log(err);
        }
    });

    res.redirect('/start');

});

/**
* @swagger
* /server:
*   get:
*     tags:
*       - Server
*     summary: Getting current order for Server side
*     description: Reading from the database the current order items that are under the server category.
*     parameters:
*       - name: current_items
*         in: query
*         description: is a list of menu items from the current order
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/
app.get('/server', checkAuthenticatedServer, (req, res) => {
    // select current_order
    current_items = []
    var total = 0.0;

    
    pool
        .query('SELECT * FROM current_order where side=1;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                current_items.push(query_res.rows[i]);
                //console.log(current_items[i].item_id);
            }
            const data = {current_items: current_items};
            res.render('server', data);
        });
});

/**
* @swagger
* /start:
*   get:
*     tags:
*       - Server Start Order
*     summary: Getting next order number
*     description: Reading from the database the current order number to use when submitting the order.
*     parameters:
*       - name: orders
*         in: query
*         description: contains the order number
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/
app.get('/start',checkAuthenticatedServer, (req, res) => {
    orders = []
    
    pool
        .query('SELECT * FROM orders WHERE id=(SELECT max(id) FROM orders);')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                orders.push(query_res.rows[i]);
                //console.log(orders[i].item_id);
            }
            const data = {orders: orders};
            res.render('start', data);
        });
});

// SERVER LOGIN
/**
 * @swagger
 * /serverLogin:
 *   get:
 *     description: Renders the serverLogin
 * 
 */

app.get('/serverLogin', (req, res) => {
    res.render('serverLogin');
});

/**
 * @swagger
 * /serverLogin:
 *   post:
 *     description: Verifies token with google API. If token is verified, a session-token cookie is created. Else, error is thrown to console and no cookie is created
 */

app.post('/serverLogin', (req, res) => {
    let token = req.body.token;
    console.log(token);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log(payload);
      }
      verify()
      .then(()=>{
        res.cookie('session-token', token);
        console.log("created session-token");
        res.send('success');
      }).catch(console.error);
});

/**
 * @swagger
 * /serverLogout:
 *   get:
 *     description: Clears the session-token cookie and renders the index page.
 * 
 */

app.get('/serverLogout', (req, res)=>{
    res.clearCookie('session-token');
    res.redirect('/')
})

/**
 * @swagger
 * /checkAuthenticatedServer:
 *   get:
 *     description: Makes sure that the user has the appropiate cookie (permission) to access a page
 *     parameters:
 *       - name: token
 *         description: token is the cookie called "session-token". if the proper cookie is owned by the user, then they are given access
 *         required: false
 * 
 */
function checkAuthenticatedServer(req, res, next){
    let token = req.cookies['session-token'];

    let user = {}
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
    }
    verify()
    .then(()=>{
        req.user = user;
        next();
    })
    .catch(err=>{
        res.redirect('/serverLogin');
    })
}


// CUSTOMER *****************************************************
/**
* @swagger
* /customerentrees:
*   get:
*     tags:
*       - Customer Entrees
*     summary: Getting Entrees for Customer side
*     description: Reading from the database the menu items that are under the 'entrees' category.
*     parameters:
*       - name: entree_items
*         in: query
*         description: is a list of entree items from the menu
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/
// entrees
app.get('/customerentrees', (req, res) => {
    entree_items = []
    pool
        .query('SELECT * FROM menu_items WHERE category=\'entree\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                entree_items.push(query_res.rows[i]);
            }
            const data = {entree_items: entree_items};
            // console.log(entree_items);
            res.render('customerentrees', data);
        });
});


/**
* @swagger
* /customerwaffle_fries:
*   get:
*     tags:
*       - Customer Waffle Fries
*     summary: Getting Waffle Fries for Customer side
*     description: Reading from the database the menu items that are under the 'waffle fries' category.
*     parameters:
*       - name: waf_items
*         in: query
*         description: is a list of waffle fries items from the menu
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/
// waffle fries
app.get('/customerwaffle_fries', (req, res) => {
    waf_items = []
    pool
        .query('SELECT * FROM menu_items WHERE category=\'waffle fries\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                waf_items.push(query_res.rows[i]);
            }
            const data = {waf_items: waf_items};
            res.render('customerwaffle_fries', data);
        });
});

/**
* @swagger
* /customernuggets:
*   get:
*     tags:
*       - Customer Nugget Entrees
*     summary: Getting Nugget Entrees for Customer side
*     description: Reading from the database the menu items that are under the 'nugget entrees' category.
*     parameters:
*       - name: nugget_items
*         in: query
*         description: is a list of nugget entree items from the menu
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/
// nugget entrees
app.get('/customernuggets', (req, res) => {
    nugget_items = []
    pool
        .query('SELECT * FROM menu_items WHERE category=\'nugget entrees\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                nugget_items.push(query_res.rows[i]);
            }
            const data = {nugget_items: nugget_items};
            res.render('customernuggets', data);
        });
});


/**
* @swagger
* /customersides:
*   get:
*     tags:
*       - Customer Sides
*     summary: Getting Sides for Customer side
*     description: Reading from the database the menu items that are under the 'sides' category.
*     parameters:
*       - name: sides
*         in: query
*         description: is a list of side items from the menu
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/
// sides
app.get('/customersides', (req, res) => {
    sides = []
    pool
        .query('SELECT * FROM menu_items WHERE category=\'sides\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                sides.push(query_res.rows[i]);
            }
            const data = {sides: sides};
            res.render('customersides', data);
        });
});


/**
* @swagger
* /customerdrinks:
*   get:
*     tags:
*       - Customer Drinks
*     summary: Getting Drinks for Customer side
*     description: Reading from the database the menu items that are under the 'drinks' category.
*     parameters:
*       - name: drinks
*         in: query
*         description: is a list of drink items from the menu
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/
// drinks
app.get('/customerdrinks', (req, res) => {
    drinks = []
    pool
        .query('SELECT * FROM menu_items WHERE category=\'drinks\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                drinks.push(query_res.rows[i]);
            }
            const data = {drinks: drinks};
            res.render('customerdrinks', data);
        });
});


/**
* @swagger
* /customerdesserts:
*   get:
*     tags:
*       - Customer Desserts
*     summary: Getting Desserts for Customer side
*     description: Reading from the database the menu items that are under the 'desserts' category.
*     parameters:
*       - name: desserts
*         in: query
*         description: is a list of dessert items from the menu
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/
// desserts
app.get('/customerdesserts', (req, res) => {
    desserts = []
    pool
        .query('SELECT * FROM menu_items WHERE category=\'desserts\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                desserts.push(query_res.rows[i]);
            }
            const data = {desserts: desserts};
            res.render('customerdesserts', data);
        });
});


/**
* @swagger
* /customersalads:
*   get:
*     tags:
*       - Customer Salads
*     summary: Getting Salads for Customer side
*     description: Reading from the database the menu items that are under the 'salads' category.
*     parameters:
*       - name: salads
*         in: query
*         description: is a list of salad items from the menu
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/
// salads
app.get('/customersalads', (req, res) => {
    salads = []
    pool
        .query('SELECT * FROM menu_items WHERE category=\'salads\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                salads.push(query_res.rows[i]);
            }
            const data = {salads: salads};
            res.render('customersalads', data);
        });
});


/**
* @swagger
* /customerdressings:
*   get:
*     tags:
*       - Customer Dressings
*     summary: Getting Dressings for Customer side
*     description: Reading from the database the menu items that are under the 'dressings' category.
*     parameters:
*       - name: dressings
*         in: query
*         description: is a list of dressing items from the menu
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/
// dressings
app.get('/customerdressings', (req, res) => {
    dressings = []
    pool
        .query('SELECT * FROM menu_items WHERE category=\'dressings\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                dressings.push(query_res.rows[i]);
            }
            const data = {dressings: dressings};
            res.render('customerdressings', data);
        });
});


/**
* @swagger
* /customersauces:
*   get:
*     tags:
*       - Customer Sauces
*     summary: Getting Sauces for Customer side
*     description: Reading from the database the menu items that are under the 'sauces' category.
*     parameters:
*       - name: sauces
*         in: query
*         description: is a list of sauce items from the menu
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/
// sauces
app.get('/customersauces', (req, res) => {
    sauces = []
    pool
        .query('SELECT * FROM menu_items WHERE category=\'sauces\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                sauces.push(query_res.rows[i]);
            }
            const data = {sauces: sauces};
            res.render('customersauces', data);
        });
});


app.get('/', (req, res) => {
    const data = {name: 'Sana'};
    res.render('index', data);
});


/**
* @swagger
* /customerentreeform:
*   post:
*     tags:
*       - Customer Current Order
*     summary: Inserts to 'current_order' table
*     description: Inserts into 'current_order' table in database to keep track of what items the customer has added to their cart.
*
*/
app.post('/customerentreeform', (req, res) => {
    //var menuitemid = req.body.itemid;
    
    //console.log(req.body.itemid);

    pool.query("INSERT INTO current_order (order_id, item_id, item_name, item_price, side) VALUES (((select max(id) from orders)+1), $1, $2, $3, 2);",
    [req.body.itemid, req.body.itemname, req.body.itemprice], (err, results) => {
        if (err){
            console.log(err);
        }
    });
    
});


/**
* @swagger
* /customerdeleteitem:
*   post:
*     tags:
*       - Customer Delete Item
*     summary: Deletes item from 'current_order' table
*     description: Deletes the item the customer had selected that was in their cart. Essentially, deletes the row containing that item from the 'current_order' table in the database.
*
*/
app.post('/customerdeleteitem', (req, res) => {

    // console.log('HI');
    // console.log(req.body.currentitemid);

    pool.query("DELETE FROM current_order WHERE item_id=$1 and side= 2 and row_id=$2;",
    [req.body.currentitemid, req.body.currentrowid], (err, results) => {
        if (err){
            console.log(err);
        }
    });
 
    res.redirect('/customerorderpage');

});


/**
* @swagger
* /customerdeletetable:
*   post:
*     tags:
*       - Customer Submits Order
*     summary: Customer Submits Order
*     description: When customer submits their order, their order in table 'current_order' is copied to the 'orders' and 'order_items' table then deleted from 'current_order'. 
*     parameters:
*       - name: date
*         in: query
*         description: a variable holding the current date.
*         required: false
*       - name: timestamp
*         in: query
*         description: a variable holding the timestamp formatting needed to be inserted into the 'orders' table in the database.
*         required: false
*/
app.post('/customerdeletetable', (req, res) => {

    let date = new Date(Date.now());
    //console.log(date.toISOString().split('T')[0]);
    var timestamp = date.getUTCFullYear() + "-" + date.toISOString().substr(5,2) + "-" + date.getDate() + " " + date.getHours() + ":" + date.toISOString().substr(14,5);
    //console.log(timestamp);

    pool
        .query("INSERT INTO orders (employee_id, total_price, time_stamp) VALUES (23, $1, $2);",
        [req.body.totalprice, timestamp], (err, results) => {
            if (err){
                console.log(err);
            }
            for (var i=0, len=current_items.length; i<len; i++) {
                pool.query("INSERT INTO order_items (order_id, menu_id) VALUES ($1, $2);",
                [current_items[i].order_id, current_items[i].item_id], (err, results) => {
                    if (err){
                        console.log(err);
                    }
                });
            }
        });

    pool.query("DELETE FROM current_order where side= 2;", (err, results) => {
        if (err){
            console.log(err);
        }
    });

    res.redirect('/customerorderconfirmation');
});


/**
* @swagger
* /customer:
*   get:
*     tags:
*       - First Customer Page
*     summary: Gets Entrees for Customer side
*     description: Reading from the database the menu items that are under the 'entrees' category.
*     parameters:
*       - name: entree_items
*         in: query
*         description: is a list of entree items from the menu
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/
app.get('/customer', (req, res) => {
    entree_items = []
    pool
        .query('SELECT * FROM menu_items WHERE category=\'entree\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                entree_items.push(query_res.rows[i]);
            }
            const data = {entree_items: entree_items};
            // console.log(entree_items);
            res.render('customer', data);
        });
});

/**
* @swagger
* /customerorderpage:
*   get:
*     tags:
*       - Customer Order Page
*     summary: Customer can view their order
*     description: This allows the customer to view what they've added to their order (like a cart) which is read from the 'current_order' table in the database.
*     parameters:
*       - name: current_items
*         in: query
*         description: a list holding every item the customer added to their order.
*         required: false
*/
app.get('/customerorderpage', (req, res) => {
    // select current_order
    current_items = []

    
    pool
        .query('SELECT * FROM current_order where side=2;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                current_items.push(query_res.rows[i]);
                //console.log(current_items[i].item_id);
            }
            const data = {current_items: current_items};
            res.render('customerorderpage', data);
        });

});


/**
* @swagger
* /customerpayment:
*   get:
*     tags:
*       - Customer Payment Page
*     summary: Customer can view their order and payment details
*     description: This allows the customer to view what they've added to their order (like a cart) which is read from the 'current_order' table in the database as well as see the total price and be able to enter in some payment information.
*     parameters:
*       - name: current_items
*         in: query
*         description: a list holding every item the customer added to their order.
*         required: false
*/
app.get('/customerpayment', (req, res) => {
    current_items = []

    pool
        .query('SELECT * FROM current_order where side=2;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                current_items.push(query_res.rows[i]);
                //console.log(current_items[i].item_id);
            }
            const data = {current_items: current_items};
            res.render('customerpayment', data);
        });
});


/**
* @swagger
* /customerorderconfirmation:
*   get:
*     tags:
*       - Customer Order Confirmation Page
*     summary: Customer can view order details
*     description: This allows the customer to once more view their order's id number and their total price after submitting which is read from the 'orders' table in the database.
*     parameters:
*       - name: order_dets
*         in: query
*         description: a list holding the customer's recent submitted order.
*         required: false
*
*/
app.get('/customerorderconfirmation', (req, res) => {
    orderdets = []
    
    pool
        .query('SELECT * FROM orders where id=(SELECT max(id) from orders where employee_id = 23);')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                orderdets.push(query_res.rows[i]);
                //console.log(current_items[i].item_id);
            }
            const data = {orderdets: orderdets};
            res.render('customerorderconfirmation', data);
        });
});

// MANAGER *****************************************************

/**
 * @swagger
 * /View_Menu:
 *   get:
 *     description: Renders the View_Menu template
 * 
 */
app.get('/View_Menu', (req, res) => {
    res.render('View_Menu')
});

// MANAGER LOGIN
/**
 * @swagger
 * /managerLogin:
 *   get:
 *     description: Renders the ManagerLogin
 * 
 */
app.get('/managerLogin', (req, res) => {
    res.render('ManagerLogin');
});
/**
 * @swagger
 * /managerLogin:
 *   post:
 *     description: Verifies token with google API. If token is verified, a session-token cookie is created. Else, error is thrown to console and no cookie is created
 */
app.post('/managerLogin', (req, res) => {
    let token = req.body.token;
    console.log(token);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log(payload);
      }
      verify()
      .then(()=>{
        res.cookie('session-token', token);
        console.log("created session-token");
        res.send('success');
      }).catch(console.error);
});
/**
 * @swagger
 * /managerLogout:
 *   get:
 *     description: Clears the session-token cookie and renders the index page.
 * 
 */
app.get('/managerLogout', (req, res)=>{
    res.clearCookie('session-token');
    res.redirect('/')
})

/**
 * @swagger
 * /checkAuthenticated:
 *   get:
 *     description: Makes sure that the user has the appropiate cookie (permission) to access a page
 *     parameters:
 *       - name: token
 *         description: token is the cookie called "session-token". if the proper cookie is owned by the user, then they are given access
 *         required: false
 * 
 */
function checkAuthenticated(req, res, next){
    let token = req.cookies['session-token'];

    let user = {}
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.first_name = payload.given_name;
        user.email = payload.email;
        user.picture = payload.picture;
    }
    verify()
    .then(()=>{
        req.user = user;
        next();
    })
    .catch(err=>{
        res.redirect('/managerLogin');
    })
}

/**
* @swagger
* /ManagerHome:
*   get:
*     description: Renders the Manager Home main page
*/

// MANAGER HOME PAGE
app.get('/ManagerHome', checkAuthenticated, (req, res) => {
    let user = req.user;
    res.render('ManagerHome', {user});
});

/**
* @swagger
* /ManageInventory:
*   get:
*     tags:
*       - Page of operations to manage inventory
*     summary: Manager view all operations that can be perfomed on inventory
*     description: Manager can Update inventory, add and delete item
*     parameters:
*       - name: inventory_items
*         in: query
*         description: a list holding all items from inventory
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

// MANAGING INVENTORY
app.get('/ManageInventory', checkAuthenticated, (req, res) => {
    inventory_items = []
    pool
        .query('SELECT * FROM inventory;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                inventory_items.push(query_res.rows[i]);
            }
            const data = {inventory_items: inventory_items};
            res.render('ManageInventory', data);
        });
});

/**
* @swagger
* /update_inventory:
*   post:
*     tags:
*       - Form to update inventory
*     summary: Data on how to update inventory is received
*     description: Manager can update inventory with data received from user,
*                  once manager hits submit, Manager Homep page is rendered with
*                  changes.
*     parameters:
*       - name: inventory_items
*         in: query
*         description: a list holding all items from inventory
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/


// UPDATING INVENTORY
app.post('/update_inventory', (req, res) => {
    console.log(req.body);

    pool.query("UPDATE inventory SET category = $1, unit = $2, cost = $3, quantity = $4 WHERE name = $5",
    [req.body.name[1], req.body.name[2], req.body.name[3], req.body.name[4], req.body.name[0]], (err, results) => {
        if (err){
            console.log("Could not update inventoy");
        }
    });

    inventory_items = []
    pool
        .query('SELECT * FROM inventory;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                inventory_items.push(query_res.rows[i]);
            }
            const data = {inventory_items: inventory_items};
            res.render('ManageInventory', data);
        });
});

/**
* @swagger
* /update_inventory:
*   get:
*     tags:
*       - Updated inventory page
*     summary: Manager Page with updated inventory
*     description: render Manager home page with updated inventory
*     parameters:
*       - name: inventory_items
*         in: query
*         description: a list holding all items from inventory
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

app.get('/update_inventory', (req, res) => {

    inventory_items = []
    pool
        .query('SELECT * FROM inventory;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                inventory_items.push(query_res.rows[i]);
            }
            const data = {inventory_items: inventory_items};
            res.render('ManageInventory', data);
        });
});

/**
* @swagger
* /add_inventory:
*   post:
*     tags:
*       - Add item to inventory
*     summary: Add item to inventory with user data
*     description: Manager can add item to inventory 
*
*/


// ADDING ITEM TO INVENTORY
app.post('/add_inventory', (req, res) => {
    console.log(req.body);

    pool.query("INSERT INTO inventory (name, category, unit, cost, quantity, minimum_quantity) VALUES ($1, $2, $3, $4, $5, $6);",
    [req.body.name[0], req.body.name[1], req.body.name[2], req.body.name[3], req.body.name[4], req.body.name[5]], (err, results) => {
        if (err){
            console.log(err);
        }
    });

    res.redirect('/ManageInventory');
});

/**
* @swagger
* /add_inventory:
*   get:
*     tags:
*       - Add item to inventory
*     summary: Manager page is rendered with updated inventory
*     description: Manager Inventory page is rendered.
*
*/

app.get('/add_inventory', (req, res) => {

    res.redirect('/ManageInventory');

});

/**
* @swagger
* /delete_inventory:
*   post:
*     tags:
*       - Deleting item from inventory
*     summary: Delete item from inventory usring user data
*     description: Manager can delete item from inventory
*
*/

// DELETING ITEM FROM INVENTORY
app.post('/delete_inventory', (req, res) => {
    console.log(req.body);

    pool.query("DELETE FROM inventory WHERE name = $1;",
    [req.body.name], (err, results) => {
        if (err){
            console.log(err);
        }
    });

    res.redirect('/ManageInventory');
    
});

/**
* @swagger
* /delete_inventory:
*   get:
*     description: ManageInventory page is rendered with updated inventory
*
*/

app.get('/delete_inventory', (req, res) => {

    res.redirect('/ManageInventory');

});

/**
* @swagger
* /Order_History:
*   get:
*     tags:
*       - Order History Page
*     summary: Page with list of all ordere placed
*     description: Table of orders contains date order was place and total sales for that day
*     parameters:
*       - name: orders
*         in: query
*         description: a list holding all orders
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

// MANAGER ORDER HISTORY

app.get('/Order_History', checkAuthenticated, (req, res) => {
    orders = []
    pool
        .query('SELECT DATE(time_stamp), SUM(CAST(total_price as numeric)) FROM orders GROUP BY 1 ORDER BY 1;;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                orders.push(query_res.rows[i]);
            }
            const data = {orders: orders};
            res.render('Order_History', data);
        });
});


/**
* @swagger
* /ManageMenu:
*   get:
*     tags:
*       - Manage Menu Page
*     summary: Page with list of all operations manager can perform on Menu
*     description: Chick-Fil-A menu is displayed as well as all operations.
*     parameters:
*       - name: menu_items
*         in: query
*         description: a list holding all menu items from Chick-Fil-A
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

// MENU BEGINS
// MANAGING MENU
app.get('/ManageMenu', checkAuthenticated, (req, res) => {
    menu_items = []
    pool
        .query('SELECT * FROM menu_items;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                menu_items.push(query_res.rows[i]);
            }
            const data = {menu_items: menu_items};
            res.render('ManageMenu', data);
        });
});

/**
* @swagger
* /add_ingredient_to_menuitem:
*   post:
*     tags:
*       - Information of ingredient to be added
*     summary: Information of ingredient to be added is gathered from user.
*     description: Ingredient with information from user is added to menu item.
*     parameters:
*       - name: menu_items
*         in: query
*         description: a list holding all menu items from Chick-Fil-A
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

// Add Ingredient

app.post('/add_ingredient_to_menuitem', (req, res) => {
    console.log(req.body);

    //query: check if ingredient already exists. If it does, update the quantity only.
    // If ingredient already in recipes
    //      update quantity only
    // else
    //      add recipe entry

    pool.query("SELECT * FROM recipes WHERE menu_id=(SELECT id FROM menu_items WHERE name=$1) AND inventory_id=(SELECT id FROM inventory WHERE name=$2);",
    [req.body.name[0], req.body.name[1]], (err, results) => {
        if (err){
            console.log("Couldnt select recipe");
        } else if (results.rowCount != 0) {
            // Update Only quantity
            pool.query("UPDATE recipes SET quantity = $3 WHERE menu_id=(SELECT id FROM menu_items WHERE name=$1) AND inventory_id=(SELECT id FROM inventory WHERE name=$2);",
            [req.body.name[0], req.body.name[1], req.body.name[2]], (err2, results2) => {
                if (err2) {
                    console.log("Couldnt update quantity");
                }
            });
            console.log(results.rowCount);
        } else {
            // Add full entry
            pool.query("INSERT INTO recipes (menu_id, inventory_id, quantity) VALUES ((SELECT id FROM menu_items WHERE name=$1), (SELECT id FROM inventory WHERE name=$2), $3);",
            [req.body.name[0], req.body.name[1], req.body.name[2]], (err2, results2) => {
                if (err2){
                    console.log(err2);
                }
            });
        }
    });


    menu_items = []
    pool
        .query('SELECT * FROM menu_items;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                menu_items.push(query_res.rows[i]);
            }
            const data = {menu_items: menu_items};
            res.render('ManageMenu', data);
        });
});

/**
* @swagger
* /add_ingredient_to_menuitem:
*   get:
*     description: Updated ManageMenu page is displayed after adding ingredient.
*     parameters:
*       - name: menu_items
*         in: query
*         description: a list holding all menu items from Chick-Fil-A
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

app.get('/add_ingredient_to_menuitem', (req, res) => {

    menu_items = []
    pool
        .query('SELECT * FROM menu_items;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                menu_items.push(query_res.rows[i]);
            }
            const data = {menu_items: menu_items};
            res.render('ManageMenu', data);
        });
});

/**
* @swagger
* /remove_ingredient_to_menuitem:
*   post:
*     tags:
*       - Information of ingredient to be removed
*     summary: Information of ingredient to be removed is gathered from user.
*     description: Ingredient with information from user is removed from menu item.
*     parameters:
*       - name: menu_items
*         in: query
*         description: a list holding all menu items from Chick-Fil-A
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

// Remove Ingredient
app.post('/remove_ingredient_from_menuitem', (req, res) => {
    console.log(req.body);


    pool.query("DELETE FROM recipes WHERE menu_id=(SELECT id FROM menu_items WHERE name=$1) AND inventory_id=(SELECT id FROM inventory WHERE name=$2);",
    [req.body.name[0], req.body.name[1]], (err, results) => {
        if (err){
            console.log(err);
        }
    });

    menu_items = []
    pool
        .query('SELECT * FROM menu_items;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                menu_items.push(query_res.rows[i]);
            }
            const data = {menu_items: menu_items};
            res.render('ManageMenu', data);
        });
});

/**
* @swagger
* /add_ingredient_to_menuitem:
*   get:
*     description: Updated ManageMenu page is displayed after removing ingredient.
*     parameters:
*       - name: menu_items
*         in: query
*         description: a list holding all menu items from Chick-Fil-A
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/


app.get('/remove_ingredient_from_menuitem', (req, res) => {

    menu_items = []
    pool
        .query('SELECT * FROM menu_items;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                menu_items.push(query_res.rows[i]);
            }
            const data = {menu_items: menu_items};
            res.render('ManageMenu', data);
        });
});

/**
* @swagger
* /add_menu:
*   post:
*     tags:
*       - Information of menu item to be added
*     summary: Information of menu item to be added is gathered from user.
*     description: Menu item with information from user is added to menu.
*     parameters:
*       - name: menu_items
*         in: query
*         description: a list holding all menu items from Chick-Fil-A
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

// Add menu Item

app.post('/add_menu', (req, res) => {
    console.log(req.body);

    pool.query("INSERT INTO menu_items (name, category, price) VALUES ($1, $2 ,$3);",
    [req.body.name[0], req.body.name[1], req.body.name[2]], (err, results) => {
        if (err){
            console.log(err);
        }
    });

    menu_items = []
    pool
        .query('SELECT * FROM menu_items;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                menu_items.push(query_res.rows[i]);
            }
            const data = {menu_items: menu_items};
            res.render('ManageMenu', data);
        });
})

/**
* @swagger
* /add_menu:
*   get:
*     description: Updated ManageMenu page is displayed after adding menu item.
*     parameters:
*       - name: menu_items
*         in: query
*         description: a list holding all menu items from Chick-Fil-A
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

app.get('/add_menu', (req, res) => {
    menu_items = []
    pool
        .query('SELECT * FROM menu_items;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                menu_items.push(query_res.rows[i]);
            }
            const data = {menu_items: menu_items};
            res.render('ManageMenu', data);
        });
})

/**
* @swagger
* /delete_menu:
*   post:
*     tags:
*       - Information of menu item to be removed.
*     summary: Information of menu item to be removed is gathered from user.
*     description: Menu item with information from user is removed to menu.
*     parameters:
*       - name: menu_items
*         in: query
*         description: a list holding all menu items from Chick-Fil-A
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

// Remove menu Item

app.post('/delete_menu', (req, res) => {
    console.log(req.body);

    pool.query("DELETE FROM menu_items WHERE name= $1",
    [req.body.name], (err, results) => {
        if (err){
            console.log(err);
        } else {
            console.log("Deleting Menu Item");
            console.log(req.body.name);
        }
    });

    menu_items = []
    pool
        .query('SELECT * FROM menu_items;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                menu_items.push(query_res.rows[i]);
            }
            const data = {menu_items: menu_items};
            res.render('ManageMenu', data);
        });
    
})

/**
* @swagger
* /delete_menu:
*   get:
*     description: Updated ManageMenu page is displayed after deleting menu item.
*     parameters:
*       - name: menu_items
*         in: query
*         description: a list holding all menu items from Chick-Fil-A
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

app.get('/delete_menu', (req, res) => {
    menu_items = []
    pool
        .query('SELECT * FROM menu_items;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                menu_items.push(query_res.rows[i]);
            }
            const data = {menu_items: menu_items};
            res.render('ManageMenu', data);
        });
})

// REPORTS PAGE AND FUNCTIONALITIES

/**
* @swagger
* /Reports:
*   get:
*     description: Reports page is rendered
*
*/

// Reports main Page
app.get('/Reports', checkAuthenticated, (req, res) => {
    res.render('Reports')
})

/**
* @swagger
* /excess_report:
*   post:
*     tags:
*       - Excess report form
*     summary: Information needed for excess report is gathered from user.
*     description: Given a timestamp, display the list of items that only sold less than 10% of their inventory between the timestamp and the current  time, assuming no restocks have happened during the window.
*     parameters:
*       - name: sales
*         in: query
*         description: a list holding all data from query
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

app.post('/excess_report', (req, res) => {
    console.log(req.body.name);

    sales = []
    pool
        .query('SELECT m.name, quantity, SUM(count) FROM menu_counts mc JOIN inventory i ON mc.menu_id = i.id JOIN menu_items m ON m.id = mc.menu_id WHERE count < (0.1 * quantity) AND date BETWEEN $1 AND (SELECT MAX(date) FROM menu_counts) GROUP BY 1, 2 HAVING SUM(count) < (0.1 * quantity);', [req.body.name])
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                sales.push(query_res.rows[i]);
            }
            const data = {sales: sales};
            res.render('ExcessReport', data);
        });
})

/**
* @swagger
* /excess_report:
*   get:
*     tags:
*       - Excess report Page
*     summary: Excess report page displaying information
*     parameters:
*       - name: sales
*         in: query
*         description: a list holding all data from query
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

app.get('/excess_report', (req, res) => {
    sales = []
    pool
        .query('SELECT m.name, quantity, SUM(count) FROM menu_counts mc JOIN inventory i ON mc.menu_id = i.id JOIN menu_items m ON m.id = mc.menu_id WHERE count < (0.1 * quantity) AND date BETWEEN $1 AND (SELECT MAX(date) FROM menu_counts) GROUP BY 1, 2 HAVING SUM(count) < (0.1 * quantity);', [req.body.name])
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                sales.push(query_res.rows[i]);
            }
            const data = {sales: sales};
            res.render('Reports', data);
        });
})

/**
* @swagger
* /sales_report:
*   post:
*     tags:
*       - Sales report form
*     summary: Given a time window, display the sales by item from the order history.
*     parameters:
*       - name: sales
*         in: query
*         description: a list holding all data from query
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

// Sales Report
app.post('/sales_report', (req, res) => {

    console.log(req.body);

    sales = []
    pool
        .query('select m.name, SUM(o.total_price), COUNT(1) AS Total_Units_Sol FROM orders o JOIN order_items i ON o.id = i.order_id JOIN menu_items m ON i.menu_id = m.id WHERE DATE(o.time_stamp) BETWEEN $1 AND $2 GROUP BY 1;', [req.body.name[0], req.body.name[1]])
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                sales.push(query_res.rows[i]);
            }
            const data = {sales: sales};
            res.render('SalesReport', data);
        });

})

/**
* @swagger
* /sales_report:
*   get:
*     tags:
*       - Sales report Page
*     summary: Sales report page displaying information
*     parameters:
*       - name: sales
*         in: query
*         description: a list holding all data from query
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

app.get('/sales_report', (req, res) => {

    sales = []
    pool
        .query('select m.name, SUM(o.total_price), COUNT(1) AS Total_Units_Sol FROM orders o JOIN order_items i ON o.id = i.order_id JOIN menu_items m ON i.menu_id = m.id WHERE DATE(o.time_stamp) BETWEEN $1 AND $2 GROUP BY 1;', [req.body.name[0], req.body.name[1]])
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                sales.push(query_res.rows[i]);
            }
            const data = {sales: sales};
            res.render('Reports', data);
        });

})

/**
* @swagger
* /restock_report:
*   get:
*     tags:
*       - Restock report form
*     summary: Display the list of items whose current inventory is less than the item's minimum amount to have around before needing to restock.
*     parameters:
*       - name: sales
*         in: query
*         description: a list holding all data from query
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

// Restock Report
app.get('/RestockReport', (req, res) => {
    sales = []
    pool
        .query("SELECT name, quantity, minimum_quantity FROM inventory WHERE quantity < minimum_quantity")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                sales.push(query_res.rows[i]);
            }
            const data = {sales: sales};
            res.render('RestockReport', data);
        });

})

/**
* @swagger
* /what_report:
*   post:
*     tags:
*       - What Report
*     summary: Given a time window, display a list of pairs of menu items that sell together often, popular or not, sorted by most frequent.
*     parameters:
*       - name: sales
*         in: query
*         description: a list holding all data from query
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

// What Sells Together
app.post('/what_report', (req, res) => {

    console.log(req.body);

    sales = []
    pool
        .query('SELECT m.name AS name1, m2.name AS name2, COUNT(1) AS total_units from order_items as a INNER JOIN order_items as b ON a.order_id=b.order_id JOIN menu_items m ON a.menu_id = m.id JOIN menu_items m2 ON b.menu_id = m2.id WHERE a.menu_id < b.menu_id AND a.order_id IN (SELECT id FROM orders WHERE DATE(time_stamp) BETWEEN $1 and $2) GROUP BY 1,2 ORDER BY COUNT(1) DESC;', [req.body.name[0], req.body.name[1]])
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                sales.push(query_res.rows[i]);
            }
            const data = {sales: sales};
            res.render('WhatSells', data);
        });

})

/**
* @swagger
* /what_report:
*   get:
*     tags:
*       - What Report Page
*     summary: Rendere What Report page.
*     parameters:
*       - name: sales
*         in: query
*         description: a list holding all data from query
*         required: false
*         explode: true
*         schema:
*           type: array
*           items:
*              type: string
*
*/

app.get('/what_report', (req, res) => {

    sales = []
    pool
        .query('SELECT m.name AS name1, m2.name AS name2, COUNT(1) AS total_units from order_items as a INNER JOIN order_items as b ON a.order_id=b.order_id JOIN menu_items m ON a.menu_id = m.id JOIN menu_items m2 ON b.menu_id = m2.id WHERE a.menu_id < b.menu_id AND a.order_id IN (SELECT id FROM orders WHERE DATE(time_stamp) BETWEEN $1 and $2) GROUP BY 1,2 ORDER BY COUNT(1) DESC;', [req.body.name[0], req.body.name[1]])
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                sales.push(query_res.rows[i]);
            }
            const data = {sales: sales};
            res.render('Report', data);
        });

})


// Query for What Sales together: SELECT m.name, m2.name, COUNT(1) from order_items as a INNER JOIN order_items as b ON a.order_id=b.order_id JOIN menu_items m ON a.menu_id = m.id JOIN menu_items m2 ON b.menu_id = m2.id WHERE a.menu_id < b.menu_id AND a.order_id IN (SELECT id FROM orders WHERE DATE(time_stamp) BETWEEN '2022-09-12' and '2022-11-12') GROUP BY 1,2 ORDER BY COUNT(1) DESC;


app.use( express.static( 'views' ) )

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
