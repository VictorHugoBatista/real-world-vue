import Vue from "vue";
import Vuex from "vuex";
import EventService from "@/services/EventService";
import * as user from "./modules/user";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    events: [],
    hasNextPage: true,
    event: {},
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
    },
    SET_EVENT(state, event) {
      state.event = event;
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
    },
    fetchEvent({ commit, getters }, id) {
      const event = getters.getEventById(id);
      if (event) {
        commit("SET_EVENT", event);
        return;
      }
      EventService.getEvent(id)
        .then(response => commit("SET_EVENT", response.data))
        .catch(error => console.log(error));
    },
  },
  modules: {
    user
  },
  getters: {
    categoriesLength(state) {
      return state.categories.length;
    },
    getEventById: state => id => {
      return state.events.find(event => event.id === id)
    }
  }
});
