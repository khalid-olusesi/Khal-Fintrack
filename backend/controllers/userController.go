package controllers

import (
	"khal-fintrack/initializers"
	"khal-fintrack/models"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func Signup(c *gin.Context) {
	var body struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	} //empty container, when gin sends info from the frontend, it fills it up

	if c.ShouldBindJSON(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read request body",
		})
		return
	} //The next line Now we need to tell Gin: "Take the JSON from the request and put it inside body."

	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10) //10 is standard, thhe higherthe number lower the risk of hacking

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to hash password",
		})
		return
	}

	user := models.User{
		Name:     body.Name,
		Email:    body.Email,
		Password: string(hash),
	}

	err = initializers.DB.Transaction(func(tx *gorm.DB) error {
		result := tx.Create(&user)

		if result.Error != nil {

			return result.Error
		}

		defaultCategories := []models.Category{
			{
				UserID: user.ID,
				Name:   "Food",
				Type:   "expense",
				Icon:   "utensils",
			}, {
				UserID: user.ID,
				Name:   "Transport",
				Type:   "expense",
				Icon:   "car",
			},
			{
				UserID: user.ID,
				Name:   "Bills",
				Type:   "expense",
				Icon:   "receipt",
			}, {
				UserID: user.ID,
				Name:   "Shopping",
				Type:   "expense",
				Icon:   "shopping-cart",
			},
			{
				UserID: user.ID,
				Name:   "Healthcare",
				Type:   "expense",
				Icon:   "heart-pulse",
			},
			{
				UserID: user.ID,
				Name:   "Salary",
				Type:   "income",
				Icon:   "briefcase",
			},
			{
				UserID: user.ID,
				Name:   "Other Income",
				Type:   "income",
				Icon:   "banknote",
			},
		}

		result = tx.Create(&defaultCategories)

		if result.Error != nil {
			return result.Error
		}
		return nil
	})

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create user",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User created successfully",
	})
}

func Login(c *gin.Context) {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	//Read the JSON request and fill my struct. c.Bind(&body)
	if c.ShouldBindJSON(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	} //The next line Now we need to tell Gin: "Take the JSON from the request and put it inside body."

	var user models.User

	result := initializers.DB.First(&user, "email = ?", body.Email) //to serach through for the first to match the details

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Invalid email or password",
		})
		return
	} //check if user exists

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)) //compares the user typed password with that of the saved one in the system

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid email or password",
		})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	}) //used to add jwt tokens, sub stands for the subject(the token belongs to tis user with the id), exp(te token expires in 30 days) stands or the expiration time. //jwt.NewWithClaims(...) Creates a new JWT. jwt.SigningMethodHS256 Uses the HS256 signing algorithm. jwt.MapClaims{} Stores the data inside the token.

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create token",
		})
		return
	}

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "Authorization",
		Value:    tokenString,
		MaxAge:   3600 * 24 * 30,
		Path:     "/",
		Domain:   "",
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
	})

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token":   tokenString,
	})

}

func Validate(c *gin.Context) {
	user, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"user": user,
		})
		return
	}
}

/*token → the JWT you just created.
SignedString(...) → signs it with your secret key.
os.Getenv("JWT_SECRET") → reads the secret from your .env.
This tells the browser:
"Store this JWT as a cookie
*/
