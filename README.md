This module contains an implementation of a flow page section repeater.

It overrides the basic CHART container component.

It allows attaching a list to a container and for each element in that list the child elements of the container will be repeated per list item.

The latest version can be included in your player from this location: -

```
https://files-manywho-com.s3.amazonaws.com/e1dbcceb-070c-4ce6-95b0-ba282aaf4f48/psr.js
https://files-manywho-com.s3.amazonaws.com/e1dbcceb-070c-4ce6-95b0-ba282aaf4f48/psr.css
```


## Functionality

When working on a list of values and each one needs to be presented as a repeating block of Flow Page then this module gives that functionality.

Like a table but a repeating page section, designed in the standard page designer.

Any page container defined as CHART layout will be hijacked and replaced with this new class.

The container should have an attribute named "ListName" which contains the name of a list value in Flow containing 0-many objects

The repeated child elements are simply copied, as is, and added to the page tied to the fields of the current list item.



## Component Attributes

### classes

Like all components, adding a "classes" attribute will cause that string to be added to the base container's class value.

### repeatClasses

A string containing class names to be added to each base repeating section. 

### modelField

Applied as an attribute on the base repeating container.

Tells the container where to get its list of values to repeat.

The developerName of the list.

### stateField

Tells the repeater the name of the Flow field to store the selected item into.

The developer name of an single object field of the same type as the modelField

### fieldName

Applied at the page component level.

Tells the component which attribute of the list item to present.

Just the attribute name excluding the parent object.

If the repeating list object itself contains a complex object with attributes then you can specify this with attributeName->childAttributeName adding the arrow separator "->"

## label, helpInfo & hintInfo

All of these may contain either simple text or you can include value attributes by enclosing them in double curley braces 

e.g. "Some basic text {{title_attribute_name}} {{some other attribute}}".

you can also put {{#}} to inject the current repeaters index number.

## Presentations

You can inject replacable values using the double curley braces syntax.

e.g. " Some basic text {{title_attribute_name}} {{some other attribute}} "

## Curly Brace Notation

You can also refer to child attribute values by using the "->" operator.

e.g.  {{attributeName->ChildAttributeName->>GrandChildAttibuteName}}




