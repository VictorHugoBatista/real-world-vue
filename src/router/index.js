import Vue from "vue";
import VueRouter from "vue-router";
import EventList from "../views/EventList";
import EventShow from "../views/EventShow";
import EventCreate from "../views/EventCreate";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "event-list",
    component: EventList
  },
  {
    path: "/event-create",
    name: "event-create",
    component: EventShow
  },
  {
    path: "/event-show",
    name: "event-show",
    component: EventCreate
  }
];

const router = new VueRouter({
  routes
});

export default router;
