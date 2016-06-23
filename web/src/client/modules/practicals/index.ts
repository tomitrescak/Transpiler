import actions from "./actions/index";
import routes from "./routes";
import methodStubs from "./configs/method_stubs/index";

export default {
  load(context: IContext) {
    methodStubs(context);
  },
  actions,
  routes
};
