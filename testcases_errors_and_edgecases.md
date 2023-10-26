## Edge Test Cases for the Calculate function

### Test Case: Unary Minus
**Given:**
```
1 - 2 = ?
1kg - 2kg = ?
```

**Expect:**
```
1 - 2 = -1
1kg - 2kg = -1 kg
```

### Test Case: Non Simple Unit Type
**Given:**
```
format(1/2, {notation: 'exponential'}) = ?
format(1/2, {notation: 'exponential'}) : ?
```

**Expect:**
```
format(1/2, {notation: 'exponential'}) = 5e-1
format(1/2, {notation: 'exponential'}) : 5e-1
```

### Test Case: Non Simple Unit Type (edge case)
**Given:**
```
a = 1 km/h
a: ?
a^2 : ?
b = 1 km^2
b: ?
b^2: ?
c = 1 km s
c: ?
c^2: ?
```

**Expect:**
```
a = 1 km/h
a: 1 km / h
a^2 : 1.0000000000000002 km^2 / h^2
b = 1 km^2
b: 1 km^2
b^2: 1 km^4
c = 1 km s
c: 1 km s
c^2: 1 km^2 s^2
```

### Test Case: Variable Overwrites
**Given:**
```
a = 5
a = 6
a + 2 =
```

**Expect:**
```
a = 5
a = 6
a + 2 = 8
```

### Test Case: Multi Variable Assignment with Expression
**Given:**
```
a = b = 2 + 3 =
```

**Expect:**
```
a = b = 2 + 3 = 5
```

### Test Case: Check that exponent results with unit is recognised as a result (Edge Case):
**Given:**
```
4.6 MB in B = ?
```

**Expect:**
```
4.6 MB in B = 4.6e+6 B
```

### Test Case: Testing Edge Cases with Very Large Numbers
**Given:**
```
999999999999 + 1 =
```

**Expect:**
```
999999999999 + 1 = 1000000000000
```


### Test Case: Handling Negative Numbers
**Given:**
```
-5 + 3 =
```

**Expect:**
```
-5 + 3 = -2
```

### Test Case: Expressions with No Operations
**Given:**
```
a = 
```

**Expect:**
```
a = Error: Undefined symbol a
```


### Test Case: Preserve Newlines above and below a doc
**Given:**
```


1 + 1 = 


```

**Expect:**
```


1 + 1 = 2


```


### Test Case: Expression with Provided Result (Correct)
**Given:**
```
4 * 3 = 12
```

**Expect:**
```
4 * 3 = 12
```

### Test Case: Expression with Provided Result (Incorrect)
**Given:**
```
4 * 3 = 11
```

**Expect:**
```
4 * 3 = 12
```

### Test Case: Division by Zero
**Given:**
```
1 / 0 =
```

**Expect:**
```
1 / 0 = Error: Infinity. Possible Division by zero
```

### Test Case: Undefined Variable
**Given:**
```
a + b =
```

**Expect:**
```
a + b = Error: Undefined symbol a
```

### Test Case: Error Replacement
**Given:**
```
1 / 0 = Error: Something went wrong
```

**Expect:**
```
1 / 0 = Error: Infinity. Possible Division by zero
```

### Test Case: Invalid Multi Variable Assignment
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

### Test Case: Cascading failure
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

### Test Case: Multi Variable Assignment with Expression but no results
**Given:**
```
a = b = 2 + 3
```

**Expect:**
```
a = b = 2 + 3
```

### Test Case: Matrix
**Given:**
```
matrix = [[1, 2], [3, 4]]
matrix + [1, 1; 1, 1] = 
det(matrix) = 
transpose(matrix) = 
matrix + [1, 1; 1, 1] = [[2, 3], [4, 5]]
```

**Expect:**
```
matrix = [[1, 2], [3, 4]]
matrix + [1, 1; 1, 1] = [[2, 3], [4, 5]]
det(matrix) = -2
transpose(matrix) = [[1, 3], [2, 4]]
matrix + [1, 1; 1, 1] = [[2, 3], [4, 5]]
```