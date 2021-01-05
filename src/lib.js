// utils
const z = {
  isNil(val) {
    // weak comparison == used on purpose
    // coz includes both undefined + null checks
    return val == null;
  },
  el(selector) {
    return document.getElementById(selector);
  },
  hasLen(list = []) {
    return list.length > 0;
  },
  delay: (milliSeconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliSeconds));
  },
};

// state management:
// inspired by redux
// unidirectional reducers with async effects
// state is updated by dispatching actions of type:
// { type: 'REDUCER NAME', payload: any }
// once state is updated matching side effects are searched for
// found effects are resolved with Promise.all
// Effect shape:
// { types: ['*', 'ARRAY OF REDUCER NAMES'], do: async (ctx) => void }
// the context passed to the effect contains:
// - getState function
// - action object
// - dispatch function
class StateStore {
  constructor(state = {}, reducers = {}, effects = {}, context = {}) {
    console.log("INIT STATE", state);
    this.state = state;
    this.reducers = reducers;
    this.effects = effects;
    this.context = context;
    this.dispatch = this.dispatch.bind(this);
    this.getState = this.getState.bind(this);
  }
  dispatch(action) {
    const reducer = this.reducers[action.type];
    if (!z.isNil(reducer)) {
      this.state = reducer(this.state, action);
      const fx = this.effects.filter((effect) => {
        return (
          effect.types.filter((type) => {
            return type === "*" || type === action.type;
          }).length > 0
        );
      });
      if (z.hasLen(fx)) {
        Promise.all(
          fx.map((effect) =>
            effect.do({
              getState: this.getState,
              action,
              dispatch: this.dispatch,
            })
          )
        )
          .then(() => {
            console.log("ALL EFFECTS RUN", action.type);
          })
          .catch((error) => {
            console.log("EFFECT ERROR", action.type, error);
          });
      }
    }
    return null;
  }
  getState() {
    return this.state;
  }
}

// its good matters to provide a factory function for classes
const createStateStore = (
  state = {},
  reducers = {},
  effects = {},
  context = {}
) => {
  return new StateStore(state, reducers, effects, context);
};

// ui management:
// wrap collecting HTMLElements with getElementById in a function
// to delay execution until after the DOM is loaded
const getElements = () => {
  return {
    pet: z.el("spritePet"),
    actions: {
      feed: z.el("actionFeed"),
      walk: z.el("actionWalk"),
      run: z.el("actionRun"),
      sleep: z.el("actionSleep"),
      // idle: z.el("actionReset"),
    },
  };
};

// wrap a function to wait for DOM ready
const onDomReady = (fn) => {
  if (document.readyState != "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
};
