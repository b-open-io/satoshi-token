import { toToken, toTokenSat } from '.';

describe('toToken', () => {
  it('converts simple integer amounts', () => {
    expect(toToken(100000000, 8)).toEqual(1);
    expect(toToken(123456789012345, 8)).toEqual(1234567.89012345);
  });
  it('converts simple string amounts', () => {
    expect(toToken('100000000', 8)).toEqual(1);
    expect(toToken('123456789012345', 8)).toEqual(1234567.89012345);
  });

  it('converts to Bitcoin, not to Satoshi', () => {
    expect(toToken(98765, 8)).not.toEqual(9876500000000);
  });

  it('converts and handles corner case rounding', () => {
    expect(toToken(46, 8)).toEqual(.00000046);
  });

  it('handles TypeError input', () => {
    expect(toToken.bind(this, true as unknown as number, 8)).toThrow('toToken must be called on a number or string');
    expect(toToken.bind(this, 1.1)).toThrow(
      'toToken must be called on a whole number or string format whole number'
    );
  });
});

describe('toTokenSat', () => {
  it('converts simple integer amounts', () => {
    expect(toTokenSat(0.00000001, 8)).toEqual(1);
    expect(toTokenSat(98765, 8)).toEqual(9876500000000);
  });
  it('converts simple string amounts', () => {
    expect(toTokenSat('0.00000001', 8)).toEqual(1);
    expect(toTokenSat('98765', 8)).toEqual(9876500000000);
  });

  it('converts to Satoshi, not to Bitcoin', () => {
    expect(toTokenSat.bind(this,123456789012345, 8)).toThrow();
  });

  it('converts and handles corner case rounding', () => {
    expect(toTokenSat(4.6, 8)).toEqual(460000000);
  });

  it('handles TypeError input', () => {
    expect(toTokenSat.bind(this, true as unknown as number, 8)).toThrow('toTokenSat must be called on a number or string');
  });
});

describe('toToken for coin with 420000000000000 supply and 0 decimals', () => {
  it('converts simple integer amounts', () => {
    expect(toToken(420000000000000, 0)).toEqual(420000000000000);
    expect(toToken(1, 0)).toEqual(1);
  });

  it('converts simple string amounts', () => {
    expect(toToken('420000000000000', 0)).toEqual(420000000000000);
    expect(toToken('1', 0)).toEqual(1);
  });

  it('handles maximum supply', () => {
    expect(toToken(420000000000000, 0)).toEqual(420000000000000);
  });

  it('handles zero', () => {
    expect(toToken(0, 0)).toEqual(0);
  });

  it('throws error for non-integer input', () => {
    expect(toToken.bind(this, 1.5, 0)).toThrow(
      'toToken must be called on a whole number or string format whole number'
    );
  });
});

describe('toTokenSat for coin with 420000000000000 supply and 0 decimals', () => {
  it('converts simple integer amounts', () => {
    expect(toTokenSat(420000000000000, 0)).toEqual(420000000000000);
    expect(toTokenSat(1, 0)).toEqual(1);
  });

  it('converts simple string amounts', () => {
    expect(toTokenSat('420000000000000', 0)).toEqual(420000000000000);
    expect(toTokenSat('1', 0)).toEqual(1);
  });

  it('handles maximum supply', () => {
    expect(toTokenSat(420000000000000, 0)).toEqual(420000000000000);
  });

  it('handles zero', () => {
    expect(toTokenSat(0, 0)).toEqual(0);
  });
})

describe('toToken for coin with 420000000000000 supply and 6 decimals', () => {
  it('handles big supply', () => {
    expect(toToken("420000000000000000000", 6)).toEqual(420000000000000);
    expect(toToken("420000000000000000000", 6, true)).toEqual("420000000000000.000000");
  });
});

describe('toTokenSat for coin with 420000000000000 supply and 6 decimals', () => {
  it('handles big supply', () => {
    expect(toTokenSat.bind(this,420000000000000, 6)).toThrow("Integer overflow. Try returning a string instead.");
    expect(toTokenSat(420000000000000, 6, true)).toEqual("420000000000000000000");
  });
});