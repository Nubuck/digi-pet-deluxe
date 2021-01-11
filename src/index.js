const petDelays = {
  feed: 1800,
  action: 5000,
  hurt: 15000,
};

// initialize ui + state management libs
const main = async () => {
  const sources = [
    // "https://i.picsum.photos/id/1000/5626/3635.jpg",
    // "https://i.picsum.photos/id/10/2500/1667.jpg",
    // "https://homepages.cae.wisc.edu/~ece533/images/cat.png",
    // "https://homepages.cae.wisc.edu/~ece533/images/airplane.png",
    "/img/bg-grass1.jpg",
    "/img/cat-idle.png",
    "/img/cat-hurt.png",
    "/img/cat-walk.png",
    "/img/cat-sleep.png",
    "/img/cat-dead.png",
    "/img/cat-run.png",
    "/img/cat-jump.png"

  ];

  await preloadAll(sources);

  // setup elements
  const els = getElements();
  els.buttons.className = 'col'
  els.pet.className = 'pet pet-idle'
  const toggleButtonsDisabled = (val) => {
    Object.keys(els.actions).forEach((actionKey) => {
      const action = els.actions[actionKey];
      action.disabled = val;
    });
  };

  // get existing state
  const existingState = window.localStorage.getItem("state");
  // check if existing state or set default
  const safeState = z.isNil(existingState)
    ? { action: "idle", timestamp: Date.now() }
    : JSON.parse(existingState);

  // create state store
  const store = createStateStore(
    safeState,
    // state reducers by action
    {
      petActionChange: (state, action) => {
        return Object.assign(state, {
          action: action.payload,
          timestamp: Date.now(),
        });
      },
      // TODO:
      // profile + status
    },
    // side effects
    [
      {
        types: ["petActionChange"],
        do: async (ctx) => {
          console.log("EFFECT action change", ctx.getState(), ctx.action);
          els.pet.className = `pet pet-${ctx.getState().action}`;
          toggleButtonsDisabled(true);
          // feed short reset timeout
          if (ctx.action.payload === "feed") {
            await z.delay(petDelays.feed);
            ctx.dispatch({
              type: "petActionChange",
              payload: "idle",
            });
            toggleButtonsDisabled(false);
          } else if (
            ctx.action.payload !== "idle" &&
            ctx.action.payload !== "hurt"
          ) {
            await z.delay(petDelays.action);
            ctx.dispatch({
              type: "petActionChange",
              payload: "idle",
            });
            toggleButtonsDisabled(false);
          } else {
            // set count down to hurt state
            // when pet idle for 15 seconds
            toggleButtonsDisabled(false);
            await z.delay(petDelays.hurt);
            const currentState = ctx.getState();
            const dateDiff = Date.now() - currentState.timestamp;
            if (currentState.action === "idle" && dateDiff >= petDelays.hurt) {
              ctx.dispatch({
                type: "petActionChange",
                payload: "hurt",
              });
            }
            // TODO: die
          }
          return null;
        },
      },
      {
        types: ["*"],
        do: async (ctx) => {
          const state = ctx.getState();
          console.log("CACHE STATE", state);
          window.localStorage.setItem("state", JSON.stringify(state));
          return null;
        },
      },
    ]
  );

  // kick off pet
  console.log("EXISTING STATE", safeState);
  store.dispatch({
    type: "petActionChange",
    payload: safeState.action,
  });

  // bind element click events
  Object.keys(els.actions).forEach((actionKey) => {
    const action = els.actions[actionKey];
    action.addEventListener("click", (e) => {
      e.preventDefault();
      store.dispatch({
        type: "petActionChange",
        payload: actionKey,
      });
    });
  });

  // void
  return null;
};

// run main when DOM is loaded
onDomReady(main);
