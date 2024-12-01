<script>
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
import { useChatStore } from '@/stores/chat'
const chatStore = useChatStore()

export default {
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    async logUser() {
      console.log('logUser()')
      console.log('Username:', this.username)
      console.log('Password:', this.password)

      const url =
        'https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/auth/login'

      const body = {
        username: this.username,
        password: this.password,
      }

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })

        const data = await response.json()
        const parsedBody = JSON.parse(data.body)

        console.log('Response:', parsedBody)

        if ('error' in parsedBody) {
          throw new Error('Error: ' + parsedBody.error)
        }

        localStorage.setItem('access_token', parsedBody.access_token)
        console.log('Access token saved:', parsedBody.access_token)

        chatStore.resetStore()
        userStore.logIn(this.username)

        this.$router.push('/feed')
      } catch (error) {
        this.$router.push('/login')
        console.error('Error:', error)
      }
    },
  },
}
</script>

<template>
  <div class="login-view">
    <div class="form-container">
      <div class="d-flex justify-content-center">
        <img
          class="mb-2"
          src="https://static.vecteezy.com/system/resources/previews/011/660/012/non_2x/book-hand-drawn-sketch-png.png"
          alt="Logo"
          width="72"
          height="57"
        />
      </div>
      <div class="d-flex justify-content-center">
        <h1 class="h3 mb-3 fw-normal">Inicia Sesión</h1>
      </div>

      <form class="form w-100" v-on:submit.prevent="logUser">
        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="floatingInput"
            placeholder="Usuario"
            v-model="username"
          />
          <label for="floatingInput">Usuario</label>
        </div>
        <div class="form-floating mb-3">
          <input
            type="password"
            class="form-control"
            id="floatingPassword"
            placeholder="Contraseña"
            v-model="password"
          />
          <label for="floatingPassword">Contraseña</label>
        </div>

        <button
          class="btn btn-primary w-100 py-2"
          type="submit"
        >
          Continuar leyendo
        </button>

        <div class="text-center mt-3">
            <p>¿No tienes una cuenta? <RouterLink class="router-link" to="/register">Regístrate</RouterLink></p>
          </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  background: url('https://i.insider.com/579bb693dd0895ce188b4a47?width=1200&format=jpeg')
    no-repeat center center;
  background-size: cover;
  height: 100vh; /* Altura completa de la pantalla */
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-container {
  background-color: rgba(255, 255, 255, 0.9); /* Fondo semitransparente */
  padding: 2rem;
  border-radius: 10px;
  width: 90%; /* Ajusta el ancho */
  max-width: 400px; /* Ancho máximo para pantallas grandes */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25); /* Sombra para resaltar */
}

.form {
  text-align: center;
}

h1 {
  margin-bottom: 1.5rem;
}

.router-link {
  color: #000;
}
</style>
