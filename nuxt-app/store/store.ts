import { defineStore } from 'pinia'

export const useBeersStore = defineStore('beers', {
  state: () => ({
    beers: [] as any[],
    error: null as string | null,
    searchQuery: '',
    currentPage: 1,
    itemsPerPage: 10,
    favorites: [] as number[],
  }),
  actions: {
    async fetchBeers() {
      try {
        this.error = null;
        const { data, error } = await useFetch('https://api.sampleapis.com/beers/ale')
        
        if (error.value) {
          throw new Error('Erreur lors de la récupération des bières')
        }
        
        this.beers = data.value as any[] || []
      } catch (e: any) {
        this.error = e.message || 'La requête à l\'API a échoué'
      }
    },
    toggleFavorite(id: number) {
      const index = this.favorites.indexOf(id)
      if (index > -1) {
        this.favorites.splice(index, 1)
      } else {
        this.favorites.push(id)
      }
    },
    setSearchQuery(query: string) {
      this.searchQuery = query
      this.currentPage = 1 // Reset page on search
    },
    setPage(page: number) {
      this.currentPage = page
    }
  },
  getters: {
    filteredBeers: (state) => {
      let result = state.beers
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        result = result.filter(beer => beer.name?.toLowerCase().includes(query))
      }
      return result
    },
    paginatedBeers(): any[] {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredBeers.slice(start, end)
    },
    totalPages(): number {
      return Math.ceil(this.filteredBeers.length / this.itemsPerPage)
    },
    isFavorite: (state) => (id: number) => {
      return state.favorites.includes(id)
    }
  }
})
