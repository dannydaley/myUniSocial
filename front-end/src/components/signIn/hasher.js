
    
    // number of iterations to jumble the hash
    const iterations = 1000;

    //set up char length of hash
    const hashSize = 64;
    
    // which hashing algorithm will be used
    const hashAlgorithm = 'sha256';
    
    // create a hash salt/pepper
    const generatePepper = crypto.randomBytes(256).toString('hex');    
    
    //this function returns a hash of the password, combined with the pepper and the salt.
    export default function passwordHash(thePassword, theSalt) {  
      const pepper = process.env.PEPPER;
       return crypto.pbkdf2Sync(thePassword, pepper + theSalt, iterations, hashSize, hashAlgorithm).toString('hex');
    }
    