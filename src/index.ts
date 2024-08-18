import { isNumber, isString } from './utils';

// Conditional return type
type RT<T> = T extends true ? string : number;

/**
 * Convert token-sat to token
 * @param tokenSat Amount of token-sat to convert. Must be a whole number
 * @param decimals Number of decimal places for the token
 * @param returnString Optionally return the value as a string
 */
export function toToken<T extends boolean = false>(
  tokenSat: number | string,
  decimals: number,
  returnString?: T
): RT<T> {
  if (!isString(tokenSat) && !isNumber(tokenSat)) {
    throw new TypeError(
      `toToken must be called on a number or string, got ${typeof tokenSat}`
    );
  }
  if (!Number.isInteger(Number(tokenSat))) {
    throw new TypeError('toToken must be called on a whole number or string format whole number');
  }
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new TypeError('decimals must be a non-negative integer');
  }

  const result = Number(tokenSat) / (10 ** decimals);

  if (returnString) {
    return result.toFixed(decimals) as RT<T>;
  }
  return result as RT<T>;
}

/**
 * Convert token to token-sat
 * @param token Amount of token to convert
 * @param decimals Number of decimal places for the token
 * @param returnString Optionally return the value as a string
 */
export function toTokenSat<T extends boolean = false>(
  token: number | string,
  decimals: number,
  returnString?: T
): RT<T> {
  if (!isString(token) && !isNumber(token)) {
    throw new TypeError(
      `toTokenSat must be called on a number or string, got ${typeof token}`
    );
  }

  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new TypeError('decimals must be a non-negative integer');
  }

  const result = Number(token) * (10 ** decimals);

  if (returnString) {
    return result.toFixed(0) as RT<T>;
  }

  if (!Number.isSafeInteger(Math.round(result))) {
    console.log({result: Math.round(result)})
    throw new Error('Integer overflow. Try returning a string instead.');
  }

  return Math.round(result) as RT<T>;
}

/**
 * Convert Bitcoin to Satoshis
 * @param token Amount of token to convert
 * @param returnString Optionally return the value as a string
 */
export function toSatoshi<T extends boolean = false>(
  token: number | string,
  returnString?: T
): RT<T> {
  return toTokenSat(token, 8, returnString);
}

/**
 * Convert Satoshis to Bitcoin
 * @param tokenSat Amount of token-sat to convert
 * @param returnString Optionally return the value as a string
 */
export function toBitcoin<T extends boolean = false>(
  tokenSat: number | string,
  returnString?: T
): RT<T> {
  return toToken(tokenSat, 8, returnString);
}