# User Example And Test Cases

## Test Cases for the Calculate function

### Test Case 1: Basic Arithmetic
**Given:**
```
1 + 1 =
```

**Expect:**
```
1 + 1 = 2
```

### Test Case 2: Variable Assignment
**Given:**
```
a = 5
```

**Expect:**
```
a = 5
```

### Test Case 3: Arithmetic, Multiplication and other basic operations with Variables
**Given:**
```
a = 6
a + 3 =
a - 3 = 
a * 3 =
a / 3 = 
a ^ 3 = 
a % 3 =
```

**Expect:**
```
a = 6
a + 3 = 9
a - 3 = 3
a * 3 = 18
a / 3 = 2
a ^ 3 = 216
a % 3 = 0
```

### Test Case 3.0: More Advance Operators
**Given:**
```
sqrt(9) = 
nthRoot(27, 3) = 
5! = 
```

**Expect:**
```
sqrt(9) = 3
nthRoot(27, 3) = 3
5! = 120
```

### Test Case 3.1: Trigonometric Functions and output plus assignment
**Given:**
```
sin(pi/2) =
cos(pi) = 
tan(pi/4) =
asin(0.5) =
acos(0.5) =
log(100) = 
exp(2) = 
```

**Expect:**
```
sin(pi/2) = 1
cos(pi) = -1
tan(pi/4) = 0.9999999999999999
asin(0.5) = 0.5235987755982989
acos(0.5) = 1.0471975511965979
log(100) = 4.605170185988092
exp(2) = 7.38905609893065
```

### Test Case 3.2: Arithmetic with Variables and output plus assignment
**Given:**
```
a = 5
b = a + 1 =
```

**Expect:**
```
a = 5
b = a + 1 = 6
```

### Test Case 4: Multiple Variable Assignments
**Given:**
```
x = y = z = 5 + 2 =
```

**Expect:**
```
x = y = z = 5 + 2 = 7
```

### Test Case 5: Expression with Provided Result (Correct)
**Given:**
```
4 * 3 = 12
```

**Expect:**
```
4 * 3 = 12
```

### Test Case 6: Expression with Provided Result (Incorrect)
**Given:**
```
4 * 3 = 11
```

**Expect:**
```
4 * 3 = 12
```

### Test Case 7: Division by Zero
**Given:**
```
1 / 0 =
```

**Expect:**
```
1 / 0 = Error: Infinity. Possible Division by zero
```

### Test Case 8: Undefined Variable
**Given:**
```
a + b =
```

**Expect:**
```
a + b = Error: Undefined symbol a
```

### Test Case 9: Multi Variable Assignment with Expression
**Given:**
```
a = b = 2 + 3 =
```

**Expect:**
```
a = b = 2 + 3 = 5
```

### Test Case 10: Error Replacement
**Given:**
```
1 / 0 = Error: Something went wrong
```

**Expect:**
```
1 / 0 = Error: Infinity. Possible Division by zero
```

### Test Case 11: Invalid Multi Variable Assignment
**Given:**
```
y = 2
x = 1 + y = 3 =
```

**Expect:**
```
y = 2
x = 1 + y = 3
```

### Test Case 12: Cascading Calculations
**Given:**
```
a = 5
b = a + 1 = 9
c = b + 1
d = c + 1 = 6
```

**Expect:**
```
a = 5
b = a + 1 = 6
c = b + 1
d = c + 1 = 8
```


### Test Case 13: Cascading failure
**Given:**
```
a = 5
b = a + 1/0
c = b + 1
c + 1 = 8
```

**Expect:**
```
a = 5
b = a + 1/0 Error: Infinity. Possible Division by zero
c = b + 1 Error: Infinity. Possible Division by zero
c + 1 = 8 Error: Infinity. Possible Division by zero
```

### Test Case 14: Multi Variable Assignment with Expression but no results
**Given:**
```
a = b = 2 + 3
```

**Expect:**
```
a = b = 2 + 3
```

### Test Case 14: Multi Variable Assignment with Expression but no results
**Given:**
```
matrix = [[1, 2], [3, 4]]
matrix + [1, 1; 1, 1] = 
det(matrix) = 
transpose(matrix) = 
```

**Expect:**
```
matrix = [[1, 2], [3, 4]]
matrix + [1, 1; 1, 1] = [[2, 3], [4, 5]]
det(matrix) = -2
transpose(matrix) = [[1, 3], [2, 4]]
```

### Test Case 15: Units
**Given:**
```
5 m + 3 m = 2 m
10 kg * 10 m/s^2 =
```

**Expect:**
```
5 m + 3 m = 8 m
10 kg * 10 m/s^2 = 100 N
```

### Test Case 16: Assorted Direct Results
**Given:**
```
1/0 = Infity
324 = 32
hex(324) = 0x14
0b1100100 =
bin(324) = 0b0100
```

**Expect:**
```
1/0 = Infity Error: Infinity. Possible Division by zero
324 = 324
hex(324) = 0x144
0b1100100 = 100
bin(324) = 0b101000100
```

### Test Case 16: Constants
**Given:**
```
2 * pi = 
2 * e =
tau/2 = 
2 * phi =
```

**Expect:**
```
2 * pi = 6.283185307179586
2 * e = 5.43656365691809
tau/2 = 3.141592653589793
2 * phi = 3.23606797749979
```

### Test Case 17: multiple assignments
**Given:**
```
a = 5
b = 7
c = a + b
c * 2 = 24
```

**Expect:**
```
a = 5
b = 7
c = a + b
c * 2 = 24
```
