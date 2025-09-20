import Emitter from 'tiny-emitter';
export const emit = new Emitter();

export const emitter = {
  $on: (...args) => emit.on(...args),
  $once: (...args) => emit.once(...args),
  $off: (...args) => emit.off(...args),
  $emit: (...args) => emit.emit(...args),
}
