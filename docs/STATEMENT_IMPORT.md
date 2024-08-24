# Bank statement import formats

Expensave can import bank statement and add missing transactions to the calendar.
Import works by comparing bank statement file and expenses containing in Expensave itself. 
Date and amount is the key information by which Expensave decides whether to import transaction or not.
For example, if Expensave has transaction with amount 10.50 on July 15th, and your bank statement file 
contains exact amount on that day - such transaction will be ignored. Otherwise such transaction would be imported.

All importable transactions can be reviewed manually, edited or deleted, before actual saving takes place.

<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/statement-import/expensave-1.png">
   <img alt="Mobile version calendar list" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/statement-import/expensave-1.png" />
</a>

# Supported banks

## Revolut

To export importable Revolut bank statement, head to their [internet bank](https://app.revolut.com). 
1. Login to your account by preferred login method
2. Click on `Statement` button

<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/import-formats/revolut-1.png">
   <img alt="Mobile version calendar list" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/statement-import/revolut-1.png" />
</a>

3. Select `Excel` format

<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/import-formats/revolut-2.png">
   <img alt="Mobile version calendar list" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/statement-import/revolut-2.png" />
</a>

4. Select preferred date range
5. Click `Generate`

It is important not to change generated file name!

## Dollarbird

Navigate to `Settings` -> `Account & Data` and click `Download`

<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/statement-import/dollarbird-1.png">
   <img alt="Mobile version calendar list" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/statement-import/dollarbird-1.png" />
</a>

## Generic format (ISO:20022)

This format should be supported by majority banks. When choosing statement export, just select XML format, if possible.

Known banks which are tested & supported by Expensave:
- [Luminor AS](https://www.luminor.lt/lt)

Help us to extend this list by providing information whether your bank is or is not supported by submitting [issue](https://github.com/algirdasc/expensave/issues/new).

