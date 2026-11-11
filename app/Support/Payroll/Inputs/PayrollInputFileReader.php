<?php

namespace App\Support\Payroll\Inputs;

use Illuminate\Support\Str;
use OpenSpout\Common\Entity\Cell\FormulaCell;
use OpenSpout\Reader\XLSX\Reader as XlsxReader;

/**
 * Reads a payroll input file (CSV or Excel .xlsx) into rows keyed by column name.
 * The first row holds the column names; only the first sheet of a workbook is read.
 */
class PayrollInputFileReader
{
    public const COLUMNS = ['staff_number', 'pay_code', 'amount', 'quantity', 'rate', 'reference', 'notes'];

    /**
     * @return array<int, array<string, string>> rows keyed by their line number in the file
     */
    public static function read(string $path, string $extension): array
    {
        $raw = $extension === 'xlsx' ? self::readXlsx($path) : self::readCsv($path);

        if ($raw === []) {
            return [];
        }

        $header = array_map(
            fn ($value) => Str::of((string) $value)->replace("\u{FEFF}", '')->trim()->lower()->replace(' ', '_')->toString(),
            array_shift($raw),
        );

        $rows = [];

        foreach ($raw as $index => $values) {
            $row = [];

            foreach ($header as $position => $column) {
                if ($column !== '') {
                    $row[$column] = trim((string) ($values[$position] ?? ''));
                }
            }

            // Line numbers as a person would count them in the file, header being line 1.
            $rows[$index + 2] = $row;
        }

        return $rows;
    }

    /**
     * @return array<int, array<int, mixed>>
     */
    private static function readCsv(string $path): array
    {
        $handle = fopen($path, 'r');

        if ($handle === false) {
            return [];
        }

        $rows = [];

        while (($row = fgetcsv($handle)) !== false) {
            $rows[] = $row;
        }

        fclose($handle);

        return $rows;
    }

    /**
     * @return array<int, array<int, mixed>>
     */
    private static function readXlsx(string $path): array
    {
        $reader = new XlsxReader;
        $reader->open($path);
        $rows = [];

        foreach ($reader->getSheetIterator() as $sheet) {
            foreach ($sheet->getRowIterator() as $row) {
                $rows[] = array_map(function ($cell) {
                    // A formula cell holds the formula; the figure the user sees is its computed value.
                    $value = $cell instanceof FormulaCell ? $cell->getComputedValue() : $cell->getValue();

                    return $value instanceof \DateTimeInterface ? $value->format('Y-m-d') : $value;
                }, $row->getCells());
            }

            break;
        }

        $reader->close();

        return $rows;
    }
}
