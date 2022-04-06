const conf = {
  secretKey : process.env.SECRET,
  option : {
      algorithm : "HS256",
      expiresIn : "24h",
      issuer : "bayarena"
  }
}

export default conf;