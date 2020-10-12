<template>
  <div v-if="articles !== []" id="main">
    <!--Cette magouille permet de charger l'article en question, vue que l'article est chargé de manière asynchrone
        Lorsque la liste est passé en props, elle est vide. Nous attendons donc sagement qu'elle se charge,
        ensuite pour récupérer la variable dans le html au bon moment, la seule méthode que je voyais
        étais de simuler un tableau et d'utiliser un for-->
    <div v-for="i in [articles.find(a => a.id === parseInt(this.id))]" v-if="i !== undefined" id="article">
      <div class="card" style="width: 18rem;" id="divimg">
        <img class="card-img-top" :src="i.image" alt="Card image cap">
        <input v-if="editingArticle.id === i.id" class="card-subtitle" v-model="editingArticle.image">
      </div>
      <div class="card" style="width: 18rem;" id="content">
        <div class="card-body">
          <h5 class="card-title" v-if="editingArticle.id !== i.id">{{ i.name }}</h5>
          <input v-else class="card-title" v-model="editingArticle.name">
          <div></div>
          <p v-if="editingArticle.id !== i.id" class="card-text">{{ i.description }}</p>
          <textarea v-bind:style="{width:'80%'}" v-else class="card-text"
                    v-model="editingArticle.description"></textarea>
        </div>
      </div>
      <div class="card" style="width: 18rem;" id="price">
        <div class="card-body">
          <h5 v-if="editingArticle.id !== i.id" class="card-subtitle">{{
              new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              }).format(i.price)
            }}</h5>
          <input v-else class="card-subtitle" v-model="editingArticle.price">
          <div class="buttonlist" v-if="editingArticle.id !== i.id">
            <button type="button" class="btn btn-danger"
                    @click="deleteFromPanier(i.id)"
                    v-if="panier.articles.find(a => a.id === i.id) !== undefined">Supprimer du Panier
            </button>
            <button type="button" class="btn btn-warning"
                    @click="addToPanier(i.id)"
                    v-if="panier.articles.find(a => a.id === i.id) === undefined">Ajouter au Panier
            </button>
            <button type="button" @click="deleteArticle(i.id)" class="btn btn-danger">Supprimer</button>
            <button type="button" @click="editArticle(i)" class="btn btn-secondary">Editer</button>
          </div>
          <div class="buttonlist" v-else>
            <button type="button" v-on:click="sendEditArticle" class="btn btn-success">Valider</button>
            <button type="button" v-on:click="abortEditArticle" class="btn btn-danger">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: {
    articles: {type: Array, default: []},
    panier: {type: Object}
  },
  data() {
    return {
      id: this.$route.params.id,
      article: {},
      editingArticle: {
        id: -1,
        name: '',
        description: '',
        image: '',
        price: 0
      }
    }
  },
  async mounted() {
  },
  methods: {
    deleteFromPanier(articleId) {
      this.$emit('delete-from-panier', articleId)
    },
    changeQuantity(articleId, articleQuantity) {
      this.$emit('change-quantity', articleId, articleQuantity)
    },
    deleteArticle(articleId) {
      this.$emit('delete-article', articleId)
      router.replace({
        path: '/'
      })
    },
    editArticle(article) {
      this.editingArticle.id = article.id
      this.editingArticle.name = article.name
      this.editingArticle.description = article.description
      this.editingArticle.image = article.image
      this.editingArticle.price = article.price
    },
    sendEditArticle() {
      this.$emit('update-article', this.editingArticle)
      this.abortEditArticle()
    },
    abortEditArticle() {
      this.editingArticle = {
        id: -1,
        name: '',
        description: '',
        image: '',
        price: 0
      }
    },
    addToPanier(articleId) {
      this.$emit('add-to-panier', articleId)
    }
  }
}
</script>

<style scoped>

#main {
  width: 100%;
  align-content: center;
  line-height: 23px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 50px;
  justify-content: center;
}

#article {
  display: flex;
  flex-direction: row;
}

#divimg {
  border: none;
  margin-right: 20px;
}

.card-title {
  font-size: 40px;
  border-bottom: gray solid 1px;
  padding: 5px;
}

#content {
  display: flex;
  border: none;
  width: 40vw !important;
}

.card-text {
  padding-top: 20px;
}

#price {
  border: 3px solid lightgray;
  width: 18vw !important;
}

.buttonlist {
  display: flex;
  flex-direction: column;
}

.buttonlist .btn {
  margin-top: 20px;
}

</style>

