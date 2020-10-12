<template>
  <div id="main">
    <div id="listearticle">
      <article v-for="article in panier.articles" :key="article.id">
        <div class="card w-100">
          <div class="card-body">
            <img :src="articles.find(a=>a.id===article.id).image" alt="Card image cap">
            <div id="description">
              <h5 class="card-title">{{ articles.find(a => a.id === article.id).name }}</h5>
              <p class="card-text">{{ articles.find(a => a.id === article.id).description }}</p>
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
            <div id="right">
              <b>{{
                  new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(articles.find(a => a.id === article.id).price * article.quantity)
                }}</b></div>
          </div>
        </div>
      </article>
    </div>
    <div>
      <div class="card" style="width: 18rem;" id="total">
        <div class="card-body" id="total-card">
          <h5 class="card-title">Total : {{
              new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              }).format(total)
            }}</h5>
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#confirmPurchase">Valider mon
            Panier
          </button>
          <div class="modal fade" id="confirmPurchase" data-backdrop="static" data-keyboard="false" tabindex="-1"
               aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="staticBackdropLabel">Confirmer</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body" v-if="panier.articles.length !== 0 ">
                  Êtes-vous sûr de vouloir effectuer cet achat ?
                  <button type="button" class="btn btn-primary" data-dismiss="modal"
                          v-on:click="validePanier">Valider mon Panier
                  </button>
                </div>
                <div class="modal-body" v-else>
                  Votre panier est vide :(
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-danger" data-dismiss="modal">Annuler</button>
                </div>
              </div>
            </div>
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
    panier: {type: Object},
    user: {type: Object}
  },
  data() {
    return {
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
    validePanier() {
      this.$emit('valid-panier')
    }

  },
  computed: {
    total: function () {
      let total = 0;
      if (this.panier)
        for (let i of this.panier.articles) {
          total += i.quantity * this.articles.find(a => a.id === i.id).price
        }
      return total
    }
  }
}
</script>

<style scoped>

#main {
  margin: 20px;
  display: flex;
  flex-direction: row;
}

#total {
  position: relative;
  right: 0;
}

#total-card {
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
  height: auto !important;
}

button {
  height: auto !important;
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

#description {
  width: 100%;
}

.btn {
  height: 4%;
}

textarea {
  width: 100%;
}


img {
  width: 10vw;
  height: auto;
  margin-right: 20px;
}

.card {
  margin: 20px;
  width: 100%;
}

#listearticle {
  width: 100%;
}
</style>
