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

      // Create the body for the request
      const body = {
        username: this.username,
        password: this.password,
      }

      try {
        // Make the POST request
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })

        // Handle the response
        const data = await response.json()
        const parsedBody = JSON.parse(data.body) // Parse the body field

        console.log('Response:', parsedBody)

        if ('error' in parsedBody) {
          throw new Error('Error: ' + parsedBody.error)
        }
        // Persist the access token in localStorage
        localStorage.setItem('access_token', parsedBody.access_token)
        console.log('Access token saved:', parsedBody.access_token)

        // Remove chat data from the store
        chatStore.resetStore()

        // Persist the user data in userStore
        userStore.logIn(this.username)

        // Redirect the user to feed
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
  <div class="d-flex justify-content-center p-5">
    <div class="form-signin w-100 m-auto">
      <div class="d-flex justify-content-center">
        <img
          class="mb-2"
          src="https://static.vecteezy.com/system/resources/previews/011/660/012/non_2x/book-hand-drawn-sketch-png.png"
          alt=""
          width="72"
          height="57"
        />
      </div>
      <div class="d-flex justify-content-center">
        <h1 class="h3 mb-3 fw-normal">Inicia Sesión</h1>
      </div>

      <div
        class="container d-flex justify-content-center"
        style="margin-top: 5%"
      >
        <form class="w-50" v-on:submit.prevent="logUser">
          <div class="form-floating">
            <input
              type="username"
              class="form-control"
              id="floatingInput"
              placeholder=""
              v-model="username"
            />
            <label for="floatingInput">Username</label>
          </div>
          <div class="form-floating">
            <input
              type="password"
              class="form-control"
              id="floatingPassword"
              placeholder=""
              v-model="password"
            />
            <label for="floatingPassword">Password</label>
          </div>

          <button
            class="btn btn-primary w-100 py-2"
            type="submit"
            style="margin-top: 5%"
          >
            Empieza a leer
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
