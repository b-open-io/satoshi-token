import { isBigInt, isNumber, isString } from './utils';
import { Decimal } from "@ilihub/decimal";

// Conditional return type
type ReturnType = 'string' | 'bigint' | 'number';
type RT<T extends ReturnType> = T extends 'string' ? string : T extends 'bigint' ? bigint : number;
export const ReturnTypes = {
  String: 'string' as const,
  BigInt: 'bigint' as const,
  Number: 'number' as const
};

/**
 * Convert token-sat to token
 * @param tokenSat Amount of token-sat to convert. Must be a whole number
 * @param decimals Number of decimal places for the token
 * @param returnString Optionally return the value as a string
 */
  export function toToken<T extends ReturnType = 'number'>(
    tokenSat: number | string | bigint,
    decimals: number,
    returnType?: T
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

  let tokenSatBig = 0n
  switch (typeof tokenSat) {
    case 'bigint':
      tokenSatBig = tokenSat ;
      // result = token * (10n ** BigInt(decimals));
      break;
    case 'string':
      tokenSatBig = BigInt(tokenSat.split('.')[0]);
      break;
    default:
      tokenSatBig = BigInt(Math.round(tokenSat))
  }
  const intPart = tokenSatBig / (10n ** BigInt(decimals));
  const decPart = tokenSatBig % (10n ** BigInt(decimals));
  
  switch (returnType) {
    case 'bigint':
      return intPart as RT<T>;
    case 'string':
      return `${intPart}.${decPart.toString().padStart(decimals, '0')}` as RT<T>;
    default:
      return Number(`${intPart}.${decPart.toString().padStart(decimals, '0')}`) as RT<T>;
  }
}

/**
 * Convert token to token-sat
 * @param token Amount of token to convert
 * @param decimals Number of decimal places for the token
 * @param returnString Optionally return the value as a string
 */
export function toTokenSat<T extends ReturnType = 'number'>(
  token: number | string | bigint,
  decimals: number,
  returnType?: T
): RT<T> {
  if (!isString(token) && !isNumber(token) && !isBigInt(token)) {
    throw new TypeError(
      `toTokenSat must be called on a number, string or bigint, got ${typeof token}`
    );
  }

  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new TypeError('decimals must be a non-negative integer');
  }

  let result = ''
  switch (typeof token) {
    case 'bigint':
      result = (token * (10n ** BigInt(decimals))).toString();
      break;
    case 'string':
      const [intStr, decStr] = token.split('.');
      result = intStr  + (decStr || '').padEnd(decimals, '0');
      break;
    default:
      result = Math.floor(token * (10 ** decimals)).toString();
  }

  switch (returnType) {
    case 'bigint':
      return BigInt(result) as RT<T>;
    case 'string':
      return result as RT<T>;
    default:
      const resultNum = Number(result);
      if (!Number.isSafeInteger(Math.round(resultNum))) {
        console.log({result: Math.round(resultNum)})
        throw new Error('Integer overflow. Try returning a string instead.');
      }
      return resultNum as RT<T>;
  }
}

/**
 * Convert Bitcoin to Satoshis
 * @param token Amount of token to convert
 * @param returnString Optionally return the value as a string
 */
export function toSatoshi<T extends ReturnType = 'number'>(
  token: number | string | bigint,
  returnType?: T
): RT<T> {
  return toTokenSat(token, 8, returnType);
}

/**
 * Convert Satoshis to Bitcoin
 * @param tokenSat Amount of token-sat to convert
 * @param returnString Optionally return the value as a string
 */
export function toBitcoin<T extends ReturnType = 'number'>(
  tokenSat: number | string | bigint,
  returnType?: T
): RT<T> {
  return toToken(tokenSat, 8, returnType);
}