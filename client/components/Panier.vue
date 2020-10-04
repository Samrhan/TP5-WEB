<template>
  <div>
    <article v-for="article in panier.articles" :key="article.id">
      <div class="article-img">
        <div :style="{ backgroundImage: 'url(' + articles.find(a=>a.id===article.id).image + ')' }">
        </div>
      </div>
      <div class="article-content">
        <div class="article-title">
          <h2>{{ articles.find(a => a.id === article.id).name }} - {{
              articles.find(a => a.id === article.id).price
            }}€</h2>
          <div>
            <label>
              <input type="number" v-model="article.quantity" v-on:change="changeQuantity(article.id, article.quantity)">
            </label>
            <button @click="deleteFromPanier(article.id)"
                    v-if="panier.articles.find(a => a.id === article.id) !== undefined">Supprimer du panier
            </button>
          </div>
        </div>
        <p>{{ articles.find(a => a.id === article.id).description }}</p>
      </div>
    </article>
  </div>
</template>

<script>
module.exports = {
  props: {
    articles: {type: Array, default: []},
    panier: {type: Object}
  },
  data() {
    return {}
  },
  async mounted() {
  },
  methods: {
    deleteFromPanier (articleId){
      this.$emit('delete-from-panier', articleId)
    },
    changeQuantity(articleId, articleQuantity){
      this.$emit('change-quantity', articleId, articleQuantity)

    }
  }
}
</script>

<style scoped>
article {
  display: flex;
}

.article-img {
  flex: 1;
}

.article-img div {
  width: 100px;
  height: 100px;
  background-size: cover;
}

.article-content {
  flex: 3;
}

.article-title {
  display: flex;
  justify-content: space-between;
}

textarea {
  width: 100%;
}

input {
  width: 5vw
}
</style>
