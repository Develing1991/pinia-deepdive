import { defineStore, acceptHMRUpdate } from "pinia";
import { groupBy } from "lodash";
import { useAuthUserStore } from "./AuthUserStore";
import { useLocalStorage } from "@vueuse/core";

export const useCartStore = defineStore("CartStore", {
  historyEnabled: true,
  state: () => ({
    items: useLocalStorage("CartStore:items", []),
  }),
  getters: {
    // arrow function에서는 this는 사용불가
    count: (state) => state.items.length,
    isEmpty() {
      return this.items.length <= 0;
    },
    grouped: (state) => {
      const grouped = groupBy(state.items, (item) => item.name);
      const sorted = Object.keys(grouped).sort();
      let inOrder = {};
      sorted.forEach((key) => (inOrder[key] = grouped[key]));
      return inOrder;
    },
    groupCount: (state) => (name) => state.grouped[name].length,
    totalPrice: (state) => state.items.reduce((p, c) => p + c.price, 0),
  },
  actions: {
    checkout() {
      const authUserStore = useAuthUserStore();
      alert(
        `${authUserStore.username} just bouth ${this.count}, ${this.totalPrice}`
      );
    },
    addItems(count, item) {
      count = parseInt(count);
      // throw new Error("test error");
      for (let index = 0; index < count; index++) {
        this.items.push({ ...item });
      }
    },
    removeItems(name) {
      this.items = this.items.filter((item) => item.name !== name);
    },
    setItemCount(item, count) {
      this.removeItems(item.name);
      this.addItems(count, item);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot));
}
//   this.$patch((state)=>{
//     for (let index = 0; index < count; index++) {
//         state.items.push(item);

//       }
//   })
