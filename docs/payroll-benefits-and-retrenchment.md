# Medical aid, funeral schemes and retrenchment in payroll

## Benefits reach payroll automatically

A benefit's **Payroll Deduction** setting (on the benefit form) decides how its enrolments
reach payroll:

| Setting | Employee deduction | Employer share |
|---|---|---|
| Not deducted through payroll (default) | none | none |
| Medical aid | `MED` (immediate family) and `MEDD` (other dependants) | `MED_ER` |
| Funeral scheme | `FUN` | `FUN_ER` |
| Other benefit | `BEN`, or the enrolment's payroll deduction code | `BEN_ER` |

Every active enrolment (status active, started by the period end, not ended before the
period start) is deducted on each payslip. Nothing needs entering in Payroll.

If the same pay code is also entered on payroll (a recurring item or an input), the run
warns that it may be deducted twice.

### How much is deducted

- **Plan rates per person.** On the benefit's Plans tab, give each plan a monthly rate for
  the member, a spouse, a child and any other dependant, and the employer's share (a
  percentage of the premium or a fixed amount). The premium is the member rate plus a rate
  for each active dependant on the enrolment; the employer's share is taken off and the
  rest is deducted from the employee.
- **Fixed amounts.** If the plan has no member rate, the employee and employer amounts on
  the enrolment are used instead.

### Who counts as immediate family (medical aid)

Member, spouse, and children under 18, or under 25 while marked as full-time students on the
dependant record. Everyone else (parents, siblings, adult children) is an other dependant.

The employee's share is split between the two in proportion to the premium. Only `MED`
(immediate family) earns the 50% medical tax credit under FDS; `MEDD` does not.

### Employer contributions

Employer-share lines (type `EMPLOYER`) are recorded on the payroll result but are not part
of gross or net pay and do not show on the employee's payslip. The GL journal books each one
twice: an expense (debit) and an amount payable to the scheme (credit). Payslip input shows
the employer total under the preview.

## Retrenchment

- Use the `RETR` (Retrenchment package) pay code, or any earning code with the income type
  "Retrenchment".
- The tax-free part is the greater of a share of the package and a minimum, but no more than
  a cap for the tax year, and never more than the package. The three values are on
  Payroll > Tax tables and credits; the USD row is seeded with one third, US$3,200 and
  US$5,033.33 (as described by Belina for Finance Act 13 of 2023), unverified.
- The rest is taxed as irregular income: added at its actual amount under FDS, or to the
  month's income under Non-FDS. If the exemption values are empty the whole package is taxed
  and the run warns.

### Final pay for leavers

An employee whose termination date falls in the period is included in that period's payroll
even if they or their profile are already marked terminated, so their final pay can be
processed. They are left out of later periods.

## CILL is now cash in lieu of leave

`CILL` was set up as the cellphone allowance. It now means cash in lieu of leave (leave paid
out in cash), an irregular earning. Existing cellphone allowance codes are moved to `CELL`
with their inputs and recurring items. Past payslips keep their original descriptions.

## Needs a payroll specialist

- Confirm the retrenchment values and whether the taxable part should be averaged under FDS.
- Confirm whether employer-paid medical aid or funeral cover is a taxable benefit. HRX does
  not add employer contributions to taxable income.
- Remittance schedules to schemes are not built yet.
