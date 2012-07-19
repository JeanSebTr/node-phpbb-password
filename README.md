node-phpbb-password
===================

phpbb's password hashing algorithm for Nodejs

## Installation
``` sh
npm install phpbb-password
```

## Usage
``` javascript

var phpbb = require('phpbb-password');

// hash a password
var hash = phpbb.hash('bonjour, mot de passe');
console.log(hash); // examples : $H$9sPKRpbzFtCY8ZGFvmPQU7qAaZlQ1E. $H$9940UI0zss3hbAt6bytgCIAthYapG20

// verify 
var ok = phpbb.check_hash('bonjour, mot de passe', hash);
console.log(ok); // true
```

## TODO

 * Tests !
 * Async ?

## License

[GNU General Public License v2](https://github.com/phpbb/phpbb3#license)

Since the original PHP code come from PHPbb itself, I think this code must also be under the GPLv2.
If you think we can use BSD or something else, let me know !
