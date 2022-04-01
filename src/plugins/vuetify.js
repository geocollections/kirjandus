import "@fortawesome/fontawesome-free/css/all.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";
import EmaapouIcon from "@/components/EmaapouIcon";
import EmaapouIconBlack from "@/components/EmaapouIconBlack";
Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "fa",
    values: {
      emaapouIcon: { component: EmaapouIcon },
      emaapouIconBlack: { component: EmaapouIconBlack }
    }
  },
  theme: {
    themes: {
      light: {
        primary: "#fffcf8",
        secondary: "#ea9219",
        accent: "#135ebf",
        anchor: "#135ebf"
      }
    },
    options: { customProperties: true }
  }
});
