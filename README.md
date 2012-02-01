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

## file size

<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td width="256">d8.js</td><td width="48">5.6kb</td><td>deflate</td>
	<tr><td width="256">d8.min.js</td><td width="48">3.4kb</td><td>uglified + deflate</td>
	<tr><td width="256">d8.js + Templ8.client.js</td><td width="48">13.2kb</td><td>deflate</td>
	<tr><td width="256">d8.min.js + Templ8.client.min.js</td><td width="48">8.5kb</td><td>uglified + deflate</td>
</table>

## browser usage

```html

<!-- IMPORTANT: Templ8 must be loaded before d8 -->
   <script src="/path/to/Templ8/Templ8.client.min.js" type="text/javascript"></script>
<!-- IMPORTANT: The correct locale must ALSO be loaded before d8! -->
   <script src="/path/to/d8/locale/en-GB.js" type="text/javascript"></script>
   <script src="/path/to/d8/d8.min.js" type="text/javascript"></script>

```

## nodejs usage

```

   npm install d8

```

```javascript

   require( 'd8/locale/en-GB.js' ); // IMPORTANT: The correct locale must ALSO be loaded before d8!!
   require( 'd8' );

```

As mentioned above d8 extends JavaScript's native `Date` & `Date.prototype`, so when requiring d8, you don't need to assign it to a variable to use d8's features.

## API

### Static methods

#### isLeapYear( year:String ):Boolean
Returns true if the passed **4 digit** year is a leap year.

#### setLeapYear( date:Date ):Void
Sets the inlcuded locale's February day count to the correct number of days, based on whether or not the date is a leap year or not.

#### toDate( date:String, format:String ):Date
Takes a date String and a format String based on the **Date formatting and parsing options** described below and returns a – hopefully – correct and valid Date.

### Static properties

#### filters
An Object of all the available filters for formatting a Date.

**Don't change this unless you know what you are doing!**

#### formats
An Object containing some default date formats:
<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td width="96">ISO_8601</td><td>Y-m-d<T>H:i:sP</td>
	<tr><td width="96">ISO_8601_SHORT</td><td>Y-m-d</td>
	<tr><td width="96">RFC_850</td><td>l, d-M-y H:i:s T</td>
	<tr><td width="96">RFC_2822</td><td>D, d M Y H:i:s O</td>
	<tr><td width="96">sortable</td><td>Y-m-d H:i:sO</td>
</table>

### Instance methods

#### GMTOffset( colon:Boolean ):String
Returns the Date instances offset from GMT.

#### ISODay():Number
Returns the ISO day of the week.

#### ISODaysInYear():Number
Returns the ISO number of days in the year.

#### ISOFirstMondayOfYear():Date
Returns the ISO first Monday of the year.

#### ISOWeek():Number
Returns the ISO week of the year

#### ISOWeeksInYear():Number
Returns the number of weeks in the ISO year.

#### adjust( interval:Object|String, value:Number ):Date
Adjusts the Date based on the passed interval, by the passed numeric value.

**Note:** The method also accepts a single Object param where each key is the interval and each value is the number to adjust the Date by.

**Valid intervals are:** year, month, day, hr, min, sec, ms.

#### between( date_lower:Date, date_higher:Date ):Boolean
Checks to see if the Date instance is in between the two passed Dates.

#### clearTime():Date
Clears the time from the Date instance.

#### clone():Date
Returns a clone of the current Date.

#### dayOfYear():Number
Returns the zero based day of the year.

#### firstOfTheMonth():Date
Returns a Date instance of the first day of this Date instance's month.

#### format( format:String ):String
Returns a string representation of the Date instance, based on the passed format. See the **Date formatting and parsing options** below.

#### isDST():Boolean
Returns true if the Date instance is within daylight savings time.

#### isLeapYear():Boolean
Returns true if the Date instance is a leap year.

#### lastOfTheMonth():Date
Returns a Date instance of the last day of this Date instance's month.

#### timezone():String
Returns the JavaScript engine's Date.prototype.toString() timezone abbreviation.

## Date formatting and parsing options

### day
<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td width="32">d</td><td>Day of the month, 2 digits with leading zeros</td>
	<tr><td width="32">D</td><td>A textual representation of a day, three letters</td>
	<tr><td width="32">j</td><td>Day of the month without leading zeros</td>
	<tr><td width="32">l</td><td>A full textual representation of the day of the week</td>
	<tr><td width="32">N</td><td>ISO-8601 numeric representation of the day of the week</td>
	<tr><td width="32">S</td><td>English ordinal suffix for the day of the month, 2 characters</td>
	<tr><td width="32">w</td><td>Numeric representation of the day of the week</td>
	<tr><td width="32">z</td><td>The day of the year (starting from 0)</td>
</table>
### week
<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td width="32">W</td><td>ISO-8601 week number of year, weeks starting on Monday</td>
</table>
### month
<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td width="32">F</td><td>A full textual representation of a month</td>
	<tr><td width="32">m</td><td>Numeric representation of a month, with leading zeros</td>
	<tr><td width="32">M</td><td>A short textual representation of a month, three letters</td>
	<tr><td width="32">n</td><td>Numeric representation of a month, without leading zeros</td>
	<tr><td width="32">t</td><td>Number of days in the given month</td>
</table>
### year
<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td width="32">L</td><td>Whether it's a leap year</td>
	<tr><td width="32">o</td><td>ISO-8601 year number. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead.</td>
	<tr><td width="32">Y</td><td>A full numeric representation of a year, 4 digits</td>
	<tr><td width="32">y</td><td>A two digit representation of a year</td>
</table>
### time
<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td width="32">a</td><td>Lowercase Ante meridiem and Post meridiem</td>
	<tr><td width="32">A</td><td>Uppercase Ante meridiem and Post meridiem</td>
	<tr><td width="32">g</td><td>12-hour format of an hour without leading zeros</td>
	<tr><td width="32">G</td><td>24-hour format of an hour without leading zeros</td>
	<tr><td width="32">h</td><td>12-hour format of an hour with leading zeros</td>
	<tr><td width="32">H</td><td>24-hour format of an hour with leading zeros</td>
	<tr><td width="32">i</td><td>Minutes with leading zeros</td>
	<tr><td width="32">s</td><td>Seconds, with leading zeros</td>
	<tr><td width="32">u</td><td>Milliseconds</td>
</table>
### timezone
<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td width="32">O</td><td>Difference to Greenwich time (GMT) in hours</td>
	<tr><td width="32">P</td><td>Difference to Greenwich time (GMT) with colon between hours and minutes</td>
	<tr><td width="32">T</td><td>Timezone abbreviation</td>
	<tr><td width="32">Z</td><td>Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive.</td>
</table>
### full date/time
<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td width="32">c</td><td>ISO 8601 date</td>
	<tr><td width="32">r</td><td>RFC 2822 formatted date</td>
	<tr><td width="32">U</td><td>Seconds since the Unix Epoch January 1 1970 00:00:00 GMT</td>
</table>
