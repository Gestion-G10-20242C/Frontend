<script>
import { useUserStore } from '@/stores/user'; 
import HeaderComponent from '@/components/HeaderComponent.vue';

export default {
  name: 'ConfigView',
  components: {
    HeaderComponent,
  },
  data() {
    return {
      availableGenres: [
        "Ciencia Ficción", 
        "Comics", 
        "Fantasía", 
        "Historia", 
        "Misterio", 
        "Romance",
      ],
      selectedGenres: [], // Géneros seleccionados en el modal
      isModalOpen: false, // Estado del modal
    };
  },
  computed: {
    // Obtener los géneros preferidos del usuario desde el store de Pinia
    userPreferredGenres() {
      const userStore = useUserStore();
      return userStore.favouriteGenres || [];
    },
  },
  methods: {
    async fetchGenres() {
      const userStore = useUserStore();
      this.selectedGenres = [...userStore.favouriteGenres];
    },

    openEditGenresModal() {
      // Abrir el modal y cargar los géneros actuales del usuario
      this.fetchGenres(); // Llamada a la función para cargar los géneros
      this.isModalOpen = true;
    },

    closeEditGenresModal() {
      // Cerrar el modal sin guardar cambios
      this.isModalOpen = false;
    },

    async saveGenres() {
      const userStore = useUserStore();
      const token = localStorage.getItem('access_token');
      
      // Obtener el nombre de usuario del store de Pinia
      const username = userStore.userName;
      const userData = userStore.getUserData();

      console.log('userData', userData);
      console.log('selectedGenres', this.selectedGenres);

      userData.selectedGenres = this.selectedGenres;

      // Guardar los géneros en la base de datos
      await this.saveFavouriteGenres(username, token, userData);

      // Actualizar los géneros en el store de Pinia
      userStore.favouriteGenres = [...this.selectedGenres];
      userStore.$persist(); // Persistir los cambios en el store
      this.closeEditGenresModal(); // Cerrar el modal
    },

    async saveFavouriteGenres(username, token, userData) {
      try {
        const response = await fetch(`https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          throw new Error('No se pudo guardar los géneros favoritos');
        }

        const data = await response.json();
        return data; // Retorna la respuesta de la API (si es necesario)
      } catch (error) {
        console.error('Error saving favourite genres:', error);
      }
    },
  },
};
</script>


<template>
    <div class="config-view">
      <HeaderComponent />
      <div class="container mt-5">
        <h1>Configuración</h1>
  
        <!-- Mostrar géneros preferidos si existen -->
        <div v-if="userPreferredGenres.length > 0">
          <h3>Géneros preferidos</h3>
          <ul>
            <li v-for="genre in userPreferredGenres" :key="genre">{{ genre }}</li>
          </ul>
        </div>
  
        <!-- Si no hay géneros preferidos, mostrar mensaje -->
        <div v-else>
          <h3>Géneros preferidos</h3>
          <p>No tienes géneros favoritos seleccionados.</p>
        </div>
  
        <!-- Botón de edición siempre visible -->
        <button @click="openEditGenresModal" class="btn btn-primary">
          Editar géneros
        </button>
  
        <!-- Modal para seleccionar géneros -->
        <div v-if="isModalOpen" class="modal">
          <div class="modal-content">
            <h3>Selecciona tus géneros</h3>
            <div class="genre-selection">
              <label v-for="genre in availableGenres" :key="genre" class="genre-label">
                <input type="checkbox" :value="genre" v-model="selectedGenres" />
                {{ genre }}
              </label>
            </div>
            <div class="modal-buttons">
              <button @click="saveGenres" class="btn btn-success">Guardar cambios</button>
              <button @click="closeEditGenresModal" class="btn btn-secondary">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    background: white;
    padding: 30px;
    border-radius: 8px;
    width: 500px;
    max-width: 90%;
    text-align: left;
  }
  
  .genre-selection {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  
  .genre-label {
    margin-bottom: 10px;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: space-between;
  }
  
  .modal-buttons .btn {
    width: 45%;
  }
  </style>
  