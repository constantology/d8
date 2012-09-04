<!-- [![build status](https://secure.travis-ci.org/constantology/d8.png)](http://travis-ci.org/constantology/d8) -->
# d8.js

d8 is a date parsing and formatting micro-framework for modern JavaScript engines.

d8 formats Dates into Strings and conversley turns Strings into Dates based on [php formatting options](http://php.net/manual/en/function.date.php).

As d8 extends JavaScript's native `Date` & `Date.prototype` – the CORRECT way – there is no actual global called d8. Instead all static and instance methods are available on the native `Date` & `Date.prototype` respectively.

currently the only locales available are:

- en-GB (0.6kb deflated)
- en-US (0.6kb deflated)

but feel free to create a locale for your specific nationality and submit a pull request! :D

## Dependencies

d8.js only has one dependency [m8.js](/constantology/m8).

**NOTE:**
If you are using d8 within a commonjs module, you don't need to require m8 before requiring d8 as this is done internally.

Also, since d8.js simply extends the Native Date Class, a reference to **m8 IS NOT** stored.

## browser usage

```html

   <script src="/path/to/m8/m8.js" type="text/javascript"></script>

<!-- IMPORTANT: The correct locale must be loaded before d8! -->
   <script src="/path/to/d8/locale/en-GB.js" type="text/javascript"></script>
   <script src="/path/to/d8/d8.min.js" type="text/javascript"></script>

```

## nodejs usage

```javascript

   require( 'd8/locale/en-GB' ); // IMPORTANT: The correct locale must be loaded before d8!!
   require( 'd8' );

// if running in a sandboxed environment remember to:
   require( 'm8' ).x( Date ); // and/ or any other Types that require extending.

```

As mentioned above d8 extends JavaScript's native `Date` & `Date.prototype`, so when requiring d8, you don't need to assign it to a variable to use d8's features.

## Support

Tested to work with nodejs, FF4+, Safari 5+, Chrome 7+, IE9+. Should technically work in any browser that supports [ecma 5]( http://kangax.github.com/es5-compat-table/) without throwing any JavaScript errors.

## API

### Static methods

#### isLeapYear( year:String ):Boolean
Returns true if the passed **4 digit** year is a leap year.

**NOTE:** This method is located in the locale file. If your calendar system does not contain leap years, you can simply change the method to only `return false`.

#### getOrdinal( date:Number ):String
Returns the ordinal for a given date.

##### Example:

```javascript

   Date.getOrdinal( 1 );  // returns => "st"
   Date.getOrdinal( 10 ); // returns => "th"
   Date.getOrdinal( 22 ); // returns => "nd"
   Date.getOrdinal( 33 ); // returns => "rd"

```

**NOTE:** Ordinals and the `getOrdinal` This method is located in the locale file. You can simply change the `ordinal` Array to your specific language; overwrite the `getOrdinal` method or both.

#### setLeapYear( date:Date ):Void
Sets the inlcuded locale's February day count to the correct number of days, based on whether or not the date is a leap year or not.

**NOTE:** This method is located in the locale file. If your calendar system does not contain leap years, you can simply change the method to do nothing.

#### toDate( date:String, format:String ):Date
Takes a date String and a format String based on the **Date formatting and parsing options** described below and returns a – hopefully – correct and valid Date.

```javascript

   Date.toDate( 'Sunday, the 1st of January 2012', 'l, <the> jS <of> F Y' ); // returns => Date { Sun Jan 01 2012 00:00:00 GMT+0000 (GMT) }
   Date.toDate( '2012-01-01T00:00:00+00:00',        Date.formats.ISO_8601 ); // returns => Date { Sun Jan 01 2012 00:00:00 GMT+0000 (GMT) }

```

### Static properties

#### filters
An Object of all the available filters for formatting a Date.

**IMPORTANT: Don't change these unless you know what you are doing!**

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

#### adjust( interval:Object|String[, value:Number] ):Date
Your one stop shop for all Date arithmetic. Adjusts the Date based on the passed `interval`, by the passed numeric `value`.

**Note:** The method also accepts a single Object param where each key is the interval and each value is the number to adjust the Date by.

**Valid intervals are:** year, month, week, day, hr, min, sec, ms.

##### Example:

```javascript

   var date = new Date( 2012, 0, 1 ); // Date {Sun Jan 01 2012 00:00:00 GMT+0000 (GMT)}

   date.adjust( Date.DAY,   1 );      // Date {Mon Jan 02 2012 00:00:00 GMT+0000 (GMT)}
   date.adjust( Date.HOUR, -1 );      // Date {Sun Jan 01 2012 23:00:00 GMT+0000 (GMT)}
   date.adjust( {
      year : -1, month : -1, day : 24,
      hr   :  1, sec   : -1
   } );                               // Date {Sat Dec 25 2010 23:59:59 GMT+0000 (GMT)}

```

#### between( date_lower:Date, date_higher:Date ):Boolean
Checks to see if the Date instance is in between the two passed Dates.

#### clearTime():Date
Clears the time from the Date instance.

#### clone():Date
Returns a clone of the current Date.

#### format( format:String ):String
Returns a string representation of the Date instance, based on the passed format. See the **Date formatting and parsing options** below.

You can use predefined formats found in `Date.formats`. **Hint:** You can do:

```javascript

   console.dir( Date.formats );

```

within your browser's JavaScript console to see a list of available formats.

Previously used formats are also cached to save the overhead of having to create a `new Function` everytime you want to format a date.

#### getDayOfYear():Number
Returns the zero based day of the year.

#### getFirstOfTheMonth():Date
Returns a Date instance of the first day of this Date instance's month.

#### getGMTOffset( [colon:Boolean] ):String
Returns the Date instances offset from GMT.

#### getISODay():Number
Returns the ISO day of the week.

#### getISODaysInYear():Number
Returns the ISO number of days in the year.

#### getISOFirstMondayOfYear():Date
Returns the ISO first Monday of the year.

#### getISOWeek():Number
Returns the ISO week of the year

#### getISOWeeksInYear():Number
Returns the number of weeks in the ISO year.

#### getLastOfTheMonth():Date
Returns a Date instance of the last day of this Date instance's month.

#### getWeek():Number
Returns the week of the year, based on the `dayOfYear` divided by 7.

##### Example:

```javascript

   ( new Date( 2012, 0, 1 ) ).getWeek();   // returns => 0
   ( new Date( 2012, 2, 13 ) ).getWeek();  // returns => 10
   ( new Date( 2012, 11, 31 ) ).getWeek(); // returns => 52

```

#### isDST():Boolean
Returns true if the Date instance is within daylight savings time.

#### isLeapYear():Boolean
Returns true if the Date instance is a leap year.

#### setWeek():Number(UnixTimeStamp)
Sets the week of the year from the 1st January.

##### Example:

```javascript

   new Date( ( new Date( 2012, 0, 1 ) ).setWeek( 17 ) ); // returns => Date {Sun Apr 29 2012 00:00:00 GMT+0100 (BST)}
   ( new Date( 2012, 2, 13 ) ).setWeek( 17 );            // returns => 1335654000000 same as above
   ( new Date( 2012, 11, 31 ) ).setWeek( 17 );           // returns => 1335654000000

```

#### timezone():String
Returns the JavaScript engine's Date.prototype.toString() timezone abbreviation.

## Date formatting and parsing options

### escaping characters

If you want to escape characters that are used by the Date parser you can wrap them between &lt;&gt;.

#### Example:

```javascript

   ( new Date( 2012, 0, 1 ) ).format( 'l, <the> jS <of> F Y' ); // returns => "Sunday, the 1st of January 2012"

```

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

## License

(The MIT License)

Copyright &copy; 2012 christos "constantology" constandinou http://muigui.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
