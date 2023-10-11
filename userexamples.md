# User Example And Test Cases

## Test Cases for the Calculate function

### Test Case 1: Basic Arithmetic
given:
```
1 + 1 =
```

expect:
```
1 + 1 = 2
```

### Test Case 2: Variable Assignment
given:
```
a = 5
```

expect:
```
a = 5
```

### Test Case 3: Arithmetic with Variables
given:
```
a = 5
a + 3 =
```

expect:
```
a = 5
a + 3 = 8
```


### Test Case 3.1: Arithmetic with Variables
given:
```
a = 5
b = a + 1 =
```

expect:
```
a = 5
b = a + 1 = 6
```

### Test Case 4: Multiple Variable Assignments
given:
```
x = y = z = 5 + 2 =
```

expect:
```
x = y = z = 5 + 2 = 7
```

### Test Case 5: Expression with Provided Result (Correct)
given:
```
4 * 3 = 12
```

expect:
```
4 * 3 = 12
```

### Test Case 6: Expression with Provided Result (Incorrect)
given:
```
4 * 3 = 11
```

expect:
```
4 * 3 = 12
```

### Test Case 7: Division by Zero
given:
```
1 / 0 =
```

expect:
```
1 / 0 = Error: Infinity. Possible Division by zero
```

### Test Case 8: Undefined Variable
given:
```
a + b =
```

expect:
```
a + b = Error: Undefined symbol a
```

### Test Case 9: Multi Variable Assignment with Expression
given:
```
a = b = 2 + 3 =
```

expect:
```
a = b = 2 + 3 = 5
```

### Test Case 10: Error Replacement
given:
```
1 / 0 = Error: Something went wrong
```

expect:
```
1 / 0 = Error: Infinity. Possible Division by zero
```

### Test Case 11: Invalid Multi Variable Assignment
given:
```
y = 2
x = 1 + y = 3 =
```

expect:
```
y = 2
x = 1 + y = 3
```

### Test Case 12: Cascading Calculations
given:
```
a = 5
b = a + 1 = 9
c = b + 1
d = c + 1 = 6
```

expect:
```
a = 5
b = a + 1 = 6
c = b + 1
d = c + 1 = 8
```


### Test Case 13: Cascading failure
given:
```
a = 5
b = a + 1/0
c = b + 1
c + 1 = 8
```

expect:
```
a = 5
b = a + 1/0 Error: Infinity. Possible Division by zero
c = b + 1 Error: Infinity. Possible Division by zero
c + 1 = 8 Error: Infinity. Possible Division by zero
```

### Test Case 14: Multi Variable Assignment with Expression but no results
given:
```
a = b = 2 + 3
```

expect:
```
a = b = 2 + 3
```
