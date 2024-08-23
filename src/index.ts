import { isBigInt, isNumber, isString } from "./utils.js";

// Conditional return type
type ReturnType = "string" | "bigint" | "number";
type RT<T extends ReturnType> = T extends "string"
	? string
	: T extends "bigint"
		? bigint
		: number;

export const ReturnTypes = {
	String: "string" as const,
	BigInt: "bigint" as const,
	Number: "number" as const,
};

/**
 * Convert token-sat to token
 * @param tokenSat Amount of token-sat to convert. Must be a whole number
 * @param decimals Number of decimal places for the token
 * @param returnString Optionally return the value as a string
 */
export function toToken<T extends ReturnType = "number">(
	tokenSat: number | string | bigint,
	decimals: number,
	returnType?: T,
): RT<T> {
	if (!isString(tokenSat) && !isNumber(tokenSat)) {
		throw new TypeError(
			`toToken must be called on a number or string, got ${typeof tokenSat}`,
		);
	}
	if (!Number.isInteger(Number(tokenSat))) {
		throw new TypeError(
			"toToken must be called on a whole number or string format whole number",
		);
	}
	if (!Number.isInteger(decimals) || decimals < 0) {
		throw new TypeError("decimals must be a non-negative integer");
	}

	let tokenSatBig = 0n;
	const isNegative =
		typeof tokenSat === "string" ? tokenSat.startsWith("-") : tokenSat < 0;

	switch (typeof tokenSat) {
		case "bigint":
			tokenSatBig = tokenSat;
			break;
		case "string":
			tokenSatBig = BigInt(tokenSat.replace("-", "").split(".")[0]);
			break;
		default:
			tokenSatBig = BigInt(Math.abs(Math.round(tokenSat)));
	}

	const sign = isNegative ? -1n : 1n;
	const intPart = tokenSatBig / 10n ** BigInt(decimals);
	const decPart = tokenSatBig % 10n ** BigInt(decimals);

	switch (returnType) {
		case "bigint":
      if (decPart > 0) {
        throw new Error("toToken: Cannot return a bigint with decimal part");
      }
			return (intPart * sign) as RT<T>;
		case "string":
			return `${isNegative && (intPart > 0 || decPart > 0) ? "-" : ""}${intPart}.${decPart.toString().padStart(decimals, "0")}` as RT<T>;
		default:
			return Number(
				`${isNegative && (intPart > 0 || decPart > 0) ? "-" : ""}${intPart}.${decPart.toString().padStart(decimals, "0")}`,
			) as RT<T>;
	}
}

/**
 * Convert token to token-sat
 * @param token Amount of token to convert
 * @param decimals Number of decimal places for the token
 * @param returnString Optionally return the value as a string
 */
export function toTokenSat<T extends ReturnType = "number">(
	token: number | string | bigint,
	decimals: number,
	returnType?: T,
): RT<T> {
	if (!isString(token) && !isNumber(token) && !isBigInt(token)) {
		throw new TypeError(
			`toTokenSat must be called on a number, string or bigint, got ${typeof token}`,
		);
	}

	if (!Number.isInteger(decimals) || decimals < 0) {
		throw new TypeError("decimals must be a non-negative integer");
	}

	let result = "";
	const isNegative =
		typeof token === "string" ? token.startsWith("-") && token !== "-0": token < 0;

	switch (typeof token) {
		case "bigint":
			result = (token * 10n ** BigInt(decimals)).toString();
			break;
		case "string": {
			const absToken = token.replace("-", "");
			const [intStr, decStr] = absToken.split(".");
			result = intStr + (decStr || "").padEnd(decimals, "0");
			if (isNegative && (intStr !== "0" || decStr !== "0")) result = `-${result}`;
			break;
		}
		default:
			// result = Math.round(token * (10 ** decimals)).toString();
			result = (
				Math.round(Math.abs(token) * 10 ** decimals) * (isNegative ? -1 : 1)
			).toString();
	}

	switch (returnType) {
		case "bigint":
			return BigInt(result) as RT<T>;
		case "string":
			return result as RT<T>;
		default: {
			let resultNum: number;
			try {
				resultNum = Number(result);
			} catch (e) {
				throw new Error(`Invalid number: ${result}`);
			}

			if (!Number.isSafeInteger(Math.round(resultNum))) {
				throw new Error("Integer overflow. Try returning a string instead.");
			}
			return resultNum as RT<T>;
		}
	}
}

/**
 * Convert Bitcoin to Satoshis
 * @param token Amount of token to convert
 * @param returnString Optionally return the value as a string
 */
export function toSatoshi<T extends ReturnType = "number">(
	token: number | string | bigint,
	returnType?: T,
): RT<T> {
	return toTokenSat(token, 8, returnType);
}

/**
 * Convert Satoshis to Bitcoin
 * @param tokenSat Amount of token-sat to convert
 * @param returnString Optionally return the value as a string
 */
export function toBitcoin<T extends ReturnType = "number">(
	tokenSat: number | string | bigint,
	returnType?: T,
): RT<T> {
	return toToken(tokenSat, 8, returnType);
}
