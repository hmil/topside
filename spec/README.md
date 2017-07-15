# The topside specification

This functionnal test suite acts as a language specification
and at the same time asserts that the engine complies to it.

Any case that is not tested here is not part of the spec and
may break at any time.

## Spec structure

Look at fixtures/templates/*.top.html, those files cover the
whole scope of the specified topside syntax.
In tests/*.ts you will find usage examples for those templates.
Each test file has a reference file of the same name under
references/.
Running a template through a test yields an **exact** match
with the reference. Any change, may it be just a single whitespace
will be considered a breaking change.

Additional edge cases are generated programmatically by the
scripts in fixtures/generators.

