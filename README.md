# TP5

Réalisé par Samuel BADER et Adrien PLOT

Site de E-Commerce (ou presque) avec comptes d'utilisateurs
Tout le monde peut ajouter et éditer les articles


# Install

`npm install`

# Run

`npm start`
#

**Base de données requises (PostgreSQL)**

user
 - id : serial, primary key
 - email : text
 - password : text
 
articles : 
 - id : serial, primary key
 - infos : JSON<br>
 _Il suffit de décommenter le début de api.js pour transférer les données dans la db_
 
panier : 
 - user : int
 - article : int
 - quantity : int
