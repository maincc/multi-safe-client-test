import transactionVue from "./transactionVue";
import store from "@/store";

import { render } from "@/js/render";

const TransactionOperate = (() => {
  let append = false;
  const v = render({ component: transactionVue, store });
  v.$mount();
  const child = v.$children[0];

  return () => {
    if (!append) {
      const container = document.querySelector("#main-right");
      container.appendChild(v.$el);
      append = true;
    }

    return child;
  };
})();

export default TransactionOperate;
