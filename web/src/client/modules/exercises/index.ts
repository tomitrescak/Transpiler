import actions from "./actions/index";
import routes from "./routes";
import methodStubs from "./configs/method_stubs/index";

export default {
  actions,
  routes,
  load(context: IContext) {
    methodStubs(context);
  }
};
