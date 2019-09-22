# apophany

a pattern matcher that matches sequences of things in a filtered list

## What is it?

Apophany is a pattern matcher that uses an optionally filtered list, and a sequence of matching functions to match a pattern in a list of things.

Suppose you have a list like this:

```js
[1, 2, 'three', 'four', 5, 6]
```

And you wanted to match the pattern of a number followed by a string, you could write two functions like this and put them in a list:

```
[
  item => typeof item === 'number',
  item => typeof item === 'string'
]
```

In this case, the pattern would match `2, 'three'`, and the object returned by the function would include information about these items in the array

> **What does ‘apophany’ mean?**
>
> An apophany is the name given to the moment when you recognize a pattern in something that isn't really there. It's the opposite of an epiphany, which is the name given to the moment when you finally recognize a pattern that has been there the whole time.

## Usage

```js
apophany(list, patterns, filter)
```

- `list` is an array of items to be matched
- `patterns` is an array containing functions to test each sequential token in the pattern
- `filter` is an optional function to be used with `Array.filter()` of the list

## Examples

