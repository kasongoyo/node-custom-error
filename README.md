# Node Custom Errors
Nodejs has native error object `Error` which is very generic and does not
offer a way to differentiate different types of errors using object 
types(prototype hierarchy). As the resut people rely on error message 
as the way to differentiate between different types of errors, something
which is verbose and does not scale well. 

This module extends Nodejs native error to create various custom error 
types based on common domain errors such as `ValidationError`, `ResourceLockedError`,
`ForbiddenError`, `ConflictError`, `NotFoundError` etc.


**Note**  
Some errors can only be generated if you're using mongoose and mongodb.

## Custom Errors
