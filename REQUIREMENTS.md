# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index: http://localhost:3000/products
  The above url will get a list of products

- Show http://localhost:3000/products/:id
  The above url will show the product with mentioned id

- Create : http://localhost:3000/products/create
  The above url will create a product upon passing the token generated from /create endpoint for users.
  Body in postman has to be passed in the below format:
  {
  "name": #product name to be added,
  "price": #product price to be added
  }

-Delete: http://localhost:3000/products/delete/:id
The above url will delete a product upon passing the required ID and token.

#### Users

- Index: http://localhost:3000/users
  The above url will get a list of users

- Show http://localhost:3000/users/:id
  The above url will show the user with mentioned id

- Create : http://localhost:3000/users/create
  The above url will generate a token.Use this token where required.
  Body in postman has to be passed in the below format:
  {
  "firstname": #user's firstname to be added,
  "lastname": #user's last to be added,
  "passwords": #user's password to be added
  }

-Delete: http://localhost:3000/users/delete/:id
The above url will delete a user upon passing the required ID and token.

#### Orders

- Index: http://localhost:3000/orders
  The above url will get a list of orders

- Show http://localhost:3000/orders/:id
  The above url will show the order with mentioned id

- Create : http://localhost:3000/orders/create
  The above url will create a order upon passing the token generated from /create endpoint for users.
  Body in postman has to be passed in the below format:
  {
  "status": #order status to be added,
  "user_id": #required user id to be added
  }

-Delete: http://localhost:3000/orders/delete/:id
The above url will delete a order upon passing the required ID and token.

## Data Shapes

# Product

- id

- name

- price

- name VARCHAR(10), price integer, id SERIAL PRIMARY KEY

- Referenced by:
  TABLE "product_orders" CONSTRAINT "product_orders_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE

# User

- id

- firstname

- lastname

- passwords

id SERIAL PRIMARY KEY, firstname VARCHAR(10), lastname VARCHAR(10), passwords VARCHAR(100)

# Orders

- id

- user_id

- status of order

- id SERIAL PRIMARY KEY, status of order VARCHAR(10), user_id integer

- Referenced by:
  TABLE "product_orders" CONSTRAINT "product_orders_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE

# product-orders

- id

- quantity

- order_id

- product_id

- id SERIAL PRIMARY KEY, quantity integer, order_id integer, product_id integer
  Foreign-key constraints:
  "product_orders_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  "product_orders_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
