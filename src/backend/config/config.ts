export default {
  cookies: {
    code: { httpOnly: true, maxAge: 60 * 5 },
    accessToken: { httpOnly: true, maxAge: 60 * 15 },
    refreshToken: { httpOnly: true, maxAge: 60 * 60 * 24 * 365 }
  }
}
