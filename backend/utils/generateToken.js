import jwt from 'jsonwebtoken'

const generateToken = (res, userId) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  )

  res.cookie('user_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    // 30 days in milliseconds
    maxAge: 2592000000
  })
}

export default generateToken