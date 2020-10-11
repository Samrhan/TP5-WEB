<template>
  <div id="login">
    <div id="box">
      <form v-on:submit.prevent="register">
        <div class="form-group">
          <label for="exampleInputEmail1">Adresse email</label>
          <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                 placeholder="Entrez l'Email" v-model="email.input"
                 v-bind:class="{'is-invalid': email.invalid || invaliddata}" required>
          <div class="invalid-feedback" v-if="!invaliddata">
            Le format ne correspond pas à une email
          </div>
          <div class="invalid-feedback" v-else>
            L'email est déjà enregistré
          </div>
          <small id="emailHelp" class="form-text text-muted">Nous ne partagerons jamais votre email.</small>
        </div>
        <div class="form-group">
          <div>
            <label for="inputPassword">Mot de Passe</label>
            <input type="password" class="form-control" id="inputPassword" placeholder="Mot de Passe"
                   v-model="password.input" v-bind:class="{'is-invalid': password.invalid}"
                   required>
            <div class="invalid-feedback">
              Le mot de passe doit contenir au moins une majuscule, un chiffre, et dois faire au moins 8 caractères
            </div>
          </div>
          <div>
            <label for="inputConfirmPassword">Confirmez le Mot de Passe</label>
            <input type="password" class="form-control" v-bind:class="{'is-invalid': confirmPassword.invalid}"
                   id="inputConfirmPassword" placeholder="Confirmation"
                   v-model="confirmPassword.input" required>
            <div class="invalid-feedback">
              Les deux mots de passes sont différents
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">S'inscrire</button>
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
      email: {input: '', invalid: false},
      password: {input: '', invalid: false},
      confirmPassword: {input: '', invalid: false},
    }
  },
  methods: {
    register() {
      // On fait une petite confirmation des données
      this.password.invalid = !this.password.input.match(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/)
      this.confirmPassword.invalid = this.confirmPassword.input !== this.password.input;
      this.email.invalid = !this.email.input.match(/.*@.*\..{2,}/);
      let validForm = !this.password.invalid && !this.email.invalid && !this.confirmPassword.invalid
      if (validForm) {
        this.$emit('register', {email: this.email.input, passwd: this.password.input})
      }
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
