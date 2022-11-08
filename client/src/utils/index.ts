import _ from 'lodash';

export const rand = (range: number) => _.random(0, range - 1);
