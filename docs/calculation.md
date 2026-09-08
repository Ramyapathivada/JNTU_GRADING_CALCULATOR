# Calculation Reference

## SGPA

For each subject:

```text
Credit Point = Credits × Grade Point
```

Then:

```text
SGPA = Total Credit Points / Total Credits
```

Example:

```text
Maths:   4 credits × 8 GP  = 32
Physics: 3 credits × 9 GP  = 27
Java:    4 credits × 10 GP = 40

Total credits = 11
Total points  = 99

SGPA = 99 / 11 = 9.00
```

## CGPA

When semester SGPA and semester credit totals are known:

```text
CGPA = Σ(SGPA × Semester Credits) / Σ(Semester Credits)
```

The most authoritative method is the subject-level credit-point calculation specified by the applicable regulation. This application uses semester credit-weighted SGPA values for convenience when building cumulative results.

## Percentage

The default conversion configured in this project is:

```text
Percentage = (CGPA - 0.5) × 10
```

Always verify the conversion formula against the applicable regulation.
