<script>
import { reactive, ref, computed } from 'vue'
import HeaderComponent from '@/components/HeaderComponent.vue'

export default {
  name: 'FollowUsersView',
  components: {
    HeaderComponent,
  },
  setup() {
    const searchTerm = ref('');
    
    const users = reactive([
      {
        name: 'Carlos Fontela',
        profilePicture: 'https://cysingsoft.wordpress.com/wp-content/uploads/2009/01/carlosfontela6.jpg?w=584',
        username: '@carlosfontela',
        isFollowing: false,
      },
      {
        name: 'Ana Pérez',
        profilePicture: 'https://randomuser.me/api/portraits/women/1.jpg',
        username: '@anaperez',
        isFollowing: false,
      },
      {
        name: 'Luis Gómez',
        profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
        username: '@luisgomez',
        isFollowing: false,
      },
      {
        name: 'Sofía Rodríguez',
        profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
        username: '@sofiarodriguez',
        isFollowing: false,
      },
      {
        name: 'José Martínez',
        profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg',
        username: '@josemartinez',
        isFollowing: false,
      },
    ]);

    const toggleFollow = (user) => {
      user.isFollowing = !user.isFollowing;
    };

    // Computed property to filter users based on the search term
    const filteredUsers = computed(() => {
      return users.filter(user => user.name.toLowerCase().includes(searchTerm.value.toLowerCase()));
    });

    return {
      searchTerm,
      users,
      filteredUsers,
      toggleFollow,
    };
  },
}
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
                <h5 class="mb-0">{{ user.name }}</h5>
                <small class="text-muted">{{ user.username }}</small>
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
  background-color: #ffc107; /* Color de fondo para "Seguir" */
  color: black; /* Color del texto */
}

.btn-danger {
  background-color: #dc3545; /* Color de fondo para "Dejar de Seguir" */
  color: white; /* Color del texto */
}

.btn {
  padding: 0.5rem 1rem; /* Ajusta el padding para botones */
  border: none; /* Sin borde */
  border-radius: 0.25rem; /* Bordes redondeados */
}
</style>
