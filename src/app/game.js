// BABYLON is an externally loaded dependency (global)

//
// game() returns game$ stream
//
export default function game(game$, states) {

  // change background colour
  game$.combineLatest(states.colour$,
    (_game, _colour) => {
      return {
        scene: _game.scene,
        colour: _colour
      };
    })
    .subscribe( (state) => {
      // console.log('game scene colour mapping…');
      const scene = state.scene;
      const red = Math.random();
      const green = Math.random();
      const blue = Math.random();
      scene.clearColor = new BABYLON.Color4(red, green, blue);
    });

  // resize game
  game$.combineLatest(states.resize$,
    (_game) => {
      return {
        scene: _game.scene,
        resize: true
      };
    })
    .subscribe((state) => {
      console.log('game scene resize mapping…');
      const scene = state.scene;
      const engine = scene.getEngine();
      engine.resize();
    });

  // return game stream
  return game$;
}
