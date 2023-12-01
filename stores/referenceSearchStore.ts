import { z } from "zod";
export const useSearchStore = defineStore(
  "searchReference",
  () => {
    const allowedValues = {
      perPage: [10, 25, 50, 100],
      sort: ["score desc", "date_added desc", "title desc", "title asc"],
    } as const;

    const ParamsSchema = z.object({
      sort: z.enum(allowedValues.sort).catch(allowedValues.sort[0]),
      page: z
        .string()
        .transform((val) => parseInt(val))
        .refine((val) => val > 0)
        .catch(1),
      perPage: z
        .string()
        .transform((val) => parseInt(val))
        .refine((value): value is (typeof allowedValues.perPage)[number] =>
          allowedValues.perPage.includes(
            value as (typeof allowedValues.perPage)[number],
          ),
        )
        .catch(allowedValues.perPage[1]),
      q: z.string().catch(""),
      isEstonianReference: z
        .string()
        .transform((val) => val === "true")
        .catch(false),
      isEstonianAuthor: z
        .string()
        .transform((val) => val === "true")
        .catch(false),
      pdf: z
        .string()
        .transform((val) => val === "true")
        .catch(false),
      title: z.string().catch(""),
      book: z.string().catch(""),
      journal: z.string().catch(""),
      publisher: z.string().catch(""),
      volumeOrNumber: z.string().catch(""),
      localities: z.string().catch(""),
      taxa: z.string().catch(""),
      keywords: z
        .string()
        .transform((val) => new Set(val.split(",")))
        .catch(new Set()),
      type: z
        .string()
        .transform((val) => new Set(val.split(",")))
        .catch(new Set()),
      language: z
        .string()
        .transform((val) => new Set(val.split(",")))
        .catch(new Set()),
      year: z
        .string()
        .transform((val, ctx) => {
          let [startStr, endStr] = val.split("-");
          const start = parseInt(startStr) || null;
          const end = parseInt(endStr) || null;

          if (start && end && start > end) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Start year cannot be later than end year",
            });
            return z.NEVER;
          }

          return [start, end];
        })
        .catch([null, null]),
    });
    const perPage = ref(25);

    const sort = ref("score desc");
    const page = ref(1);
    const searchState = reactive({
      query: "",
      activeQuery: "",
    });
    const filterState = reactive({
      isEstonianReference: false,
      isEstonianAuthor: false,
      pdf: false,
      title: "",
      book: "",
      journal: "",
      publisher: "",
      volumeOrNumber: "",
      localities: "",
      taxa: "",
      year: [null, null] as (number | null)[],
      type: new Set<string>(),
      language: new Set<string>(),
      keywords: new Set<string>(),
    });

    const activeFiltersCount = computed(() => {
      return Object.values(filterState).filter((val) => {
        if (typeof val === "string") return val.length > 0;
        if (typeof val === "boolean") return val;
        if (val instanceof Set) return val.size;
        if (Array.isArray(val)) return !val.every((v) => v === null);
      }).length;
    });

    function $reset() {
      page.value = 1;
      searchState.query = "";
      searchState.activeQuery = "";
      resetFilters();
    }

    function resetFilters() {
      filterState.isEstonianReference = false;
      filterState.isEstonianAuthor = false;
      filterState.pdf = false;
      filterState.title = "";
      filterState.book = "";
      filterState.journal = "";
      filterState.publisher = "";
      filterState.volumeOrNumber = "";
      filterState.localities = "";
      filterState.taxa = "";
      filterState.year = [null, null];
      filterState.type.clear();
      filterState.language.clear();
      filterState.keywords.clear();
    }

    const solrFilter = computed(() => {
      const filters = [];
      if (filterState.isEstonianReference) {
        filters.push("is_estonian_reference:true");
      }
      if (filterState.isEstonianAuthor) {
        filters.push("is_estonian_author:true");
      }
      if (filterState.pdf) {
        filters.push("pdf:*");
      }
      if (filterState.title.length > 0) {
        filters.push(`title:*${filterState.title}*`);
      }
      if (filterState.year.some((val) => val !== null)) {
        const start = filterState.year[0] ?? "*";
        const end = filterState.year[1] ?? "*";
        filters.push(`year_numeric:[${start} TO ${end}]`);
      }
      if (filterState.book.length > 0) {
        filters.push(`book:*${filterState.book}*`);
      }
      if (filterState.journal.length > 0) {
        filters.push(`journal_name:*${filterState.journal}*`);
      }
      if (filterState.publisher.length > 0) {
        filters.push(`publisher:*${filterState.publisher}*`);
      }
      if (filterState.taxa.length > 0) {
        filters.push(`taxa:"${filterState.taxa}"`);
      }
      if (filterState.volumeOrNumber.length > 0) {
        filters.push(
          `volume:"${filterState.volumeOrNumber}" OR number:"${filterState.volumeOrNumber}"`,
        );
      }
      if (filterState.localities.length > 0) {
        filters.push(
          `localities:"${filterState.localities}" OR localities_en:"${filterState.localities}"`,
        );
      }

      if (filterState.keywords.size > 0) {
        filters.push(
          `{!tag=keywords}keywords:(${Array.from(filterState.keywords)
            .map((val) => `"${val}"`)
            .join(" AND ")})`,
        );
      }
      if (filterState.type.size > 0) {
        filters.push(
          `{!tag=type}type:(${Array.from(filterState.type).join(" ")})`,
        );
      }
      if (filterState.language.size > 0) {
        filters.push(
          `{!tag=language}language:(${Array.from(filterState.language).join(
            " ",
          )})`,
        );
      }

      return filters;
    });

    function setStateFromQueryParams(route, sortOptions) {
      const params = ParamsSchema.parse({
        sort: route.query.sort,
        page: route.query.page,
        perPage: route.query.perPage,
        q: route.query.q,
        isEstonianReference: route.query.isEstonianReference,
        isEstonianAuthor: route.query.isEstonianAuthor,
        pdf: route.query.pdf,
        title: route.query.title,
        book: route.query.book,
        journal: route.query.journal,
        year: route.query.year,
        publisher: route.query.publisher,
        type: route.query.type,
        language: route.query.language,
        keywords: route.query.keywords,
        volumeOrNumber: route.query.volumeOrNumber,
        localities: route.query.localites,
        taxa: route.query.taxa,
      });

      page.value = params.page;
      perPage.value = params.perPage;
      sort.value =
        sortOptions.value.find((option) => option.value === params.sort)
          ?.value ?? sortOptions.value[0].value;
      searchState.query = params.q;
      searchState.activeQuery = params.q;
      filterState.isEstonianReference = params.isEstonianReference;
      filterState.isEstonianAuthor = params.isEstonianAuthor;
      filterState.pdf = params.pdf;
      filterState.year = params.year;
      filterState.title = params.title;
      filterState.book = params.book;
      filterState.journal = params.journal;
      filterState.publisher = params.publisher;
      filterState.volumeOrNumber = params.volumeOrNumber;
      filterState.type = params.type;
      filterState.language = params.language;
      filterState.keywords = params.keywords;
      filterState.localities = params.localities;
      filterState.taxa = params.taxa;
    }

    const solrQuery = computed(() => {
      return searchState.activeQuery.length < 1 ? "*" : searchState.activeQuery;
    });

    const selectedPosition = ref(0);
    return {
      filterState,
      searchState,
      solrFilter,
      solrQuery,
      sort,
      page,
      perPage,
      setStateFromQueryParams,
      selectedPosition,
      resetFilters,
      activeFiltersCount,
    };
  },
  {
    persist: {
      paths: [
        "selectedPosition",
        "sort",
        "page",
        "perPage",
        "filterState",
        "searchState",
      ],
      storage: persistedState.sessionStorage,
      serializer: {
        serialize: (value) => {
          return JSON.stringify(value, (_key, v) => {
            return v instanceof Set ? [...v] : v;
          });
        },
        deserialize: (value) => {
          return JSON.parse(value, (k, v) => {
            if (["keywords", "language", "type"].includes(k)) {
              return new Set(v);
            }
            return v;
          });
        },
      },
    },
  },
);
