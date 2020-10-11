const Home = window.httpVueLoader('./components/Home.vue')
const Panier = window.httpVueLoader('./components/Panier.vue')
const Article = window.httpVueLoader('./components/Article.vue')
const Register = window.httpVueLoader('./components/Register.vue')

const routes = [
    {path: '/', component: Home},
    {path: '/panier', component: Panier},
    {path: '/article/:id', component: Article, name: 'article'},
    {path: '/register', component: Register}
]

const router = new VueRouter({
    routes
})

const app = new Vue({
    router,
    el: '#app',
    data: {
        search: '',
        articles: [],
        panier: {
            createdAt: null,
            updatedAt: null,
            articles: []
        }
    },
    async mounted() {
        const res = await axios.get('/api/articles')
        this.articles = res.data
        const res2 = await axios.get('/api/panier')
        this.panier = res2.data
    },
    methods: {
        async addArticle(article) {
            const res = await axios.post('/api/article', article)
            this.articles.push(res.data)
        },
        async updateArticle(newArticle) {
            await axios.put('/api/article/' + newArticle.id, newArticle)
            const article = this.articles.find(a => a.id === newArticle.id)
            article.name = newArticle.name
            article.description = newArticle.description
            article.image = newArticle.image
            article.price = newArticle.price
        },
        async deleteArticle(articleId) {
            await axios.delete('/api/article/' + articleId)
            const index = this.articles.findIndex(a => a.id === articleId)
            this.articles.splice(index, 1)
        },
        async addToPanier(articleId) {
            let res = await axios.post('/api/panier', {id: articleId, quantity: 1})
            console.log(res)
            this.panier = res.data
        },
        async deleteFromPanier(articleId) {
            const res = await axios.delete('/api/panier/' + articleId)
            this.panier = res.data
        },
        async changeQuantity(articleId, articleQuantity) {
            await axios.put('/api/panier/' + articleId, {quantity: articleQuantity})
            this.panier.articles.find(a => a.id === articleId).quantity = articleQuantity
        },
        async validPanier(user){
            await axios.post('/api/panier/pay', user)
            const res = await axios.get('/api/panier')
            this.panier = {articles:[]}

        }
    }
});
