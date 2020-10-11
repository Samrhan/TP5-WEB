const express = require('express')
const router = express.Router()
const articles = require('../data/articles.js')

const bcrypt = require('bcrypt')
const {Client} = require('pg')

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'kali',
    database: 'TP5'
})

client.connect()


class User {
    constructor() {
        this.createdAt = new Date()
        this.updatedAt = new Date()
        this.data // undefined si l'utilisateur n'est pas connecté
        this.articles = []
    };
}

router.use((req, res, next) => {
    // l'utilisateur n'est pas reconnu, lui attribuer un panier dans req.session
    if (typeof req.session.user === 'undefined') {
        req.session.user = new User()
    }
    next()
})

/** Routes relatives à la BDD **/

router.post('/register', async (req, res) => {
    const email = req.body.email
    const passwd = req.body.passwd
    console.log(email, passwd)
    // vérification de la validité des données d'entrée
    if (typeof email !== 'string' || email === '' ||
        typeof passwd !== 'string' || passwd === '') {
        res.status(400).json({message: 'bad request', code: 3})
        return
    }
    if (email.endsWith('--')) { // Si on a tenté une injection SQL (useless mais drôle)
        res.status(401).json({message: "Don't mess with me :angyy:", code: 1})
        return
    }

    // on revérifie les données du formulaire, au cas ou qqn utilise postman ou burp
    let validForm = !passwd.match(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/) && !email.match(/.*@.*\..{2,}/);
    if (validForm) {
        res.status(401).json({message: "use the form :)", code: 2})
        return
    }

    let query = new Promise((resolve, reject) => {
        client.query('SELECT * FROM users WHERE email = $1', [email], (err, rows) => {
            if (err) reject(err)
            else {
                if (rows.rows.length > 0) {
                    reject("L'utilisateur existe déjà")
                } else resolve()
            }
        })
    })
    try {
        await query;
        let passwd_hash = await bcrypt.hash(passwd, 10)
        await client.query('INSERT INTO users(email, password) VALUES ($1,$2)', [email, passwd_hash])
        res.json({'status': 'success'})

    } catch (err) {
        res.status(401).json({message: err, code: 0})
    }
    // on envoie l'article ajouté à l'utilisateur
})

router.post("/login", async (req, res) => {
    const passwd = req.body.passwd;
    const email = req.body.email;
    if (typeof email !== 'string' || email === '' ||
        typeof passwd !== 'string' || passwd === '') {
        res.status(400).json({message: 'bad request', code: 3})
        return
    }
    if (email.endsWith('--')) { // Si on a tenté une injection SQL (useless mais drôle)
        res.status(401).json({message: "Don't mess with me :angyy:", code: 1})
        return
    }
    let query = new Promise(async (resolve, reject) => {
        client.query('SELECT * FROM users WHERE email = $1', [email], async (err, rows) => {
            if (err) reject(err)
            else {
                if (rows.rows.length <= 0) {
                    reject()
                } else {
                    let data = rows.rows[0];
                    let samePasswd = await bcrypt.compare(passwd, data.password);
                    if (samePasswd) {
                        resolve({id: data.id, email: data.email})
                    } else reject()
                }
            }
        })
    })
    try {
        let data = await query;
        req.session.user.data = data;
        res.json(data)

    } catch (err) {
        res.status(401).json({message: err, code: 0})
    }
})

router.get("/me", async (req, res) => {
    if (req.session.user.data) {
        res.json(req.session.user.data)
    } else res.status(404).json({message: 'Non connecté', code: 5})
})

/*
 * Cette route doit retourner le panier de l'utilisateur, grâce à req.session
 */
router.get('/panier', (req, res) => {
    res.json(req.session.user)
})

/*
 * Cette route doit ajouter un article au panier, puis retourner le panier modifié à l'utilisateur
 * Le body doit contenir l'id de l'article, ainsi que la quantité voulue
 */
router.post('/panier', (req, res) => {
    const id = req.body.id
    const quantity = req.body.quantity

    // vérification de la validité des données d'entrée
    if (isNaN(id) || id <= 0 ||
        isNaN(quantity) || quantity <= 0) {
        res.status(400).json({message: 'bad request'})
        return
    }
    if (articles.find(i => i.id === parseInt(id)) === undefined) {
        res.status(400).json({message: "L'article n'existe pas"})
    }
    if (req.session.user.articles.find(a => a.id === parseInt(id))) {
        res.status(400).json({message: "L'article existe déjà"})
        return
    }
    req.session.user.articles.push({id: parseInt(id), quantity: parseInt(quantity)})
    // on envoie l'article ajouté à l'utilisateur
    res.json(req.session.user)
})

/*
 * Cette route doit permettre de confirmer un panier, en recevant le nom et prénom de l'utilisateur
 * Le panier est ensuite supprimé grâce à req.session.destroy()
 */
