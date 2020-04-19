import EventService from "@/services/EventService";

const createNotification = (type, message, vuexDispatch) => {
  const notification = {
    type: type,
    message: message
  };
  vuexDispatch("notification/add", notification, { root: true });
};

export default {
  namespaced: true,
  state: {
    events: [],
    hasNextPage: true,
    event: {}
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
    createEvent({ commit, dispatch }, event) {
      return EventService.postEvent(event)
        .then(() => {
          commit("ADD_EVENT", event);
          createNotification(
            "success",
            "Your event has been created!",
            dispatch
          );
        })
        .catch(error => {
          createNotification(
            "error",
            `There as a problem fetching events: ${error.message}`,
            dispatch
          );
          throw error;
        });
    },
    fetchEvents({ commit, dispatch }, { perPage, page }) {
      EventService.getEvents(perPage, page)
        .then(response => {
          commit("SET_EVENTS", response.data);
          commit("UPDATE_HAS_NEXT_PAGE", {
            totalCount: parseInt(response.headers["x-total-count"]),
            pageSize: perPage,
            currentPage: page
          });
        })
        .catch(error => {
          createNotification(
            "error",
            `There as a problem fetching events: ${error.message}`,
            dispatch
          );
        });
    },
    fetchEvent({ commit, getters, dispatch }, id) {
      const event = getters.getEventById(id);
      if (event) {
        commit("SET_EVENT", event);
        return;
      }
      EventService.getEvent(id)
        .then(response => commit("SET_EVENT", response.data))
        .catch(error => {
          createNotification(
            "error",
            `There as a problem fetching events: ${error.message}`,
            dispatch
          );
        });
    }
  },
  getters: {
    getEventById: state => id => {
      return state.events.find(event => event.id === id);
    }
  }
};
