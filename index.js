const express = require('express') 
dotenv = require('dotenv').config();
const {Pool} = require('pg')
const bodyParser = require('body-parser')

const app = express();

const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/View_Menu', (req, res) => {
    res.render('View_Menu')
});

// MANAGER HOME PAGE
app.get('/ManagerHome', (req, res) => {
    res.render('ManagerHome');
});

// MANAGING INVENTORY
app.get('/ManageInventory', (req, res) => {
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

app.get('/Order_History', (req, res) => {

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


// MENU BEGINS
// MANAGING MENU
app.get('/ManageMenu', (req, res) => {
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
app.get('/Reports', (req, res) => {
    res.render('Reports')
})

app.post('/excess_report', (req, res) => {
    console.log(req.body.name);

    sales = []
    pool
        .query('SELECT date, menu_id, count, quantity FROM menu_counts mc JOIN inventory i ON mc.menu_id = i.id WHERE count < (0.1 * quantity) AND date BETWEEN $1 AND (SELECT MAX(date) FROM menu_counts);', [req.body.name])
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
        .query('"SELECT date, menu_id, count, quantity FROM menu_counts mc JOIN inventory i ON mc.menu_id = i.id WHERE count < (0.1 * quantity) AND date BETWEEN $1 AND (SELECT MAX(date) FROM menu_counts);', [req.body.name[0]])
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

app.listen(3001, () => {
    console.log('Running on Port 3001')
});