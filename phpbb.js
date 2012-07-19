
var crypto = require('crypto');

module.exports = {
    hash: phpbb_hash,
    check_hash: phpbb_check_hash,
    unique_id: unique_id,
    _hash_gensalt_private: _hash_gensalt_private,
    _hash_encode64: _hash_encode64,
    _hash_crypt_private: _hash_crypt_private
};

var rand_seed = '';
var rand_seed_last_update = 0;

function unique_id(extra)
{
    extra = extra || 'c';
    var now = Date.now();
    var val = crypto.createHash('md5').update(rand_seed + now, 'ascii').digest('hex');

    if (rand_seed_last_update < now - (Math.floor(Math.random() * 10000) + 1000))
    {
        rand_seed = crypto.createHash('md5').update(rand_seed + val + extra, 'utf8').digest('hex');
        rand_seed_last_update = now;
    }

    return val.substr(4, 16);
}

var itoa64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function phpbb_hash(password)
{
   var random_state = unique_id();
   var random = '';
   var count = 6;

   random = crypto.randomBytes(count).toString('binary');

   var hash = _hash_crypt_private(password, _hash_gensalt_private(random));

   if (hash.length == 34)
   {
      return hash;
   }

   return crypto.createHash('md5').update(password, 'utf8').digest('hex');
}

function phpbb_check_hash(password, hash)
{
   if (hash.length == 34)
   {
      return (_hash_crypt_private(password, hash) === hash) ? true : false;
   }

   return (crypto.createHash('md5').update(password, 'utf8').digest('hex') === hash) ? true : false;
}

function _hash_gensalt_private(input, iteration_count_log2)
{
    iteration_count_log2 = iteration_count_log2 || 6;
    if (iteration_count_log2 < 4 || iteration_count_log2 > 31)
    {
        iteration_count_log2 = 8;
    }

    var output = '$H$';
    output += itoa64[Math.min(iteration_count_log2 + 5, 30)];
    output += _hash_encode64(input, 6);

    return output;
}

// OK
function _hash_encode64(input, count)
{
   var output = '';
   var i = 0;

   do
   {
      var value = input.charCodeAt(i++);
      output += itoa64[value & 0x3f];

      if (i < count)
      {
         value = value | input.charCodeAt(i) << 8;
      }

      output += itoa64[(value >> 6) & 0x3f];

      if (i++ >= count)
      {
         break;
      }

      if (i < count)
      {
         value = value | input.charCodeAt(i) << 16;
      }

      output += itoa64[(value >> 12) & 0x3f];

      if (i++ >= count)
      {
         break;
      }

      output += itoa64[(value >> 18) & 0x3f];
   }
   while (i < count);

   return output;
}


function _hash_crypt_private(password, setting)
{
    var output = '*';

    // Check for correct hash
    if (setting.substr(0, 3) != '$H$')
    {
        return output;
    }

    var count_log2 = itoa64.indexOf(setting[3]);

    if (count_log2 < 7 || count_log2 > 30)
    {
        return output;
    }

    var count = 1 << count_log2;
    var salt = setting.substr(4, 8);

    if (salt.length != 8)
    {
        return output;
    }

    var binPassword = new Buffer(password, 'utf8').toString('binary');
    var hash = crypto.createHash('md5').update(salt + password, 'utf8').digest('binary');
    do
    {
        hash = crypto.createHash('md5').update(hash + binPassword, 'binary').digest('binary');
    }
    while (--count);

    output = setting.substr(0, 12);
    output += _hash_encode64(hash, 16);

    return output;
}
