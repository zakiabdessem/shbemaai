function cookieConfig() {
  return {
    httpOnly: true,
    sameSite: 'Strict',
    secure: process.env.NODE_ENV === 'production',
    domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_URL : 'localhost',
  };
}

export default cookieConfig;
