<script setup>
import { useBeersStore } from '../../store/store.ts'
import { storeToRefs } from 'pinia'

const beersStore = useBeersStore()
const { fetchBeers, toggleFavorite, setSearchQuery, setPage } = beersStore
const { error, searchQuery, currentPage, paginatedBeers, totalPages, isFavorite } = storeToRefs(beersStore)

// Fetch data on the server
await fetchBeers()

// Handle search
const updateSearch = (event) => {
  setSearchQuery(event.target.value)
}

// Handle pagination
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    setPage(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    setPage(currentPage.value - 1)
  }
}
</script>

<template>
  <div>
    <h1>Liste des Bières (Ale)</h1>
    
    <div v-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else>
      <div class="controls">
        <input 
          type="text" 
          :value="searchQuery" 
          @input="updateSearch" 
          placeholder="Rechercher une bière par nom..."
        />
      </div>

      <div class="beers-list">
        <div v-for="beer in paginatedBeers" :key="beer.id" class="beer-card">
          <img v-if="beer.image" :src="beer.image" :alt="beer.name" style="width: 100px; height: 100px; object-fit: contain;">
          <h2>{{ beer.name }}</h2>
          <p>{{ beer.price }}</p>
          <button @click="toggleFavorite(beer.id)">
            {{ isFavorite(beer.id) ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
          </button>
        </div>
      </div>

      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Précédent</button>
        <span>Page {{ currentPage }} sur {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Suivant</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error {
  color: red;
  font-weight: bold;
}
.controls {
  margin-bottom: 20px;
}
.beers-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.beer-card {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  width: 250px;
  text-align: center;
}
.pagination {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}
</style>
