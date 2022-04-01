<template>
  <v-container>
    <v-row justify="center">
      <v-col class="px-2 px-sm-3">
        <v-breadcrumbs
          v-if="reference"
          class="pa-0"
          :items="[
            {
              text: $t('tabs.references'),
              to: { name: 'searchReference' },
              exact: true
            },
            {
              text: `${reference.reference}`
            }
          ]"
        >
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item
              v-if="item.to"
              :exact="item.exact"
              :to="item.to"
            >
              <span class="grey--text text--darken-3 link">
                {{ item.text }}
              </span>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item v-else>{{ item.text }}</v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
        <v-fade-transition :hide-on-leave="true">
          <div>
            <v-card
              flat
              color="transparent"
              class="mb-4 d-flex justify-center"
              v-if="reference"
            >
              <v-card-title
                class="title pt-1 pb-1 px-0 d-inline-block justify-center text-center font-family-exo-2 font-weight-medium text-h4"
              >
                {{ `${reference.reference}: ${reference.title}` }}
                <v-btn
                  link
                  icon
                  small
                  style="vertical-align: top;"
                  color="deep-orange darken-2"
                  class="d-print-none"
                  :href="
                    `https://edit.geocollections.info/reference/${reference.id}`
                  "
                  target="_blank"
                  rel="noopener"
                >
                  <v-icon small>fas fa-edit</v-icon>
                </v-btn>
              </v-card-title>
            </v-card>
            <v-card
              class="ml-auto mr-auto elevation-3 px-1 py-1"
              v-if="reference"
              elevation="0"
              outlined
            >
              <v-card-text>
                <div class="d-flex align-center pb-2">
                  <div class="text-h6">
                    {{ $t("common.citation") }}
                  </div>
                  <citation-select
                    style="max-width: 150px"
                    id="citationSelect"
                    class="ml-auto  py-0"
                  />
                </div>
                <base-citation-detail
                  :citation="citation($getCslDetail(reference))"
                />
              </v-card-text>
              <v-card-actions class="py-0">
                <reference-links :item="reference" />
                <v-spacer />
              </v-card-actions>
              <v-card-text class=" row ma-0">
                <div class="col-12 col-md pa-0">
                  <div class="text-h6 pb-2">
                    {{ $t("common.generalInfo") }}
                  </div>
                  <v-card outlined flat>
                    <v-simple-table>
                      <template v-slot:default>
                        <tbody>
                          <tr v-if="reference.author">
                            <th>{{ $t("reference.author") }}</th>
                            <td>{{ reference.author }}</td>
                          </tr>
                          <tr v-if="reference.author_original">
                            <th>{{ $t("reference.authorOriginal") }}</th>
                            <td>{{ reference.author_original }}</td>
                          </tr>
                          <tr v-if="reference.year">
                            <th>{{ $t("reference.year") }}</th>
                            <td>{{ reference.year }}</td>
                          </tr>
                          <tr v-if="reference.title">
                            <th>{{ $t("reference.title") }}</th>
                            <td>{{ reference.title }}</td>
                          </tr>
                          <tr v-if="reference.title_translated">
                            <th>{{ $t("reference.titleTranslated") }}</th>
                            <td>{{ reference.title_translated }}</td>
                          </tr>
                          <tr v-if="reference.title_original">
                            <th>{{ $t("reference.titleOriginal") }}</th>
                            <td>{{ reference.title_original }}</td>
                          </tr>
                          <tr v-if="reference.book">
                            <th>{{ $t("reference.book") }}</th>
                            <td>{{ reference.book }}</td>
                          </tr>
                          <tr v-if="reference.book_translated">
                            <th>{{ $t("reference.bookTranslated") }}</th>
                            <td>{{ reference.book_translated }}</td>
                          </tr>
                          <tr v-if="reference.book_original">
                            <th>{{ $t("reference.bookOriginal") }}</th>
                            <td>{{ reference.book_original }}</td>
                          </tr>
                          <tr v-if="reference.book_editor">
                            <th>{{ $t("reference.bookEditor") }}</th>
                            <td>{{ reference.book_editor }}</td>
                          </tr>
                          <tr v-if="reference.publisher">
                            <th>{{ $t("reference.publisher") }}</th>
                            <td>{{ reference.publisher }}</td>
                          </tr>
                          <tr v-if="reference.publisher_place">
                            <th>{{ $t("reference.publisherPlace") }}</th>
                            <td>{{ reference.publisher_place }}</td>
                          </tr>
                          <tr v-if="journal && journal.journal_name">
                            <th>{{ $t("reference.journalName") }}</th>
                            <td>{{ journal.journal_name }}</td>
                          </tr>
                          <tr v-if="journal && journal.journal_short">
                            <th>{{ $t("reference.journalNameShort") }}</th>
                            <td>{{ journal.journal_short }}</td>
                          </tr>
                          <tr v-if="reference.parent_reference">
                            <th>{{ $t("reference.parentReference") }}</th>
                            <td>
                              <router-link
                                :to="{
                                  path: `${reference.parent_reference.id}`
                                }"
                              >
                                {{ reference.parent_reference.title }}
                              </router-link>
                            </td>
                          </tr>
                          <tr v-if="reference.volume">
                            <th>{{ $t("reference.volume") }}</th>
                            <td>{{ reference.volume }}</td>
                          </tr>
                          <tr v-if="reference.number">
                            <th>{{ $t("reference.number") }}</th>
                            <td>{{ reference.number }}</td>
                          </tr>
                          <tr v-if="reference.pages">
                            <th>{{ $t("reference.pages") }}</th>
                            <td>{{ reference.pages }}</td>
                          </tr>
                          <tr v-if="type">
                            <th>{{ $t("reference.type") }}</th>
                            <td
                              v-translate="{
                                et: reference.type.value,
                                en: reference.type.value_en
                              }"
                            />
                          </tr>
                          <tr v-if="reference.figures">
                            <th>{{ $t("reference.figures") }}</th>
                            <td>{{ reference.figures }}</td>
                          </tr>
                          <tr v-if="reference.language">
                            <th>{{ $t("reference.language") }}</th>
                            <td
                              v-translate="{
                                et: reference.language.value,
                                en: reference.language.value_en
                              }"
                            />
                          </tr>
                          <tr>
                            <th>{{ $t("reference.isOa") }}</th>
                            <td>
                              {{
                                reference.is_oa
                                  ? $t("common.yes")
                                  : $t("common.no")
                              }}
                            </td>
                          </tr>
                          <tr v-if="reference.doi">
                            <th>{{ $t("reference.doi") }}</th>
                            <td>
                              <a
                                class="link"
                                :href="reference.doi_url"
                                target="_blank"
                                >{{ reference.doi }}</a
                              >
                            </td>
                          </tr>
                          <tr v-if="reference.url">
                            <th>{{ $t("reference.url") }}</th>
                            <td>
                              <a
                                class="link"
                                :href="reference.url"
                                target="_blank"
                                style="word-break: break-all"
                                >{{ reference.url }}</a
                              >
                            </td>
                          </tr>
                          <tr v-if="reference.licence">
                            <th>{{ $t("reference.licence") }}</th>
                            <td>
                              <a
                                class="link"
                                :href="reference.licence_url"
                                v-translate="{
                                  et: reference.licence.licence,
                                  en: reference.licence.licence_en
                                }"
                                target="_blank"
                              />
                            </td>
                          </tr>
                          <tr v-if="reference.is_estonian_reference">
                            <th>{{ $t("reference.isEstonianReference") }}</th>
                            <td>
                              {{ $t("common.yes") }}
                            </td>
                          </tr>

                          <tr v-if="reference.is_estonian_author">
                            <th>{{ $t("reference.isEstonianAuthor") }}</th>
                            <td>
                              {{ $t("common.yes") }}
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card>
                </div>
                <div
                  class="col-12 col-md-6 pa-0 pl-md-4 pt-4 pt-md-0"
                  v-if="
                    reference.abstract ||
                      localities.length > 0 ||
                      siteMarkers.length > 0 ||
                      areas.length > 0
                  "
                >
                  <div class="pb-3" v-if="reference.abstract">
                    <div class="text-h6 pb-2">
                      {{ $t("reference.abstract") }}
                    </div>

                    <read-more
                      v-if="localities.length > 0"
                      :html-str="reference.abstract"
                    />
                    <div v-else v-html="reference.abstract" />
                  </div>
                  <div
                    v-if="
                      localityMarkers.length > 0 ||
                        siteMarkers.length > 0 ||
                        areas.length > 0
                    "
                  >
                    <span class="d-flex">
                      <div class="text-h6 pb-2">
                        {{ $t("common.map") }}
                      </div>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            class="px-1 align-self-start"
                            color="primary"
                            dark
                            x-small
                            v-bind="attrs"
                            v-on="on"
                            >fas fa-info</v-icon
                          >
                        </template>
                        <span>{{ $t("tooltip.map") }}</span>
                      </v-tooltip>
                    </span>
                    <v-card flat outlined>
                      <leaflet-map
                        :markers="localityMarkers"
                        :siteMarkers="siteMarkers"
                        :areas="areas"
                      />
                    </v-card>
                  </div>
                  <v-card-text v-if="localities.length > 0" class="row ma-0">
                    <div class="col-12 col-md-6 pa-0">
                      <div class="text-h6 pb-2">
                        {{ $t("reference.localities") }}
                      </div>

                      <ul
                        style="max-height:200px; overflow-y: auto; width: max-content"
                      >
                        <li
                          v-for="(locality, index) in localities"
                          :key="`locality-${index}`"
                        >
                          <a
                            class="link"
                            :href="localityURL(locality.locality.id)"
                            target="_blank"
                            v-translate="{
                              et: locality.locality.locality,
                              en: locality.locality.locality_en
                            }"
                          />
                        </li>
                      </ul>
                    </div>
                  </v-card-text>
                  <v-card-text v-if="sites.length > 0" class="row ma-0">
                    <div class="col-12 col-md-6 pa-0">
                      <div class="text-h6 pb-2">
                        {{ $t("reference.sites") }}
                      </div>

                      <ul
                        style="max-height:200px; overflow-y: auto; width: max-content"
                      >
                        <li v-for="site in sites" :key="site.site.id">
                          class="link" :href="siteURL(site.site.id)"
                          target="_blank" v-translate="{ et: site.site.name, en:
                          site.site.name_en }" />
                        </li>
                      </ul>
                    </div>
                  </v-card-text>
                  <v-card-text v-if="areas.length > 0" class="row ma-0">
                    <div class="col-12 col-md-6 pa-0">
                      <div class="text-h6 pb-2">
                        {{ $t("reference.areas") }}
                      </div>

                      <ul
                        style="max-height:200px; overflow-y: auto; width: max-content"
                      >
                        <li v-for="area in areas" :key="area.area.id">
                          <a
                            class="link"
                            :href="areaURL(area.area.id)"
                            target="_blank"
                            v-translate="{
                              et: area.area.name,
                              en: area.area.name_en
                            }"
                          />
                        </li>
                      </ul>
                    </div>
                  </v-card-text>
                </div>
              </v-card-text>
              <v-card-text v-if="reference.remarks">
                <div class="text-h6 pb-2">
                  {{ $t("reference.remarks") }}
                </div>
                <div v-html="reference.remarks"></div>
              </v-card-text>
              <v-card-text v-if="keywords.length > 0">
                <div class="text-h6 pb-2">
                  {{ $t("reference.keywords") }}
                </div>

                <span v-for="(keyword, index) in keywords" :key="index">
                  <v-chip
                    outlined
                    :color="$vuetify.theme.themes.light.accent"
                    text-color="black"
                    class="mr-1 mb-1"
                    @click="handleKeyword(keyword.keyword.keyword)"
                  >
                    {{ keyword.keyword.keyword }}
                  </v-chip>
                </span>
              </v-card-text>
              <v-card-text v-if="childReferences.length > 0">
                <div class="text-h6 pb-2">
                  {{ $t("reference.contains") }}
                </div>
                <v-card flat outlined>
                  <v-simple-table dense>
                    <tbody>
                      <tr
                        v-for="childReference in childReferences"
                        :key="`child-reference-${childReference.id}`"
                      >
                        <td>
                          <router-link
                            :to="{
                              name: 'reference',
                              params: { id: `${childReference.id}` }
                            }"
                          >
                            {{ childReference.author }}
                          </router-link>
                        </td>
                        <td>{{ childReference.title }}</td>
                        <td>{{ childReference.pages }}</td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </v-card>
              </v-card-text>

              <v-card-text v-if="taxa.length > 0">
                <div class="col-12 col-md-6 pa-0 pt-4 pt-md-0">
                  <div class="text-h6 pb-2">
                    {{ $t("reference.describedTaxa") }}
                  </div>
                  <ul>
                    <li v-for="taxon in taxa" :key="`taxon-${taxon.id}`">
                      <a
                        class="link"
                        :href="taxonURL(taxon.id)"
                        target="_blank"
                        >{{ taxon.taxon }}</a
                      >
                    </li>
                  </ul>
                </div>
              </v-card-text>
              <v-card-text v-if="libraries.length > 0">
                <div class="text-h6 pb-2">
                  {{ $t("reference.libraries") }}
                </div>
                <span
                  class="py-3"
                  v-for="(library, index) in libraries"
                  :key="index"
                >
                  <v-chip
                    outlined
                    :color="$vuetify.theme.themes.light.accent"
                    text-color="black"
                    class="mr-1 mb-1"
                    v-translate="{
                      et: library.library.title,
                      en: library.library.title_en
                    }"
                    @click="
                      $router.push({
                        name: `library`,
                        params: { id: library.library.id }
                      })
                    "
                  />
                </span>
              </v-card-text>
              <v-card-text>
                <div class="text-h6 pb-2">
                  {{ $t("common.misc") }}
                </div>
                <v-card flat outlined>
                  <v-simple-table>
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <th>{{ $t("reference.id") }}</th>
                          <td>{{ reference.id }}</td>
                        </tr>
                        <tr v-if="reference.user_added">
                          <th>{{ $t("reference.dateAdded") }}</th>
                          <td>
                            {{ formatDate(reference.date_added) }}
                          </td>
                        </tr>
                        <tr v-if="reference.user_changed">
                          <th>{{ $t("reference.dateChanged") }}</th>
                          <td>
                            {{ formatDate(reference.date_changed) }}
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card>
              </v-card-text>
            </v-card>
            <v-card flat color="transparent" v-else-if="error">
              <div class="text-h4 text-center">
                {{ $t("error.referenceId", { text: id }) }}
              </div>
              <v-card-actions class="mt-4">
                <v-btn
                  class="ml-auto mr-auto font-family-exo-2"
                  :to="{ name: 'searchReference' }"
                  color="accent"
                >
                  {{ $t("common.viewReferencesError") }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-fade-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { fetchReference } from "@/utils/apiCalls";
import dateMixin from "@/mixins/dateMixin";
import LeafletMap from "@/components/LeafletMap";
import ReferenceLinks from "@/components/reference/ReferenceLinks";
import CitationSelect from "@/components/CitationSelect";
import { mapState, mapActions } from "vuex";
import urlMixin from "@/mixins/urlMixin";
import citationMixin from "@/mixins/citationMixin";

import axios from "axios";

import ReadMore from "@/components/ReadMore";
import BaseCitationDetail from "@/components/base/BaseCitationDetail.vue";
export default {
  name: "Reference",
  components: {
    ReadMore,
    ReferenceLinks,
    LeafletMap,
    CitationSelect,
    BaseCitationDetail
  },
  mixins: [dateMixin, urlMixin, citationMixin],
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      reference: null,
      libraries: [],
      localities: [],
      localityMarkers: [],
      error: false,
      childReferences: [],
      keywords: [],
      taxa: [],
      sites: [],
      siteMarkers: [],
      areas: []
    };
  },
  metaInfo() {
    return {
      title: this.reference?.title,
      meta: [
        {
          property: "og:title",
          vmid: "og:title",
          content: `${this.reference?.reference}: ${this.reference?.title}`
        },
        {
          property: "keywords",
          content: this.reference?.keywords
        }
      ]
    };
  },
  computed: {
    ...mapState("search", ["search", "advancedSearch"]),
    journal() {
      return this.reference?.journal;
    },
    type() {
      return this.reference?.type;
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.getReference(to.params.id);
    this.childReferences = [];
    this.localities = [];
    next();
  },
  created() {
    this.getReference(this.$route.params.id);
  },
  methods: {
    ...mapActions("search/reference", ["updateAdvancedSearch"]),
    handleKeyword(keyword) {
      this.updateAdvancedSearch({
        value: keyword,
        id: "keywords"
      });
      this.$router.push({ name: "searchReference" });
    },
    localityURL(id) {
      return `https://geoloogia.info/locality/${id}`;
    },
    siteURL(id) {
      return `https://geoloogia.info/site/${id}`;
    },
    areaURL(id) {
      return `https://geoloogia.info/area/${id}`;
    },
    taxonURL(id) {
      return `https://fossiilid.info/${id}`;
    },
    parseAreaPolygon(polygonValue) {
      try {
        // NOTE: Remove trailing commas from JSON object string
        // eslint-disable-next-line no-useless-escape
        const regex = /\,(?!\s*?[\{\[\"\'\w])/g;
        return JSON.parse(polygonValue.replace(regex, ""));
      } catch (e) {
        return null;
      }
    },
    geojson(polygon) {
      if (polygon === null) return null;
      if (!(polygon instanceof Array)) return polygon;
      else
        return {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: polygon
          }
        };
    },
    async getReferenceLibraries() {
      const localityReferenceResponse = await axios.get(
        `https://api.geoloogia.info/library_reference/?reference=${this.reference.id}&nest=1`
      );
      return localityReferenceResponse.data;
    },
    async getReferenceLocalities() {
      const localityReferenceResponse = await axios.get(
        `https://api.geoloogia.info/locality_reference/?reference=${this.reference.id}&nest=1&limit=500&ordering=title`
      );
      return localityReferenceResponse.data;
    },
    async getChildReferences() {
      const childReferenceResponse = await axios.get(
        `https://api.geoloogia.info/reference/?parent_reference=${this.reference.id}&limit=1000`
      );

      return childReferenceResponse.data;
    },
    async getKeywords() {
      const keywordResponse = await axios.get(
        `https://api.geoloogia.info/reference_keyword/?reference=${this.reference.id}&nest=1&limit=1000`
      );

      return keywordResponse.data;
    },
    async getTaxa() {
      const taxonResponse = await axios.get(
        `https://api.geoloogia.info/taxon/?reference=${this.reference.id}&limit=1000`
      );

      return taxonResponse.data;
    },
    getReference(id) {
      fetchReference(id)
        .then(res => {
          if (res === undefined) {
            this.error = true;
            return;
          }

          this.reference = res;

          this.getReferenceLocalities().then(res => {
            this.localities = res.results
              .filter(localityReference => {
                return !!(
                  localityReference.locality?.latitude &&
                  localityReference.locality?.longitude
                );
              })
              .sort((a, b) => {
                const textA = a.locality?.locality.toUpperCase();
                const textB = b.locality?.locality.toUpperCase();
                return textA < textB ? -1 : textA > textB ? 1 : 0;
              });

            this.sites = res.results
              .filter(localityReference => {
                return !!(
                  localityReference.site?.latitude &&
                  localityReference.site?.longitude
                );
              })
              .sort((a, b) => {
                const textA = a.site?.name.toUpperCase();
                const textB = b.site?.name.toUpperCase();
                return textA < textB ? -1 : textA > textB ? 1 : 0;
              });

            this.areas = res.results
              .filter(localityReference => {
                return !!localityReference.area?.polygon;
              })
              .map(localityReference => {
                return {
                  ...localityReference,
                  area: {
                    ...localityReference.area,
                    polygon: this.geojson(localityReference.area.polygon)
                  }
                };
              })
              .sort((a, b) => {
                const textA = a.area?.name.toUpperCase();
                const textB = b.area?.name.toUpperCase();
                return textA < textB ? -1 : textA > textB ? 1 : 0;
              });
            this.localityMarkers = this.localities.map(localityReference => {
              const localityTitle =
                this.$i18n.locale === "ee"
                  ? localityReference.locality?.locality
                  : localityReference.locality?.locality_en;

              return {
                popup: `<a class="link" href="https://geoloogia.info/locality/${localityReference.locality?.id}" target="_blank">${localityTitle}</a>`,
                title: localityTitle,
                coordinates: [
                  localityReference.locality?.latitude,
                  localityReference.locality?.longitude
                ]
              };
            });

            this.siteMarkers = this.sites.map(localityReference => {
              const siteTitle =
                this.$i18n.locale === "ee"
                  ? localityReference.site?.name
                  : localityReference.site?.name_en;

              return {
                popup: `<a class="link" href="https://geoloogia.info/site/${localityReference.site?.id}" target="_blank">${siteTitle}</a>`,
                title: siteTitle,
                coordinates: [
                  localityReference.site?.latitude,
                  localityReference.site?.longitude
                ]
              };
            });
          });

          this.getReferenceLibraries().then(res => {
            this.libraries = res.results;
          });

          this.getChildReferences().then(res => {
            // NOTE: Has to be sorted client-side because the pages field is a string.
            this.childReferences = res.results.sort((a, b) => {
              if (a.pages === null && b.pages === null) return 0;
              if (a.pages === null) return -1;
              if (b.pages === null) return 1;
              const aStart = a.pages.includes("-")
                ? parseInt(a.pages.split("-")[0].trim())
                : parseInt(a.pages);
              const bStart = b.pages.includes("-")
                ? parseInt(b.pages.split("-")[0].trim())
                : parseInt(b.pages);
              return aStart - bStart;
            });
          });

          this.getKeywords().then(res => {
            this.keywords = res.results;
          });
          this.getTaxa().then(res => {
            this.taxa = res.results;
          });
        })
        .catch(err => {
          this.error = true;
        });
    }
  }
};
</script>

<style scoped>
.referenceTitle {
  background-color: #f3d3a5;
}

.title {
  word-break: normal;
}

.roundedBorder {
  border-radius: 12px;
}

.body {
  border-radius: 12px;
  border-width: 4px;
  border-color: #f3d3a5;
  border-style: solid;
  background-color: white;
}

.exitButton:hover {
  color: #f44336;
}

.link:hover {
  text-decoration: underline;
}
</style>
