import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

import settings from "./modules/settings";
import search, { libraryReferenceSearchModule } from "./modules/search";
import references from "./modules/references";
import library from "./modules/library";
import tableSettings from "./modules/tableSettings";

Vue.use(Vuex);
const version = "1.0";

const vuexLocal = new VuexPersistence({
  key: `geoloogia.geokirjandus.${version}`,
  reducer: state => ({ search: state.search, settings: state.settings }),
  storage: window.localStorage
});

export default new Vuex.Store({
  modules: {
    settings,
    tableSettings,
    search,
    references,
    library,
    libraryReferenceSearch: libraryReferenceSearchModule,
    librarySearch: search
  },
  plugins: [vuexLocal.plugin],
  strict: process.env.NODE_ENV !== "production"
});
