<script>
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
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
      // eslint-disable-next-line no-undef
      const errorModal = new bootstrap.Modal(
        document.getElementById('errorModal'),
      )
      errorModal.show()
    },

    async registerUser() {
      console.log('registerUser()')

      if (this.validPassword === false) {
        this.showErrorModal('Contraseña inválida')
        return
      } else if (
        this.validRepeatedPassword == null ||
        this.validRepeatedPassword === false
      ) {
        this.showErrorModal('Las contraseñas no coinciden')
        return
      } else if (this.validUsername === false) {
        this.showErrorModal('Usuario inválido o en uso')
        return
      } else if (this.validEmail === false) {
        this.showErrorModal('Usuario inválido o en uso')
        return
      }

      const url =
        'https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/auth/register'

      const body = {
        username: this.username,
        password: this.password,
        email: this.email,
      }

      console.log('Body:', body)

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

        if (parsedBody.error != null) {
          if (parsedBody.error.includes('User already exists')) {
            console.log('User already exists')
            this.showErrorModal('Usuario ya existente.')
          } else if (parsedBody.error.includes('EmailAlreadyExists')) {
            this.showErrorModal('Correo electrónico ya registrado.')
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
        password: this.password,
        confirmation_code: this.validationToken,
      }

      console.log('Body:', body)

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
        } else {
          this.validToken = true

          // Persist the access token in localStorage
          localStorage.setItem('access_token', parsedBody.access_token)
          console.log('Access token saved:', parsedBody.access_token)

          // Persist the user data in userStore
          const user = {
            userName: this.username,
            name: '',
          }
          userStore.logIn(user)
          // Redirect the user to feed
          this.$router.push('/feed')
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
  <div class="bg-container">
    <div class="content-container">
      <!-- Logo -->
      <div class="logo-container">
        <img
          class="logo"
          src="https://static.vecteezy.com/system/resources/previews/011/660/012/non_2x/book-hand-drawn-sketch-png.png"
          alt="Readme Logo"
          width="72"
          height="57"
        />
        <h1 class="h3 mb-3 fw-normal">Te damos la bienvenida a Readme</h1>
      </div>

      <!-- Registro datos iniciales -->
      <template v-if="!shouldValidate">
        <form class="form-container" v-on:submit.prevent="registerUser">
          <!-- Username -->
          <div class="form-floating">
            <input
              type="username"
              class="form-control"
              placeholder="Usuario"
              v-model="username"
              :class="{
                'is-valid': validUsername === true,
                'is-invalid': validUsername === false,
              }"
            />
            <div class="invalid-feedback">Usuario inválido o en uso.</div>
            <label>Usuario</label>
          </div>
          <!-- Password -->
          <div class="form-floating">
            <input
              type="password"
              class="form-control"
              placeholder="Contraseña"
              v-model="password"
              :class="{
                'is-valid': validPassword === true,
                'is-invalid': validPassword === false,
              }"
              @input="validatePassword"
            />
            <div class="invalid-feedback">
              La contraseña debe tener mínimo 8 caracteres, una letra mayúscula,
              una minúscula, un número y un carácter especial.
            </div>
            <label>Contraseña</label>
          </div>
          <!-- Repeat password -->
          <div class="form-floating">
            <input
              type="password"
              class="form-control"
              placeholder="Repetir contraseña"
              v-model="repeatedPassword"
              :class="{
                'is-valid': validRepeatedPassword === true,
                'is-invalid': validRepeatedPassword === false,
              }"
              @input="validateRepeatedPassword"
            />
            <div class="invalid-feedback">Las contraseñas no coinciden.</div>
            <label>Repetir contraseña</label>
          </div>
          <!-- Email -->
          <div class="form-floating">
            <input
              type="email"
              class="form-control"
              placeholder="Correo electrónico"
              v-model="email"
              :class="{
                'is-valid': validEmail === true,
                'is-invalid': validEmail === false,
              }"
              @input="validateEmail"
            />
            <label>Correo electrónico</label>
            <div class="invalid-feedback">Correo inválido o en uso.</div>
          </div>

          <button class="btn btn-primary w-100 py-2" type="submit">
            Empieza a leer
          </button>

          <div class="text-center mt-3">
            <p>
              ¿Ya tienes una cuenta?
              <RouterLink class="router-link" to="/login"
                >Inicia sesión</RouterLink
              >
            </p>
          </div>
        </form>
      </template>

      <!-- Validación de cuenta -->
      <template v-else>
        <h3>Revisa tu casilla de correo para validar tu cuenta.</h3>
        <form class="form-container" v-on:submit.prevent="validateRegisterUser">
          <div class="form-floating">
            <input
              type="text"
              class="form-control"
              placeholder="Token de validación"
              v-model="validationToken"
              :class="{
                'is-invalid': validToken === false,
              }"
            />
            <div class="invalid-feedback">
              Token de validación incorrecto o caducado.
            </div>
            <label>Token de validación</label>
          </div>
          <button class="btn btn-primary w-100 py-2" type="submit">
            Validar cuenta
          </button>
        </form>
      </template>
    </div>
  </div>

  <!-- Modal de error -->
  <div
    class="modal fade"
    id="errorModal"
    tabindex="-1"
    aria-labelledby="errorModalLabel"
    aria-hidden="true"
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
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Imagen de fondo */
.bg-container {
  background-image: url('https://wwwaxiellcom.cdn.triggerfish.cloud/uploads/2019/03/library-activities.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Contenedor de contenido */
.content-container {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 500px;
}

/* Logo y título */
.logo-container {
  text-align: center;
  margin-bottom: 1.5rem;
}
.title {
  font-size: 1.5rem;
  font-weight: bold;
}

/* Formulario */
.form-container {
  width: 100%;
}

.router-link {
  color: #000;
}
</style>
