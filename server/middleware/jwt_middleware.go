package middleware

import (
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

var jwt_secret_auth = []byte("nQ4j0VgcysUJlBf8x8WngkyMeKTF4GVGf3yf46MrXaumHJY7pEuRo77e3ongtkp17lhU0U3a8YwYN4tCHjZEwokVr3qQDZrTggLk2mzHaUTMVyNxxrrFCE5i2dnftuRmLjcc6naqJzR5tuLWhaBkB5vKqeNgi9SXIO832fBvXsFYEjvAuFc4Hl49AT7D1QgtP50nKnRAH2tbkwSJHz1TRBcScQPiILgVl1V20W1jCVqIHiL2qm7flxe6ItvZQhao")

func JWTMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get the token from the Authorization header
		tokenString := c.Get("Authorization")

		// If the token is not provided, return an error
		if tokenString == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "missing token",
			})
		}

		// Parse and validate the token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Check the signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fiber.NewError(fiber.StatusUnauthorized, "invalid signing method")
			}
			return jwt_secret_auth, nil
		})

		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "invalid token",
			})
		}

		// Set user data in the context for the next handler
		claims := token.Claims.(jwt.MapClaims)
		c.Locals("username", claims["username"])

		return c.Next()
	}
}
