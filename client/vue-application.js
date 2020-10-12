const Home = window.httpVueLoader('./components/Home.vue')
const Panier = window.httpVueLoader('./components/Panier.vue')
const Article = window.httpVueLoader('./components/Article.vue')
const Register = window.httpVueLoader('./components/Register.vue')
const Login = window.httpVueLoader('./components/Login.vue')

const routes = [
    {path: '/', component: Home, name: 'home'},
    {path: '/panier', component: Panier},
    {path: '/article/:id', component: Article, name: 'article'},
    {path: '/register', component: Register},
    {path: '/login', component: Login, name: 'login'}
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
        },
        user: undefined,
        invaliddata: false
    },
    async mounted() {
        const res = await axios.get('/api/articles')
        this.articles = res.data
        const res2 = await axios.get('/api/panier')
        this.panier = res2.data
        await axios.get('/api/me').then(res => {
            if (res.status !== 304)
                this.user = res.data
            else this.user = undefined
        }).catch(error => {
            this.user = undefined
        });
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
        async validPanier() {
            await axios.post('/api/panier/pay')
                .then(res => this.panier = {articles: []})
                .catch(error => {
                    if (error.response.status === 403) {
                        router.replace({
                            name: 'login'
                        })
                    }
                });
        },
        async register(data) {
            await axios.post('/api/register', data).then(response => {
                router.replace({
                    name: 'home'
                })
            }).catch(error => {
                if (error.response.data.code === 0) {
                    this.invaliddata = true
                }
            });
        },
        async login(data) {
            await axios.post('/api/login', data).then(async response => {
                this.user = response.data.data;
                this.panier.articles = response.data.panier;
                router.replace({
                    name: 'home'
                })
            }).catch(error => {
                if (error.response.data.code === 0) {
                    this.invaliddata = true
                }
            });
        },
        async logout() {
            await axios.post('/api/logout')
            this.panier.articles = []
            this.user = undefined
        }

    }
});
