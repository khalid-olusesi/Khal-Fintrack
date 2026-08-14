package middleware

import (
	"khal-fintrack/initializers"
	"khal-fintrack/models"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func RequireAuth(c *gin.Context) {
	// Try cookie first, then fall back to Authorization header
	tokenString, err := c.Cookie("Authorization")

	if err != nil {
		// Try Authorization header: "Bearer <token>"
		authHeader := c.GetHeader("Authorization")
		if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
			tokenString = authHeader[7:]
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Authorization cookie or header not found",
			})
			c.Abort()
			return
		}
	}

	token, err := jwt.Parse(tokenString,
		func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		},
	) //"Read this JWT, verify its signature, and give me the claims if it's valid."

	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid or expired token",
		})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)

	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "failed to parse token claims",
		})
		return
	}

	userID := uint(claims["sub"].(float64))

	var user models.User

	results := initializers.DB.First(&user, userID)

	if results.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not found",
		})
		return
	}

	c.Set("user", &user)
	c.Next()

}

//do this to work on a gin c *gin.Context
//tokenString, err := c.Cookie("Authorization") retrieves the cookie created in the usermodel.go("Look through the cookies sent with this request and find one named Authorization.") claims, ok := token.Claims.(jwt.MapClaims) Read it in English: Take token.Claims and treat it as jwt.MapClaims.
//Read it in English:
//Get "sub" from the map.
// Treat it as a float64.
// Convert it to a uint, because your User.ID is a uint.
// When decoded, Go sees:5.0 that is why float is used for the float value
//result := initializers.DB.First(&user, userID)
// Read it in English:
// "Go to the database, find the first user whose primary key (ID) equals userID, and store that user inside the user variable."
// What does c.Next() do?
// This tells Gin: "Authentication succeeded. Continue to the next handler."
