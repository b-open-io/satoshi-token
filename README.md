# satoshi-token

A tiny library with 0 dependencies for converting to and from `tsat` format given specified number of decimals. `tsat` is shorthand for token satoshis and is a term coined to refer to the smallest unit of arbitrary tokens. This library was designed with the BRC-20, BSV-20 and BSV-21 token protocols in mind and assume the token supply and precision fit safely into a single integer.

Main functions are `toToken` and `toTokenSatoshi` which take the number to convert, and the number of decimal places the token supports.

Includes convenience functions `toBitcoin` and `toSatoshi` for coins with 8 decimals like Bitcoin.

## Big Numbers

For tokens with larger tsat values than `MAX_SAFE_INTEGER` use a string input value and a return type of BigInt.

Example:

```ts
toTokenSat("42000000000000.1234", 6, ReturnTypes.BigInt)
// Returns 42000000000000123400n
```