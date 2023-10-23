## Refactored and Enhanced Test Cases for the Calculate function

### Test Case: Variable Phrase in unit conversion and functions (Edge Case)
**Given:**
```
EUR inc GST / EUR = 1.1
10.0 EUR in EUR inc GST = ?
driver steering angle = 34
sin(driver steering angle) = ?
```

**Expect:**
```
EUR inc GST / EUR = 1.1
10.0 EUR in EUR inc GST = 11 EURincGST
driver steering angle = 34
sin(driver steering angle) = 0.5290826861200238
```

### Test Case: Complex Variable Assignments with Cascading References
**Given:**
```
a = 5
b = a
c = b + 2
d = c + a
d + 5 =
```

**Expect:**
```
a = 5
b = a
c = b + 2
d = c + a
d + 5 = 17
```

### Test Case: Testing Division with Float Results
**Given:**
```
10 / 3 =
```

**Expect:**
```
10 / 3 = 3.3333333333333335
```

### Test Case: Testing Placeholder Functionality In Assignment
**Given:**
```
a = 2
b = 5
c = a + b = ?
```

**Expect:**
```
a = 2
b = 5
c = a + b = 7
```

### Test Case: Testing Placeholder Functionality In Results
**Given:**
```
a = 1
a = ?
```

**Expect:**
```
a = 1
a = 1
```

### Test Case: Testing Conditional Nodes Support
**Given:**
```
15 > 100 ? 1 : -1 =
```

**Expect:**
```
15 > 100 ? 1 : -1 = -1
```

### Test Case: Testing equality checks
**Given:**
```
100 == 100 =
```

**Expect:**
```
100 == 100 = true
```


### Test Case: Explicit Naming for Computed Results with Indentation
**Given:**
```
shops = 10
earningPerShop = 1500
totalEarnings = shops * earningPerShop
    totalEarnings = ?
```

**Expect:**
```
shops = 10
earningPerShop = 1500
totalEarnings = shops * earningPerShop
    totalEarnings = 15000
```

### Test Case: Using Indentation for Implied Results
**Given:**
```
shops = 10
earningPerShop = 1500
totalEarnings = shops * earningPerShop
    = ?
```

**Expect:**
```
shops = 10
earningPerShop = 1500
totalEarnings = shops * earningPerShop
    = 15000
```

### Test Case: Answer in newline
**Given:**
```
a = 2
1 + a
    = ?
1 + 1
    = ?
a
    = ?
```

**Expect:**
```
a = 2
1 + a
    = 3
1 + 1
    = 2
a
    = 2
```

### Test Case: Allow sentences to be variable
**Given:**
```
Per Person Delivery = 11
People Count = 23
Delivery = 12
Total Food Price = Per Person Delivery * People Count
                 = ?
Total Price = Total Food Price + Delivery
            = ?
2 m + 3 km = ?
```

**Expect:**
```
Per Person Delivery = 11
People Count = 23
Delivery = 12
Total Food Price = Per Person Delivery * People Count
                 = 253
Total Price = Total Food Price + Delivery
            = 265
2 m + 3 km = 3.002 km
```

### Test Case: Allow currency notation
**Given:**
```
apple_price = 32 USD
orange_price = 43 USD
total = 3*apple_price + 4*orange_price
      = ?
```

**Expect:**
```
apple_price = 32 USD
orange_price = 43 USD
total = 3*apple_price + 4*orange_price
      = 268 USD
```

### Test Case: Allow for ':' as a result notation
**Given:**
```
apple_price = 32 USD
orange_price = 43 USD
total = 3*apple_price + 4*orange_price
total:
total: ?
total: 268 USD
```

**Expect:**
```
apple_price = 32 USD
orange_price = 43 USD
total = 3*apple_price + 4*orange_price
total: 268 USD
total: 268 USD
total: 268 USD
```

### Test Case: Allow for mathjs functions:
**Given:**
```
f(x) = 2 * x
result = f(3)
result : ?
```

**Expect:**
```
f(x) = 2 * x
result = f(3)
result : 6
```

### Test Case: Allow for currency pairs and pair ratios (Tip: only alphanumeric characters are allowed in unit names):

Note: investigate possible edge case if `EUR/USD = 1.25` is ran multiple times

**Given:**
```
# Glimmer to Shimmer
GLM/SHM = 50
5 SHM to GLM = ?

# Euros to US Dollars
EUR/USD = 1.30
5 USD to EUR = ?

# Euros incusive of GST (10% gst tax)
EURincGST/EUR = 1.1
10.0 EUR in EURincGST = 11 EURincGST
```

**Expect:**
```
# Glimmer to Shimmer
GLM/SHM = 50
5 SHM to GLM = 250 GLM

# Euros to US Dollars
EUR/USD = 1.30
5 USD to EUR = 6.5 EUR

# Euros incusive of GST (10% gst tax)
EURincGST/EUR = 1.1
10.0 EUR in EURincGST = 11 EURincGST
```
