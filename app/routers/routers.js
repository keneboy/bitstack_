require("../utils/passport");
const passport = require("passport");
const usersRoutes = require("../controllers/user.controller");
const adminRoutes = require("../controllers/admin.controller");
const { autheticationMiddleware, adminMiddleWare } = require("../utils/auth");
const { usersAuthRoutes, adminAuthRoutes } =  require("../utils/auth");

const Routers = (app) => {
  return (routers = (paths, filename) => {
    app.post("/register", usersRoutes.RegisterUser);
    // app.post("/mining", autheticationMiddleware(), usersRoutes.MiningReceipts);
    app.post("/contactSubmit", usersRoutes.contactSubmit)
    app.post("/changePassword", autheticationMiddleware(), usersRoutes.changePassword);
    app.get("/login/:id", (req, res)=>res.redirect("/login"))
    app.post("/withdrawalRequest", autheticationMiddleware(), usersRoutes.withdrawalRequest);
    app.get(paths, (req, res) => res.render(filename, { error: req.flash("error"), success: req.flash("success"), isAuthenticated: (req.isAuthenticated() && req.user.user_id) }));
    app.post("/login", passport.authenticate("login", { successRedirect: "/dashboard", failureRedirect: "back", failureFlash: true, successFlash: true, }));
    app.post("/admin", passport.authenticate("admin", { successRedirect: "/adminDashboard",    failureRedirect: "/adminlogin", failureFlash: true, successFlash: true, })
    );
  });
}

const userAuthRouters = (app) => (routers = (paths, filename) => usersAuthRoutes(app)(paths, autheticationMiddleware, usersRoutes[filename]))

const adminAuthRouter = (app) => (routers = (paths, filename) => adminAuthRoutes(app)(paths, adminMiddleWare, adminRoutes[filename]))

module.exports = (app) => {
  Routers(app)("/", "index");
  Routers(app)("/faq", "faq");
  Routers(app)("/login", "login");
  Routers(app)("/about", "about");
  Routers(app)("/pricing", "pricing");
  Routers(app)("/features", "features");
  Routers(app)("/register", "register");
  Routers(app)("/adminlogin", "adminlogin");

  userAuthRouters(app)("/minings", "MiningReceipts", usersRoutes);
  userAuthRouters(app)("/mining", "mining", usersRoutes);
  userAuthRouters(app)("/logout", "logout", usersRoutes);
  userAuthRouters(app)("/dashboard", "dashboard", usersRoutes);
  userAuthRouters(app)("/setting", "setting", usersRoutes);
  userAuthRouters(app)("/mining/:id", "MiningPlans", usersRoutes)
  userAuthRouters(app)("/runningPlans", "runningPlans", usersRoutes)
  userAuthRouters(app)('/removeplan/:id',"DeletePlan", usersRoutes)
  userAuthRouters(app)('/withdrawal',"withdrawal", usersRoutes)

  adminAuthRouter(app)("/admin_logout", "logout", adminRoutes)
  adminAuthRouter(app)("/adminDashboard", "adminDashboard", adminRoutes)
  adminAuthRouter(app)("/removeuser/:id", "removeUser", adminRoutes)
  adminAuthRouter(app)("/removemsg/:id", "removemsg", adminRoutes)
  adminAuthRouter(app)("/approveplan/:receiptID/:userID/:packageplan", "approveplan", adminRoutes)
  adminAuthRouter(app)("/deletePlans/:planID/:userID", "deletePlans", adminRoutes)



  adminAuthRouter(app)("/topup", "topup", adminRoutes)
};