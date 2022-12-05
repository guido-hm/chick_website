const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Create express app
const app = express();
const port = 5000;

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


app.post('/deleteitem', (req, res) => {

    pool.query("DELETE FROM current_order WHERE item_id=$1 and side=1 and row_id=$2;",
    [req.body.currentitemid, req.body.currentrowid], (err, results) => {
        if (err){
            console.log(err);
        }
    });
 
    res.redirect('/server');
});

app.post('/deletetable', (req, res) => {
    holdingmaxid = [];
    var maxid = 0;

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
app.get('/serverLogin', (req, res) => {
    res.render('serverLogin');
});

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

app.get('/serverLogout', (req, res)=>{
    res.clearCookie('session-token');
    res.redirect('/serverLogin')
})

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

// entrees
app.get('/customerentrees', (req, res) => {
    entree_items = []
    images = []
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

app.post('/customerdeletetable', (req, res) => {
    holdingmaxid = [];
    var maxid = 0;

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

    // pool
    //     .query('select max(id) from orders;')
    //     .then(query_res => {
    //         for (let i = 0; i < query_res.rowCount; i++){
    //             holdingmaxid.push(query_res.rows[i]);
    //         }
    //         maxid = query_res.rows[0].max+1;
    //         console.log(maxid);
    // });

    

    //console.log(req.body.totalprice)


    // for (var i=0, len=current_items.length; i<len; i++) {
    //     console.log(current_items[i].item_id);
    // }

    pool.query("DELETE FROM current_order where side= 2;", (err, results) => {
        if (err){
            console.log(err);
        }
    });

    res.redirect('/customerorderconfirmation');
});



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


app.get('/customerorderpage', (req, res) => {
    // select current_order
    current_items = []
    var total = 0.0;

    /*pool
        .query('SELECT SUM(item_price) as sum_price FROM current_order where side=2;')
        .then(query_res => {
            // for (let i = 0; i < query_res.rowCount; i++){
            //     current_items.push(query_res.rows[i]);
            // }
            current_items.push(query_res.rows[0].sum_price);
            console.log(current_items[0].sum_price);
        });*/
    
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
    
    // pool
    //     .query('SELECT SUM(item_price) FROM current_order;')
    //     .then(query_res => {
    //         for (let i = 0; i < query_res.rowCount; i++){
    //             totalp.push(query_res.rows[i]);
    //         }
    //         const data2 = {totalp: totalp};
    //         return_data.table2 = data2;
    //     });
    
    // console.log(return_data.table2);
    // res.render('orderpage', return_data);
});

app.get('/customerpayment', (req, res) => {
    current_items = []
    var total = 0.0;

    /*pool
        .query('SELECT SUM(item_price) as sum_price FROM current_order where side=2;')
        .then(query_res => {
            // for (let i = 0; i < query_res.rowCount; i++){
            //     current_items.push(query_res.rows[i]);
            // }
            current_items.push(query_res.rows[0].sum_price);
            console.log(current_items[0].sum_price);
        });*/
    
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


app.get('/customerorderconfirmation', (req, res) => {
    orderdets = []

    /*pool
        .query('SELECT SUM(item_price) as sum_price FROM current_order where side=2;')
        .then(query_res => {
            // for (let i = 0; i < query_res.rowCount; i++){
            //     current_items.push(query_res.rows[i]);
            // }
            current_items.push(query_res.rows[0].sum_price);
            console.log(current_items[0].sum_price);
        });*/
    
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

app.get('/View_Menu', (req, res) => {
    res.render('View_Menu')
});

// MANAGER LOGIN
app.get('/managerLogin', (req, res) => {
    res.render('ManagerLogin');
});

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

app.get('/managerLogout', (req, res)=>{
    res.clearCookie('session-token');
    res.redirect('/managerLogin')
})

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

// MANAGER HOME PAGE
app.get('/ManagerHome', checkAuthenticated, (req, res) => {
    let user = req.user;
    res.render('ManagerHome', {user});
});

// MANAGING INVENTORY
app.get('/ManageInventory', checkAuthenticated, (req, res) => {
    inventory_items = []
    let user = req.user;
    pool
        .query('SELECT * FROM inventory;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                inventory_items.push(query_res.rows[i]);
            }
            const data = {inventory_items: inventory_items, user};
            res.render('ManageInventory', data);
        });
});


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

app.get('/add_inventory', (req, res) => {

    res.redirect('/ManageInventory');

});

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

app.get('/delete_inventory', (req, res) => {

    res.redirect('/ManageInventory');

});

// MANAGER ORDER HISTORY

app.get('/Order_History', checkAuthenticated, (req, res) => {
    let user = req.user;
    orders = []
    pool
        .query('SELECT DATE(time_stamp), SUM(CAST(total_price as numeric)) FROM orders GROUP BY 1 ORDER BY 1;;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                orders.push(query_res.rows[i]);
            }
            const data = {orders: orders, user};
            res.render('Order_History', data);
        });
});


// MENU BEGINS
// MANAGING MENU
app.get('/ManageMenu', checkAuthenticated, (req, res) => {
    menu_items = []
    let user = req.user;
    pool
        .query('SELECT * FROM menu_items;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                menu_items.push(query_res.rows[i]);
            }
            const data = {menu_items: menu_items, user};
            res.render('ManageMenu', data);
        });
});

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

// Reports main Page
app.get('/Reports', checkAuthenticated, (req, res) => {
    let user = req.user;
    res.render('Reports', {user})
})

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
