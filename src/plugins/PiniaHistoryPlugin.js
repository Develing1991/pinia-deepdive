import { reactive, ref } from "vue";
export function PiniaHistoryPlugin({ pinia, app, store, options }) {
  //context
  if (!options.historyEnabled) return;

  const history = reactive([]);
  const future = reactive([]);
  const doingHistory = ref(false);

  history.push(JSON.stringify(store.$state));

  const redo = () => {
    const latestState = future.pop();
    if (!latestState) return;
    doingHistory.value = true;
    history.push(latestState);
    store.$state = JSON.parse(latestState);
    doingHistory.value = false;
  };
  const undo = () => {
    if (history.length === 1) return; // initial state [] just return
    doingHistory.value = true;
    future.push(history.pop());
    store.$state = JSON.parse(history.at(-1)); // 뒤에서 첫번째 값
    doingHistory.value = false;
  };
  store.$subscribe((mutation, state) => {
    if (!doingHistory.value) {
      // 히스토리 undo, redo일 땐 history 쌓는것 방지
      history.push(JSON.stringify(state));
      future.splice(0, future.length);
      // 새로 state값이 추가되면 future값은 빈 배열로 초기화
    }
  });

  return {
    history,
    future,
    undo,
    redo,
  };
}
