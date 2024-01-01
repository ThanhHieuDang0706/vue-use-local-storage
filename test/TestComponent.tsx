import { PropType, defineComponent, h } from "vue";
import useLocalStorage from "../src";

export const TEST_ID = "test-result";

export default defineComponent({
  props: {
    initalValue: {
      type: Object as PropType<unknown>,
      default: () => ({})
    },
    localStorageKey: {
      type: String,
      default: "test"
    },
  },
  setup(props) {
    const data =
      useLocalStorage(props.localStorageKey, props.initalValue);

    return {
      dataRef: {
        data
      },
    };
  },

  render() {
    return h("p", { id: TEST_ID }, this.dataRef.data.value);
  }
});