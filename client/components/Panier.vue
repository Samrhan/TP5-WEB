<template>
  <div id="main">
    <div>
      <article v-for="article in panier.articles" :key="article.id">
        <div class="card w-75">
          <div class="card-body">
            <img :src="articles.find(a=>a.id===article.id).image" alt="Card image cap">
            <div id="description">
              <h5 class="card-title">Card title</h5>
              <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
              <div id="buttonlist">
                <div class="dropdown">
                  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Qté : {{ article.quantity }}
                  </button>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="#" v-for="i in 10"
                       v-on:click="changeQuantity(article.id, parseInt(i))">{{ i }}</a>
                  </div>
                </div>
                <a href="#" class="btn btn-danger" v-on:click="deleteFromPanier(article.id)">Supprimer</a>
              </div>
            </div>
            <div id="right"></div> <!--Cette div permet de centrer le prix à droite-->
            <b>{{
                new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(articles.find(a => a.id === article.id).price * article.quantity)
              }}</b>
          </div>
        </div>
      </article>
    </div>
    <div class="card" style="width: 18rem;" id="total">
      <div class="card-body" id="total-card">
        <h5 class="card-title">Total : {{
            new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            }).format(total)
          }}</h5>
        <button type="button" class="btn btn-primary">Valider mon Panier</button>
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
    return {}
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

  },
  computed: {
    total: function () {
      let total = 0;
      for (let i of this.panier.articles) {
        total += i.quantity * this.articles.find(a => a.id === i.id).price
      }
      return total
    }
  }
}
</script>

<style scoped>

#main{
  margin: 20px;
}

#total {
  position: fixed;
  right: 0;
  top: 8vh;
  max-width: 15vw !important;
}

#total-card{
  display: flex;
  flex-direction: column;
}

#buttonlist {
  display: flex;
  flex-direction: row;
}

article {
  display: flex;
}

.dropdown {
  margin-right: 20px;
}

#right {
  position: relative;
  width: 100%;
  right: 2px;
}

.article-img div {
  width: 100px;
  height: 100px;
  background-size: cover;
}

.card-body {
  display: flex;
  flex-direction: row;
}

.btn {
  height: 4%;
}

textarea {
  width: 100%;
}

input {
  width: 5vw
}

img {
  width: 10vw;
  height: auto;
  margin-right: 20px;
}

.card {
  margin: 20px;
}
</style>
