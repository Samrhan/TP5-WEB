<template>
  <div id="login">
    <div id="box">
      <form v-on:submit.prevent="login">
        <div class="form-group">
          <label for="exampleInputEmail1">Adresse email</label>
          <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                 placeholder="Entrez l'Email" v-model="credential.email" v-bind:class="{'is-invalid': invaliddata}"
                 required>
          <small id="emailHelp" class="form-text text-muted">Nous ne partagerons jamais votre email.</small>
        </div>
        <div class="form-group">
          <label for="inputPassword">Mot de Passe</label>
          <input type="password" class="form-control" id="inputPassword" placeholder="Mot de Passe"
                 v-model="credential.passwd" v-bind:class="{'is-invalid': invaliddata}" required>
          <div class="invalid-feedback">
            Le nom d'utilisateur ou le mot de passe sont incorrects
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Se Connecter</button>

      </form>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: {
    invaliddata: {type: Boolean, default: false}
  },
  data() {
    return {
      credential: {email: '', passwd: ''}
    }
  },
  methods: {
    login() {
      this.$emit('login', this.credential)
    }
  }
}
</script>

<style scoped>
#login {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
}

#box {
  display: block;
  margin: auto;
  min-width: 30%;
  padding: 15px;
}

form .form-group label {
  padding-top: 10px;
}

@media (min-width: 700px) {
  #box {
    border: 1px solid black;
    border-radius: 15px;
  }
}

h1, h2 {
  text-align: center;
}

h1 {
  font-size: 40px;
}

h2 {
  font-size: 18px;
}

form button {
  margin-top: 10px;
}
</style>
