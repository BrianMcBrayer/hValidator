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

<ul>
    <li>Live binding to all form controls
        <ul>
            <li>[x] input</li>
            <li>[x] textarea</li>
            <li>[x] select</li>
            <li>[x] no-validate on forms</li>
            <li>[] kendo ui controls</li>
        </ul>
    </li>
    <li>[x] Custom rules that are to be applied</li>
	<li>Default rules that can be overridden
	    <ul>
		    <li>[x] required</li>
		    <li>[x] min</li>
		    <li>[x] max</li>
		</ul>
	</li>
	<li>Rules that validate a control will form an invalid message doing some/all of the following:
	    <ul>
		    <li>[x] Applying/removing a class to the element</li>
		    <li>[x] Showing/hiding an error message</li>
		        <li>[x] Showing/hiding an error message with an id</li>
			    <li>[] Showing/hiding an error message in a custom place</li>
		    <li>[x] Compiling a list of validation errors</li>
		    <li>[x] Linking validation errors to the controls that threw them</li>
		    <li>[x] Linking validation errors to related controls</li>
		</ul>
	</li>
	<li>[x] Intuitive cleanup of events on controls</li>
	<li>[x] Intuitive wireup of events on controls</li>
	<li>[x] Validate automatically on blur, change, and/or validate manually</li>
</ul>

<h2>But Kendo UI already has a validator!</h2>

I know, and it is a good one. However, it is lacking a lot of Angular niceties such as live updating when form controls are created or destroyed. I will add a table comparing the two in upcoming days.
