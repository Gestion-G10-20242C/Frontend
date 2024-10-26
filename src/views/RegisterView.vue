<script>
export default {
  data() {
    return {
      username: '',
      validUsername: null,
      password: '',
      validPassword: null,
      repeatedPassword: '',
      validRepeatedPassword: null,
      email: '',
      validEmail: null,
      shouldValidate: false,
      validationToken: '',
      validToken: null,
      errorMessage: '',
    }
  },
  methods: {
    validatePassword() {
      console.log('validatePassword()')
      const passwordRegex = new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&.,])[A-Za-z\\d@$!%*?&.,]{8,}$',
      )
      this.validPassword = passwordRegex.test(this.password)
    },

    validateRepeatedPassword() {
      console.log('validateRepeatedPassword()')
      this.validRepeatedPassword = this.password === this.repeatedPassword
    },

    validateEmail() {
      console.log('validateEmail()')
      const emailRegex = new RegExp(
        '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      )
      this.validEmail = emailRegex.test(this.email)
    },
    showErrorModal(message) {
      this.errorMessage = message
      const errorModal = new bootstrap.Modal(
        document.getElementById('errorModal'),
      )
      errorModal.show()
    },

    async registerUser() {
      console.log('registerUser()')

      if (this.validPassword === false) {
        alert('Contraseña inválida')
        return
      } else if (
        this.validRepeatedPassword == null ||
        this.validRepeatedPassword === false
      ) {
        alert('Las contraseñas no coinciden')
        return
      } else if (this.validUsername === false) {
        alert('Usuario inválido o en uso')
        return
      } else if (this.validEmail === false) {
        alert('Email inválido o en uso')
        return
      }

      const url =
        'https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/auth/register'

      const body = {
        username: this.username,
        password: this.password,
        email: this.email,
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

        if (parsedBody.error != null) {
          if (parsedBody.error.includes('User already exists')) {
            console.log('User already exists')
            this.showErrorModal('Usuario ya existente.')
          } else if (parsedBody.error.includes('EmailAlreadyExists')) {
            this.showErrorModal('Email ya registrado.')
          }
          return
        } else {
          this.shouldValidate = true
        }
      } catch (error) {
        console.error('Error:', error)
        this.showErrorModal('Error al registrar el usuario.')
      }
    },

    async validateRegisterUser() {
      console.log('validateRegisterUser()')
      console.log('Validation token:', this.validationToken)

      const url =
        'https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/auth/validate'

      const body = {
        username: this.username,
        confirmation_code: this.validationToken,
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
        const parsedBody = JSON.parse(data.body)

        console.log('Response:', parsedBody)

        if (parsedBody.error != null) {
          this.validToken = false
          return
        }
      } catch (error) {
        console.error('Error:', error)
        this.showErrorModal('Error al validar la cuenta')
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
        <h1 class="h3 mb-3 fw-normal">Welcome to Readme</h1>
      </div>

      <!-- Registo datos iniciales -->
      <template v-if="!shouldValidate">
        <div
          class="container d-flex justify-content-center"
          style="margin-top: 5%"
        >
          <form
            class="w-50"
            v-on:submit.prevent="registerUser"
            style="min-width: 300px; max-width: 50%"
          >
            <!-- Username -->
            <div class="form-floating">
              <input
                type="username"
                class="form-control"
                id="floatingInput"
                placeholder=""
                v-model="username"
                :class="{
                  'is-valid': validUsername === true,
                  'is-invalid': validUsername === false,
                }"
              />
              <div class="invalid-feedback">Usuario invalido o en uso.</div>
              <label for="floatingInput">Username</label>
            </div>
            <!-- Password -->
            <div class="form-floating">
              <input
                type="password"
                class="form-control"
                id="floatingPassword"
                placeholder=""
                v-model="password"
                :class="{
                  'is-valid': validPassword === true,
                  'is-invalid': validPassword === false,
                }"
                @input="validatePassword"
              />
              <div class="invalid-feedback">
                La contraseña debe tener mínimo 8 caracteres, una letra
                mayúscula, una minúscula, un número y un caracter especial.
              </div>
              <label for="floatingPassword">Password</label>
            </div>
            <!-- Repeat password -->
            <div class="form-floating">
              <input
                type="password"
                class="form-control"
                id="floatingRepeatedPassword"
                placeholder=""
                v-model="repeatedPassword"
                :class="{
                  'is-valid': validRepeatedPassword === true,
                  'is-invalid': validRepeatedPassword === false,
                }"
                @input="validateRepeatedPassword"
              />
              <div class="invalid-feedback">Las contraseñas no coinciden.</div>
              <label for="floatingRepeatedPassword">Repetir contraseña</label>
            </div>
            <!-- Email -->
            <div class="form-floating">
              <input
                type="email"
                class="form-control"
                id="floatingEmail"
                placeholder=""
                v-model="email"
                :class="{
                  'is-valid': validEmail === true,
                  'is-invalid': validEmail === false,
                }"
                @input="validateEmail"
              />
              <label for="floatingEmail">Email</label>
              <div class="invalid-feedback">Correo invalido o en uso.</div>
            </div>

            <button
              class="btn btn-primary w-100 py-2"
              type="submit"
              style="margin-top: 5%"
            >
              register
            </button>
          </form>
        </div>
      </template>

      <!-- Validación de cuenta -->
      <template v-else>
        <div
          class="container d-flex justify-content-center"
          style="margin-top: 3%"
        >
          <h3>Revise su casilla de correo para validar su cuenta.</h3>
        </div>
        <div
          class="container d-flex justify-content-center"
          style="margin-top: 2%"
        >
          <form class="w-50" v-on:submit.prevent="validateRegisterUser">
            <div class="form-floating">
              <input
                type="validationToken"
                class="form-control"
                id="floatingInput"
                placeholder=""
                v-model="validationToken"
                :class="{
                  'is-invalid': validToken === false,
                }"
              />
              <div class="invalid-feedback">
                Token de validación incorrecto o caducado.
              </div>
              <label for="floatingInput">Token de validación</label>
            </div>
            <button class="btn btn-primary w-100 py-2" type="submit">
              Validar cuenta
            </button>
          </form>
        </div>
      </template>
    </div>
  </div>

  <!-- Modal -->
  <div
    class="modal fade"
    id="errorModal"
    tabindex="-1"
    aria-labelledby="errorModalLabel"
    aria-hidden="true"
    style="margin-top: 16%"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="errorModalLabel">Error</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          {{ errorMessage }}
        </div>
        <div class="modal-footer"></div>
      </div>
    </div>
  </div>
</template>
