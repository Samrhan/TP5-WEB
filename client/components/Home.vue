<template>
  <div id="main">
    <article>
      <div class="card" style="width: 18rem;" v-for="article in articles" :key="article.id"
           v-on:click="navigateArticle(article.id)"
           v-if="search === '' || article.name.toLowerCase().startsWith(search.toLowerCase()) ">
        <img class="card-img-top" :src="article.image" alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">{{ article.name }} </h5>
          <p class="card-text">{{ article.description }}</p>
        </div>
      </div>
      <!--
      <div class="article-content" v-else>
        <div class="article-title">
          <h2><input type="text" v-model="editingArticle.name"> - <input type="number" v-model="editingArticle.price"></h2>
          <div>
            <button @click="sendEditArticle()">Valider</button>
            <button @click="abortEditArticle()">Annuler</button>
          </div>
        </div>
        <p><textarea v-model="editingArticle.description"></textarea></p>
        <input type="text" v-model="editingArticle.image" placeholder="Lien vers l'image">
      </div>-->
    </article>
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form class="needs-validation" novalidate>
              <div class="form-row">
                <div class="col-md-9 mb-9">
                  <label for="newName">Nom du produit</label>
                  <input type="text" class="form-control" id="newName" value="Mark" v-model="newArticle.name"
                         placeholder="Cheval à Bascule" required
                         required>
                </div>
                <div class="col-md-3 mb-3">
                  <label for="newPrice">Prix</label>
                  <input type="number" class="form-control" id="newPrice" v-model="newArticle.price" placeholder="10"
                         value="Otto"
                         required>
                </div>
              </div>
              <div class="form-group">
                <label for="newDescription">Description</label>
                <textarea type="text" class="form-control" id="newDescription" v-model="newArticle.description"
                          placeholder="Un magnifique cheval" required></textarea>
              </div>

                <div class="form-group">
                  <label for="newImage">Lien vers l'image</label>
                  <input type="text" class="form-control" id="newImage" placeholder="https://..."
                         v-model="newArticle.image" required>
                </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-primary" v-on:click="addArticle" data-dismiss="modal">Ajouter</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: {
    search: {type: String, default: ''},
    articles: {type: Array, default: []},
    panier: {type: Object}
  },
  data() {
    return {
      newArticle: {
        name: '',
        description: '',
        image: '',
        price: 0
      }
    }
  },
  methods: {
    addArticle() {
      this.$emit('add-article', this.newArticle)
    },
    navigateArticle(id) {
      router.replace({
        name: 'article', params: {id: id.toString()}
      })
    }
  }
}
</script>

<style scoped>
article {
  display: flex;
  flex-wrap: wrap;
}

.card {
  margin: 20px
}

.card-text {
  min-height: 10vh;
  text-align: justify;
}

.card-title {
  min-height: 5vh;
}

textarea {
  width: 100%;
}

.card {
  cursor: pointer;
}

.card:hover {
  border: dodgerblue 3px solid;
}

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

.form-row {
  width: inherit;
}

.mb-3 {
  width: inherit;
}
</style>
