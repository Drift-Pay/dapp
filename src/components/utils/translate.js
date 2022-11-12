import { BigNumber } from 'ethers';

export const address = (entity = 0) => {
  if (entity === 0) return '0x0000000000000000000000000000000000000000';
  let addr = typeof entity === typeof 'string' ? entity : entity.address;
  if (addr === undefined) addr = entity.toString();
  return addr;
};

export const uint = (bigNumber) => {
  return parseInt(bigNumber.toString());
};

export const mixed = (res) =>
  res.map((val) => {
    if (typeof val === 'object') {
      if (Array.isArray(val)) return mixed(val);
      else if (BigNumber.isBigNumber(val)) return uint(val);
      else return val.toString();
    }
    return val;
  });
