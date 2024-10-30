<script>
import { reactive, ref, computed, onMounted } from 'vue';
import HeaderComponent from '@/components/HeaderComponent.vue';

export default {
  name: 'FollowUsersView',
  components: {
    HeaderComponent,
  },
  setup() {
    const searchTerm = ref('');
    const users = reactive([]);

    const fetchUsers = async () => {
      try {
        const response = await fetch('https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users');
        const data = await response.json();
        // Mapea los usuarios obtenidos desde la API
        data.body.users.forEach(user => {
          users.push({
            name: user.username, 
            profilePicture: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png', 
            isFollowing: false,
          });
        });
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    const toggleFollow = (user) => {
      user.isFollowing = !user.isFollowing;
    };

    // Computed property para filtrar los usuarios según el término de búsqueda
    const filteredUsers = computed(() => {
      return users.filter(user => user.name.toLowerCase().includes(searchTerm.value.toLowerCase()));
    });

    // Llama a la API cuando el componente se monte
    onMounted(() => {
      fetchUsers();
    });

    return {
      searchTerm,
      users,
      filteredUsers,
      toggleFollow,
    };
  },
};
</script>

<template>
  <HeaderComponent />
  <div class="container pt-4">
    <div class="row">
      <div class="col">
        <h1>Otros Lectores</h1>
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Buscar usuarios por nombre" 
          class="form-control mb-3" 
        />
        <div class="list-group">
          <div 
            class="list-group-item d-flex justify-content-between align-items-center" 
            v-for="(user, index) in filteredUsers" 
            :key="index"
          >
            <div class="d-flex align-items-center">
              <img :src="user.profilePicture" alt="Profile" width="50" height="50" class="rounded-circle me-2"/>
              <div>
                <h5 class="mb-0">{{ user.name }}</h5> <!-- Solo muestra el nombre -->
              </div>
            </div>
            <button 
              class="btn" 
              :class="user.isFollowing ? 'btn-danger' : 'btn-primary'" 
              @click="toggleFollow(user)"
            >
              {{ user.isFollowing ? 'Dejar de Seguir' : 'Seguir' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-group-item {
  margin-bottom: 15px;
}

.btn-primary {
  background-color: #ffc107;
  color: black;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
}
</style>
