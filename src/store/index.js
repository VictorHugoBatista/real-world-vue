import Vue from "vue";
import Vuex from "vuex";
import EventService from "@/services/EventService";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    events: [],
    hasNextPage: true,
    user: {
      id: "abc123",
      name: "Adam Jahr"
    },
    categories: [
      "sustainability",
      "nature",
      "animal welfare",
      "housing",
      "education",
      "food",
      "community"
    ]
  },
  mutations: {
    ADD_EVENT(state, event) {
      state.events.push(event);
    },
    SET_EVENTS(state, events) {
      state.events = events;
    },
    UPDATE_HAS_NEXT_PAGE(state, { totalCount, pageSize, currentPage }) {
      const currentPageTotalEvents = pageSize * currentPage;
      state.hasNextPage = totalCount > currentPageTotalEvents;
    }
  },
  actions: {
    createEvent({ commit }, event) {
      return EventService.postEvent(event).then(() => {
        commit("ADD_EVENT", event);
      });
    },
    fetchEvents({ commit }, { perPage, page }) {
      EventService.getEvents(perPage, page)
        .then(response => {
          commit("SET_EVENTS", response.data);
          commit("UPDATE_HAS_NEXT_PAGE", {
            totalCount: parseInt(response.headers["x-total-count"]),
            pageSize: perPage,
            currentPage: page
          });
        })
        .catch(error => console.log(error));
    }
  },
  modules: {},
  getters: {
    categoriesLength(state) {
      return state.categories.length;
    }
  }
});
