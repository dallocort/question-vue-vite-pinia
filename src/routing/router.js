import { createRouter, createWebHistory } from "vue-router";
import { useStore } from "../store/store.js";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "welcome",
      path: "/",
      component: () => import("../pages/Welcome.vue"),
      beforeEnter(_to, _from, next) {
        if (
          sessionStorage.getItem("username") &&
          sessionStorage.getItem("sid")
        ) {
          next("/main");
        } else {
          next();
        }
      },
    },
    {
      name: "choice",
      path: "/choice",
      component: () => import("../pages/Choice.vue"),
      beforeEnter(to, _from, next) {
        if (
          //todo save logged user to session so after refresh still logged
          sessionStorage.getItem("username") &&
          sessionStorage.getItem("sid")
        ) {
          next("/main");
        } else {
          if (to.path === "/choice/login") {
            next();
          } else {
            next("/choice/login");
          }
        }
      },
      children: [
        {
          name: "login",
          path: "login",
          component: () => import("../pages/Login.vue"),
        },
        {
          name: "register",
          path: "register",
          component: () => import("../pages/Register.vue"),
        },
      ],
    },
    {
      name: "main",
      path: "/main",
      component: () => import("../pages/Main.vue"),
    },
    {
      name: "level",
      path: "/level",
      component: () => import("../pages/Level.vue"),
    },
    {
      name: "admin",
      path: "/admin",
      component: () => import("../pages/Admin.vue"),
      beforeEnter(_to, _from, next) {
        const store = useStore();
        if (store.isAdmin) {
          next();
        } else {
          next("/main");
        }
      },
    },
    {
      name: "game-over",
      path: "/game-over",
      component: () => import("../pages/GameOver.vue"),
      beforeEnter(_to, _from, next) {
        const store = useStore();
        if (store.isGameOver) {
          next();
        } else {
          next("/main");
        }
      },
    },
    {
      path: "/:anything(.*)",
      redirect: "/",
    },
  ],
});
router.beforeEach((to, _from, next) => {
  const store = useStore();
  if (to.path.startsWith("/choice")) {
    next();
    return;
  }
  if (store.isAuthenticated) {
    next();
  } else {
    if (to.path === "/") {
      next();
    } else {
      next("/");
    }
  }
});
export default router;
