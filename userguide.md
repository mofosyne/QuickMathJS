# QuickMathsJS WebCalc User Guide

Welcome to QuickMathsJS WebCalc! This powerful web-based calculator is built on the robust math.js library, which supports a wide array of mathematical operations, functions, constants, and data types. Whether you're working on basic arithmetic or complex mathematical expressions, this guide will help you make the most of QuickMathsJS WebCalc.

## Table of Contents

1. [Basic Arithmetic Operations](#basic-arithmetic-operations)
2. [Advanced Mathematical Functions](#advanced-mathematical-functions)
3. [Constants](#constants)
4. [Units](#units)
5. [Matrices and Arrays](#matrices-and-arrays)
6. [Saving and Loading Calculations](#saving-and-loading-calculations)
7. [Error Handling](#error-handling)
8. [Numerical Input and Output Styles](#numerical-input-and-output-styles)

---

## Basic Arithmetic Operations

- **Addition**: `5 + 3 = 8`
- **Subtraction**: `7 - 4 = 3`
- **Multiplication**: `6 * 3 = 18`
- **Division**: `8 / 2 = 4`
- **Power**: `3 ^ 4 = 81`
- **Modulus (Remainder after Division)**: `10 % 3 = 1`

---

## Advanced Mathematical Functions

### Trigonometric Functions

> Note: tan(pi/4) = 1, but this script won't give exactly 1 due to floating-point approximations. This is common in many software libraries.

- **sin(pi/2)**: `1`
- **cos(pi)**: `-1`
- **tan(pi/4)**: `0.9999999999999999`

### Inverse Trigonometric Functions

- **asin(0.5)**: `0.5235987755982989`
- **acos(0.5)**: `1.0471975511965979`

### Logarithmic and Exponential Functions

- **log(100)**: `4.605170185988092`
- **exp(2)**: `7.38905609893065`

### Square root and nth root

- **sqrt(9)**: `3`
- **nthRoot(27, 3)**: `3`

### Factorial

- **5!**: `120`

---

## Constants

- **Pi (3.141592653589793)**: `2 * pi = 6.283185307179586`
- **Euler's number (2.718281828459045)**: `2 * e = 5.43656365691809`
- **Tau (6.283185307179586)**: `tau/2 = 3.141592653589793`
- **Golden ratio (1.618033988749895)**: `2 * phi = 3.23606797749979`

---

## Units

### Basic unit operations

- `5 m + 3 m = 8 m`
- `10 kg * 10 m/s^2 = 100 N`

### Unit conversions

- `5 m to cm = 500 cm`

---

## Matrices and Arrays

### Matrix Creation

- `matrix = [1, 2; 3, 4]`

### Matrix Addition

- `[1, 2; 3, 4] + [1, 1; 1, 1] = [[2, 3], [4, 5]]`

### Matrix Determinant

- `det([1, 2; 3, 4]) = -2`

### Transpose

- `transpose([1, 2; 3, 4]) = [[1, 3], [2, 4]]`

---

## Saving and Loading Calculations

All of your calculations are saved in the URL. To save your work, simply copy the URL. To load your calculations, paste the saved URL into your browser.

---

## Error Handling

If you make a mistake in your calculations, QuickMathsJS WebCalc will show an error message right next to the problematic expression.

Example: `1/0 = Infinity`

---

## Numerical Input and Output Styles

QuickMathsJS WebCalc supports multiple numerical input styles, making it versatile for different applications.

### Decimal Representation

- `324 = 324`

### Hexadecimal Representation

- `hex(324) = 0x144`

### Binary Representation

Entering binary values is as straightforward as prefixing them with `0b`.

- **Input**: `0b1100100`  
  **Output**: `100`

You can also convert decimal to binary using the `bin()` function.

- **Decimal to Binary**: `bin(324) = 0b101000100`

Remember, you can convert between various numerical representations easily using QuickMathsJS WebCalc, ensuring a comprehensive mathematical experience.


---

### Saving and Loading Calculations

All of your calculations are saved in the URL. To save your work, simply copy the URL. To load your calculations, paste the saved URL into your browser.

### Error Handling

If you make a mistake in your calculations, QuickMathsJS WebCalc will show an error message right next to the problematic expression.

