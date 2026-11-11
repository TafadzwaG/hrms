# Payroll input methods

How period inputs (one-off earnings and deductions) get into HRX, and how they compare
with the input methods in Belina Payroll.

## Methods

| Method | Where | What it is for |
|---|---|---|
| Single input | Payroll > Inputs > Add input | One employee, one pay code. |
| Payslip input | Period > Results > Inputs, or `/payroll/periods/{period}/employees/{employee}/payslip-input` | Everything feeding one employee's payslip on one screen, with a live preview of PAYE, AIDS Levy, net pay and the currency split. Step through employees with the arrows. |
| Bulk input | Payroll > Inputs > Bulk input | Add one pay code to, or remove it from, everyone in the payroll, selected departments, or selected cost centres. |
| Grid input | Payroll > Inputs > Grid input, or Period > Grid Input | Spreadsheet of employees against chosen pay codes. Enter moves down a column. Post sends the changed cells as one batch. Column choices can be saved as layouts. |
| Import | Payroll > Inputs > Import inputs | CSV or Excel (.xlsx) file, one row per employee and pay code. Columns: `staff_number, pay_code, amount, quantity, rate, reference, notes`. |
| Hourly input | Payroll > Inputs > Hourly input, or Period > Hourly Input | Hours (and units such as mileage) line by line, by day and cost centre or as totals, typed in or uploaded. Columns for upload: `staff_number, pay_code, quantity, work_date, cost_centre, rate, notes`. |

Pay codes HRX calculates itself (BASIC, PAYE, AIDS Levy, NSSA, pension, NEC, union) cannot be
entered through bulk or grid input. Hour and unit pay codes are captured only in Hourly input,
so each employee's own rate is used.

## Hourly pay

- **Pay basis.** A payroll profile is Salaried (BASIC from basic salary each period) or Hourly
  (no BASIC; paid for the hours captured). Hourly profiles need an hourly rate.
- **Hour and unit pay codes.** A pay code is paid by Amount, Hours or Units. Hours codes are
  paid at the employee's hourly rate times the code's rate multiplier: NORM (normal hours, 1),
  OT (the employee's own overtime multiplier, as for timesheet overtime) and OT2 (double time, 2).
  Units codes, such as a mileage code you create, are paid at the rate entered on the line or
  the code's default rate.
- **Rate fixed at capture.** The rate is worked out and stored when the line is posted. If an
  hourly rate changes, reverse the batch and post it again.
- **Checks.** Dates must fall in the period; one employee cannot have more than 24 hours on one
  date (`payroll.max_hours_per_day`); an hourly batch's control total is in hours. An uploaded
  file posts whole or not at all.
- **Payslip.** Lines for the same pay code and rate are shown as one payslip line with the total
  hours. Pension and union percentages are charged on normal-hours pay for hourly employees.
- **Cost centres.** Each line can be charged to a cost centre (default: the employee's). The GL
  journal export now has a cost centre column and splits amounts accordingly. Timesheet overtime
  is unchanged and still comes in as one OT total per employee.

## Batches and control totals

Every import, bulk action and grid post is a **batch** (`payroll_input_batches`), numbered
`B-00001` onward per organization, and listed at Payroll > Inputs > Batches.

- **Control totals (optional).** Enter the expected total amount and number of rows. If the
  batch does not match, nothing is posted and the differences are shown. Tick
  "Post even if totals differ" to post anyway; the differences are kept on the batch.
- **Reversal.** A batch can be reversed while its period is open. Inputs it created are
  removed, inputs it changed get their earlier values back, and inputs it deleted are
  restored. Reversal is refused if any of those inputs has been changed since (for example
  edited by hand, which takes an input out of its batch, or overwritten by a later batch).

## Rules

- No input can be added, changed or removed once the period is approved or closed, by any
  method. Reopen the period first.
- Changing inputs after processing does not change payslips until the period is
  reprocessed. Payslip input shows when the preview differs from the last processed run.
- Grid cells are inputs with the reference `GRID`. Inputs captured other ways are shown
  beside the cell and never changed by the grid.
- Bulk and grid input apply only to employees with an active payroll profile effective at
  the period end.

## Comparison with Belina

| Belina | HRX |
|---|---|
| Payslip Input, with Compute | Payslip input. The preview is recalculated on every load rather than on demand. |
| Bulk Input (insert or delete, by employee, department or cost centre) | Bulk input |
| Spreadsheet Input (saved formats, re-post replaces) | Grid input with saved layouts |
| Batch Input (batch number, hash totals, reopen, export) | Batches with control totals and reversal. No export of a batch yet. |
| Hourly Input (batch of hours, summary or detail, cost centres, hash totals, non-time units) | Hourly input |
| Speed Input | Not built: grid input with Enter-to-move-down covers the same need. |

## Not yet built

- Feeding approved timesheets or clock-in data straight into Hourly input.
- Public holiday and Sunday rates as separate codes (create them as Hours codes with a multiplier).
- Quantity x rate in the grid (the grid takes amounts only).
- Exporting a batch to Excel.
