# User Guides And Examples

## Syntax Quickstart

How to get results from expression and assign variables

### Arithmetic with Variables and output plus assignment
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

### Multiple Variable Assignments
**Given:**
```
x = y = z = 5 + 2 =
```

**Expect:**
```
x = y = z = 5 + 2 = 7
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

## Basic Operations

### Basic Arithmetic
**Given:**
```
1 + 1 =
```

**Expect:**
```
1 + 1 = 2
```

### Variable Assignment
**Given:**
```
a = 5
```

**Expect:**
```
a = 5
```

### Arithmetic, Multiplication and other basic operations with Variables
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

## Medium Operations

### More Advance Operators
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

### Trigonometric Functions and output plus assignment
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

### Currency pairs and pair ratios 

Tip: only alphanumeric characters are allowed in unit names
Note: `EUR inc GST` is automatically converted internally into `EURincGST`

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
10.0 EUR in EURincGST = ?

# Euros incusive of GST (10% gst tax)
EUR inc GST / EUR = 1.1
10.0 EUR in EUR inc GST = ?
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

# Euros incusive of GST (10% gst tax)
EUR inc GST / EUR = 1.1
10.0 EUR in EUR inc GST = 11 EUR inc GST
```

### Use phrases as variable and define custom units

In this example we define dogs and cats as `fancy animals`.
Internally we are concating `fancy animals` into `fancyanimals` so it is compatible with math.js .
Note that `fancyanimals^2` is not expanded, but we opted not to put in the effort to expand it
as it can be argued that it would be easier to read such compounded units.

**Given:**
```
pitbull dogs = 234 fancy animals
flowery cats = 423 fancy animals
animal count = pitbull dogs + flowery cats
animal count: ?
animal count = pitbull dogs * flowery cats
animal count: ?
```

**Expect:**
```
pitbull dogs = 234 fancy animals
flowery cats = 423 fancy animals
animal count = pitbull dogs + flowery cats
animal count: 657 fancy animals
animal count = pitbull dogs * flowery cats
animal count: 98982 fancyanimals^2
```


## Use Cases Examples


### Catering 

# Use Cases Examples

Maybe you want to do some pricing estimations?
This shows how you can use 

```calc
# Range Quote Input
upper_bound_price = 50.33 AUD exc gst / pax
upper_pax_count = 30 pax
lower_bound_price = 55.55 AUD exc gst / pax
lower_pax_count = 10 pax

# Slope Intercept Formula (y = mx + c)
m(y1, y2, x1, x2) = ((y1 - y2) / (x1 - x2))
c(y1, y2, x1, x2) = y1 - m(y1, y2, x1, x2)*x1
y_linear(x, y1, y2, x1, x2) = m(y1, y2, x1, x2)*x + c(y1, y2, x1, x2)

# Food Price Per Persion Function
foodPricePP(paxCount) = y_linear(paxCount, upper_bound_price, lower_bound_price, upper_pax_count, lower_pax_count)

# Note that unit price is $ per person
foodPricePP(10 pax): 55.55 AUD exc gst / pax

# Ah here, this fails because round() doesn't support units... solved by using .toNumber() to remove units for now
foodPricePP_rounded(paxCount) = round(foodPricePP(paxCount).toNumber(), 2) * AUD exc gst / pax
foodPricePP_rounded(3 pax): 57.38 AUD exc gst / pax

# Formatted Output Functions
style = {notation: 'fixed', precision: 2}
foodPricePPout(paxCount) = format(foodPricePP_rounded(paxCount) , style)
foodTotalPrice(paxCount) = format(foodPricePP_rounded(paxCount) * paxCount , style)

# People Count To Per Person Price
foodPricePPout(10 pax): 55.55 AUD exc gst / pax
foodPricePPout(11 pax): 55.29 AUD exc gst / pax
foodPricePPout(12 pax): 55.03 AUD exc gst / pax
#... etc...
foodPricePPout(28 pax): 50.85 AUD exc gst / pax
foodPricePPout(29 pax): 50.59 AUD exc gst / pax
foodPricePPout(30 pax): 50.33 AUD exc gst / pax

# People Count To Total Food Cost
foodTotalPrice(10 pax): 555.50 AUD exc gst
foodTotalPrice(11 pax): 608.19 AUD exc gst
foodTotalPrice(12 pax): 660.36 AUD exc gst
#... etc...
foodTotalPrice(28 pax): 1423.80 AUD exc gst
foodTotalPrice(29 pax): 1467.11 AUD exc gst
foodTotalPrice(30 pax): 1509.90 AUD exc gst
```