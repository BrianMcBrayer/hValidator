hValidator
============

An Angular form validator for folks who have to use non-Angular forms. Initially designed to work with standard HTML5 forms and Telerik's Kendo UI.

<h2>Features</h2>

<ul>
    <li>Validates standard HTML5 form elements in an intuitive way</li>
    <li>Live binding to input, textarea, and select controls</li>
    <li>Intuitive error reporting for invalid controls</li>
    <li>Validate all controls in a loop or individual controls by themselves</li>    
</ul>

<h2>Todo</h2>

So this project is still pretty new. It's almost full-featured on the HTML5 side. The kendo side will be my next major area of emphasis. See the status below.

- [ ] Live binding to all form controls
 - [x] input
 - [x] textarea
 - [x] select
 - [x] no-validate on forms
 - [ ] kendo ui controls
- [x] Custom rules that are to be applied
 - [x] Default rules that can be overridden
 - [x] required
 - [ ] min
 - [ ] max
- [x] Rules that validate a control will form an invalid message doing some/all of the following:
 - [x] Applying/removing a class to the element
 - [x] Showing/hiding an error message
 - [x] Showing/hiding an error message with an id
  - [ ] Showing/hiding an error message in a custom place
 - [x] Compiling a list of validation errors
 - [x] Linking validation errors to the controls that threw them
 - [x] Linking validation errors to related controls
- [x] Intuitive cleanup of events on controls
- [x] Intuitive wireup of events on controls
 - [x] Validate automatically on blur, change, and/or validate manually

<h2>But Kendo UI already has a validator!</h2>

I know, and it is a good one. However, it is lacking a lot of Angular niceties such as live updating when form controls are created or destroyed. I will add a table comparing the two in upcoming days.
