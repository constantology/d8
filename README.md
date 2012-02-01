# d8.js

d8 is a date parsing and formatting micro-framework for modern JavaScript engines.

d8 uses [Templ8](https://github.com/constantology/Templ8) to output a String representation of a Date, based on [php formatting options](http://php.net/manual/en/function.date.php).

As d8 extends JavaScript's native `Date` & `Date.prototype` – the CORRECT way – there is no actual global called d8. Instead all static and instance methods are available from the native `Date` & `Date.prototype` respectively.

currently the only locales available are:

- en-GB
- en-US

but feel free to create a locale for your specific nationality and submit a pull request! :D

## WARNING!

This is an, as yet, untested and incompletely documented framework. Use at your own risk.

## browser usage

```html

<!-- IMPORTANT: Templ8 must be loaded before d8 -->
   <script src="/path/to/Templ8/Templ8.client.min.js" type="text/javascript"></script>
<!-- IMPORTANT: The correct locale must ALSO be loaded before d8! -->
   <script src="/path/to/d8/locale/en-GB.js" type="text/javascript"></script>
   <script src="/path/to/d8/d8.min.js" type="text/javascript"></script>

```

## nodejs usage

```javascript

   require( 'd8/locale/en-GB.js' ); // IMPORTANT: The correct locale must ALSO be loaded before d8!!
   require( 'd8' );

```

As mentioned above d8 extends JavaScript's native `Date` & `Date.prototype`, so when requiring d8, you don't need to assign it to a variable to use d8's features.

## API

### Static methods

#### isLeapYear( year:String ):Boolean
#### setLeapYear( date:Date ):Void
#### toDate( date:String, format:String ):Date

### Static properties

#### filters
An Object of all the available filters for formatting a Date

#### formats
An Object containing some default date formats:
<table border="0" cellpadding="0" cellspacing="0">
	<tr><td>ISO_8601</td><td>Y-m-d<T>H:i:sP</td>
	<tr><td>ISO_8601_SHORT</td><td>Y-m-d</td>
	<tr><td>RFC_850</td><td>l, d-M-y H:i:s T</td>
	<tr><td>RFC_2822</td><td>D, d M Y H:i:s O</td>
	<tr><td>sortable</td><td>Y-m-d H:i:sO</td>
</table>

### Instance methods

#### GMTOffset( colon:Boolean ):String
#### ISODay():Number
#### ISODaysInYear():Number
#### ISOFirstMondayOfYear():Date
#### ISOWeek():Number
#### ISOWeeksInYear():Number
#### adjust( interval:Object|String, value:Number ):Date
#### between( date_lower:Date, date_higher:Date ):Boolean
#### clearTime():Date
#### clone():Date
#### dayOfYear():Number
#### firstOfTheMonth():Date
#### format( format:String ):String
#### isDST():Boolean
#### isLeapYear():Boolean
#### lastOfTheMonth():Date
#### timezone():String

## Date formatting and parsing options

### day
<table border="0" cellpadding="0" cellspacing="0">
	<tr><td>d</td><td>Day of the month, 2 digits with leading zeros</td>
	<tr><td>D</td><td>A textual representation of a day, three letters</td>
	<tr><td>j</td><td>Day of the month without leading zeros</td>
	<tr><td>l</td><td>A full textual representation of the day of the week</td>
	<tr><td>N</td><td>ISO-8601 numeric representation of the day of the week</td>
	<tr><td>S</td><td>English ordinal suffix for the day of the month, 2 characters</td>
	<tr><td>w</td><td>Numeric representation of the day of the week</td>
	<tr><td>z</td><td>The day of the year (starting from 0)</td>
</table>
### week
<table border="0" cellpadding="0" cellspacing="0">
	<tr><td>W</td><td>ISO-8601 week number of year, weeks starting on Monday</td>
</table>
### month
<table border="0" cellpadding="0" cellspacing="0">
	<tr><td>F</td><td>A full textual representation of a month</td>
	<tr><td>m</td><td>Numeric representation of a month, with leading zeros</td>
	<tr><td>M</td><td>A short textual representation of a month, three letters</td>
	<tr><td>n</td><td>Numeric representation of a month, without leading zeros</td>
	<tr><td>t</td><td>Number of days in the given month</td>
</table>
### year
<table border="0" cellpadding="0" cellspacing="0">
	<tr><td>L</td><td>Whether it's a leap year</td>
	<tr><td>o</td><td>ISO-8601 year number. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead.</td>
	<tr><td>Y</td><td>A full numeric representation of a year, 4 digits</td>
	<tr><td>y</td><td>A two digit representation of a year</td>
</table>
### time
<table border="0" cellpadding="0" cellspacing="0">
	<tr><td>a</td><td>Lowercase Ante meridiem and Post meridiem</td>
	<tr><td>A</td><td>Uppercase Ante meridiem and Post meridiem</td>
	<tr><td>g</td><td>12-hour format of an hour without leading zeros</td>
	<tr><td>G</td><td>24-hour format of an hour without leading zeros</td>
	<tr><td>h</td><td>12-hour format of an hour with leading zeros</td>
	<tr><td>H</td><td>24-hour format of an hour with leading zeros</td>
	<tr><td>i</td><td>Minutes with leading zeros</td>
	<tr><td>s</td><td>Seconds, with leading zeros</td>
	<tr><td>u</td><td>Milliseconds</td>
</table>
### timezone
<table border="0" cellpadding="0" cellspacing="0">
	<tr><td>O</td><td>Difference to Greenwich time (GMT) in hours</td>
	<tr><td>P</td><td>Difference to Greenwich time (GMT) with colon between hours and minutes</td>
	<tr><td>T</td><td>Timezone abbreviation</td>
	<tr><td>Z</td><td>Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive.</td>
</table>
### full date/time
<table border="0" cellpadding="0" cellspacing="0">
	<tr><td>c</td><td>ISO 8601 date</td>
	<tr><td>r</td><td>RFC 2822 formatted date</td>
	<tr><td>U</td><td>Seconds since the Unix Epoch January 1 1970 00:00:00 GMT</td>
</table>