router.post('/panier/pay', (req, res) => {
    if (req.session.user.articles.length === 0) {
        res.status(400).json({message: "Votre panier est vide"})
        return
    }
    if (req.session.user.data){
        req.session.user.articles = []
        res.json({message: `achat effectué`})}
    else
        res.status(403).json({message:'Vous devez être connecté pour effectuer cet achat'})
})

/*
 * Cette route doit permettre de changer la quantité d'un article dans le panier
 * Le body doit contenir la quantité voulue
 */
router.put('/panier/:articleId', (req, res) => {
    let id = req.params.articleId
    let quantity = req.body.quantity
    if (isNaN(id) || id <= 0
        || isNaN(quantity) || quantity <= 0) {
        res.status(400).json({message: "bad request"})
        return
    }
    id = parseInt(id)
    quantity = parseInt(quantity)
    if (req.session.user.articles.find(a => a.id === id) === undefined) {
        res.status(404).json({message: "Article not found"})
        return
    }
    req.session.user.articles.find(a => a.id === id).quantity = quantity

    res.json({message: "Success"})

})

/*
 * Cette route doit supprimer un article dans le panier
 */
router.delete('/panier/:articleId', (req, res) => {
    let id = req.params.articleId
    if (isNaN(id) || id <= 0) {
        res.status(400).json({message: "bad request"})
        return
    }
    id = parseInt(id)
    if (req.session.user.articles.find(a => a.id === id) === undefined) {
        res.status(404).json({message: "article not found"})
        return
    }
    req.session.user.articles.splice(req.session.user.articles.indexOf(req.session.user.articles.find(a => a.id === id)), 1)
    res.json(req.session.user)

})


/**
 * Cette route envoie l'intégralité des articles du site
 */
router.get('/articles', (req, res) => {
    res.json(articles)
})

/**
 * Cette route crée un article.
 * WARNING: dans un vrai site, elle devrait être authentifiée et valider que l'utilisateur est bien autorisé
 * NOTE: lorsqu'on redémarre le serveur, l'article ajouté disparait
 *   Si on voulait persister l'information, on utiliserait une BDD (mysql, etc.)
 */
router.post('/article', (req, res) => {
    const name = req.body.name
    const description = req.body.description
    const image = req.body.image
    const price = parseInt(req.body.price)

    // vérification de la validité des données d'entrée
    if (typeof name !== 'string' || name === '' ||
        typeof description !== 'string' || description === '' ||
        typeof image !== 'string' || image === '' ||
        isNaN(price) || price <= 0) {
        res.status(400).json({message: 'bad request'})
        return
    }

    const article = {
        id: articles.length + 1,
        name: name,
        description: description,
        image: image,
        price: price
    }
    articles.push(article)
    // on envoie l'article ajouté à l'utilisateur
    res.json(article)
})

/**
 * Cette fonction fait en sorte de valider que l'article demandé par l'utilisateur
 * est valide. Elle est appliquée aux routes:
 * - GET /article/:articleId
 * - PUT /article/:articleId
 * - DELETE /article/:articleId
 * Comme ces trois routes ont un comportement similaire, on regroupe leurs fonctionnalités communes dans un middleware
 */
function parseArticle(req, res, next) {
    const articleId = parseInt(req.params.articleId)

    // si articleId n'est pas un nombre (NaN = Not A Number), alors on s'arrête
    if (isNaN(articleId)) {
        res.status(400).json({message: 'articleId should be a number'})
        return
    }
    // on affecte req.articleId pour l'exploiter dans toutes les routes qui en ont besoin
    req.articleId = articleId

    const article = articles.find(a => a.id === req.articleId)
    if (!article) {
        res.status(404).json({message: 'article ' + articleId + ' does not exist'})
        return
    }
    // on affecte req.article pour l'exploiter dans toutes les routes qui en ont besoin
    req.article = article
    next()
}

router.route('/article/:articleId')
    /**
     * Cette route envoie un article particulier
     */
    .get(parseArticle, (req, res) => {
        // req.article existe grâce au middleware parseArticle
        res.json(req.article)
    })

    /**
     * Cette route modifie un article.
     * WARNING: dans un vrai site, elle devrait être authentifiée et valider que l'utilisateur est bien autorisé
     * NOTE: lorsqu'on redémarre le serveur, la modification de l'article disparait
     *   Si on voulait persister l'information, on utiliserait une BDD (mysql, etc.)
     */
    .put(parseArticle, (req, res) => {
        const name = req.body.name
        const description = req.body.description
        const image = req.body.image
        const price = parseInt(req.body.price)

        req.article.name = name
        req.article.description = description
        req.article.image = image
        req.article.price = price
        res.send()
    })

    .delete(parseArticle, (req, res) => {
        const index = articles.findIndex(a => a.id === req.articleId)

        articles.splice(index, 1) // remove the article from the array
        res.send()
    })


module.exports = router
