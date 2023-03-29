<script setup>
import TheHeader from "@/components/TheHeader.vue";
import ProductCard from "@/components/ProductCard.vue";

import { useProductStore } from "../stores/ProductStore";
// import { storeToRefs } from "pinia";
// const { products } = storeToRefs(useProductStore());
import { useCartStore } from "../stores/CartStore";
import { reactive, ref } from "vue";
const productStore = useProductStore();
const cartStore = useCartStore();

const history = reactive([]);
const future = reactive([]);
const doingHistory = ref(false);

history.push(JSON.stringify(cartStore.$state));

const redo = () => {
  const latestState = future.pop();
  if (!latestState) return;
  doingHistory.value = true;
  history.push(latestState);
  cartStore.$state = JSON.parse(latestState);
  doingHistory.value = false;
};
const undo = () => {
  if (history.length === 1) return; // initial state [] just return
  doingHistory.value = true;
  future.push(history.pop());
  cartStore.$state = JSON.parse(history.at(-1)); // 뒤에서 첫번째 값
  doingHistory.value = false;
};
cartStore.$subscribe((mutation, state) => {
  if (!doingHistory.value) {
    // 히스토리 undo, redo일 땐 history 쌓는것 방지
    history.push(JSON.stringify(state));
    future.splice(0, future.length);
    // 새로 state값이 추가되면 future값은 빈 배열로 초기화
  }
});

cartStore.$onAction(({ name, store, args, after, onError }) => {
  if (name === "addItems") {
    after(() => {
      console.log(`cartStore subscribe addItems... ${args[0]}`);
    });
    onError((error) => {
      console.error(`message : ${error.message}`);
    });
  }
});
productStore.fill();
// const addToCart = (count, product) => {
//   count = parseInt(count);
//   cartStore.$patch((state) => {
//     for (let index = 0; index < count; index++) {
//       state.items.push(product);
//     }
//   });
// };
</script>

<template>
  <div class="container">
    <TheHeader />
    <div class="mb-5 flex justify-end">
      <AppButton @click="undo">Undo</AppButton>
      <AppButton class="ml-2" @click="redo">Redo</AppButton>
    </div>
    <ul class="sm:flex flex-wrap lg:flex-nowrap gap-5">
      <ProductCard
        v-for="product in productStore.products"
        :key="product.name"
        :product="product"
        @addToCart="cartStore.addItems($event, product)"
      />
    </ul>
  </div>
</template>
