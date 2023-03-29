import { defineStore } from "pinia";

export const useAuthUserStore = defineStore("AuthUserStore", {
  state: () => ({
    username: "suhan_lee",
  }),
  getters: {
    email: () => "completed0728@gmail.com",
  },
  actions: {
    visitTwitterProfile() {
      window.open(`https://twitter.com/${this.username}`, "_blank");
    },
  },
});
