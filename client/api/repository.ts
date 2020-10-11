// Provide nuxt-axios instance to use same configuration across the whole project
// I've used typical CRUD method names and actions here
export default ($axios) => (resource) => ({
  index() {
    return $axios.$get(`/${resource}`);
  },

  get(id) {
    return $axios.$get(`/${resource}/${id}`);
  },

  post(payload = {}) {
    return $axios.$post(`/${resource}`, payload);
  },

  update(id, payload) {
    return $axios.$post(`/${resource}/${id}`, payload);
  },

  delete(id) {
    return $axios.$delete(`/${resource}/${id}`);
  }
});
