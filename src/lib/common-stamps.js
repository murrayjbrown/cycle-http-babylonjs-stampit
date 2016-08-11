// Common useful stamps

import stampit from 'stampit';

export const Cloneable = stampit
  .init(({ instance, stamp }) => {
    instance.clone = stamp.bind(null, instance);
  });

export const Logger = stampit
  .refs({
    prefix: 'STDOUT: '
  })
  .methods({
    log(obj) {
      console.log(this.prefix, obj);
    }
  });

export const SelfAware = stampit
  .init(({ instance, stamp }) => {
    instance.getInstance = () => instance;
    instance.getStamp = () => stamp;
  });
