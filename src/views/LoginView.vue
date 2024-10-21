<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    logUser() {
      console.log('logUser()')
      console.log('Username:', this.username)
      console.log('Password:', this.password)
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
        <h1 class="h3 mb-3 fw-normal">Please log in</h1>
      </div>

      <form v-on:submit.prevent="logUser">
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

        <button class="btn btn-primary w-100 py-2" type="submit">
          Start Reading
        </button>
      </form>
    </div>
  </div>
</template>
