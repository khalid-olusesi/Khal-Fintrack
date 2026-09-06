package controllers

import (
	"fmt"
	"khal-fintrack/initializers"
	"khal-fintrack/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateTransaction(c *gin.Context) {
	var body struct {
		Type        string    `json:"type"`
		Category    string    `json:"category"`
		Amount      float64   `json:"amount"`
		Description string    `json:"description"`
		Date        time.Time `json:"date"`
	}

	if c.ShouldBindJSON(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to request the body",
		})
		return
	}

	user, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "user not found",
		})
		return
	}

	currentUser := user.(*models.User)

	transaction := models.Transaction{
		UserID:      currentUser.ID,
		Type:        body.Type,
		Category:    body.Category,
		Amount:      body.Amount,
		Description: body.Description,
		Date:        body.Date,
	} //next is to save the contents sent by the user in transaction

	if body.Amount <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "amount is invalid",
		})
		return
	}

	if body.Type != "income" && body.Type != "expense" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "type error",
		})

		return
	}

	if body.Category == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "categories cant be found",
		})
		return
	}

	result := initializers.DB.Create(&transaction) //saves the the content the user typed and sent in the database

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": result.Error.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":     "transaction created successfully",
		"transaction": transaction,
	})

}

func GetTransactions(c *gin.Context) {

	user, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "user unauthorized",
		})

		return
	}

	currentUser := user.(*models.User)

	fmt.Println("USER ID:", currentUser.ID)
	fmt.Println("USER EMAIL:", currentUser.Email)

	var transactions []models.Transaction //created a slice of transaction model to be used to get preexisting content, the slice there is like the bucket where where result := initializers.DB.Find(&transactions) saves its content

	result := initializers.DB.
		Where("user_id = ?", currentUser.ID).
		Find(&transactions)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to get transaction",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"transactions": transactions,
	})
} //what this does is ask the backend for the data saved in it so it can be used on the frontend to display there on the dashboard

func GetTransaction(c *gin.Context) {
	id := c.Param("id") // gets the ID from /transactions/:id

	user, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "user unauthorized",
		})
		return
	}

	currentUser := user.(*models.User)

	var transaction models.Transaction

	result := initializers.DB.
		Where("id = ? AND user_id = ?", id, currentUser.ID).
		First(&transaction)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "transaction not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"transaction": transaction,
	})
}

func UpdateTransaction(c *gin.Context) {
	var body struct {
		Type        string    `json:"type"`
		Category    string    `json:"category"`
		Amount      float64   `json:"amount"`
		Description string    `json:"description"`
		Date        time.Time `json:"date"`
	}

	id := c.Param("id") //to get the id for what i want to edit

	user, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "user unauthorized",
		})
		return
	}

	currentUser := user.(*models.User)

	var transaction models.Transaction //saves the transaction in a variable

	result := initializers.DB.Where("id = ? AND user_id = ?", id, currentUser.ID).First(&transaction)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "result not found",
		})
		return
	}

	err := c.ShouldBindJSON(&body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	if body.Amount <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "amount is invalid",
		})
		return
	}

	if body.Type != "income" && body.Type != "expense" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "type error",
		})

		return
	}

	if body.Category == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "categories cant be found",
		})
		return
	}

	transaction.Type = body.Type
	transaction.Category = body.Category
	transaction.Amount = body.Amount
	transaction.Description = body.Description
	transaction.Date = body.Date

	result = initializers.DB.Save(&transaction)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "couldnt save transaction",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":     "transaction updated successfully",
		"transaction": transaction,
	})
} //to edit

func DeleteTransaction(c *gin.Context) {
	id := c.Param("id") //getting the id to be deleted

	user, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "user unauthorized",
		})
		return
	}

	currentUser := user.(*models.User)

	var transaction models.Transaction //to get the transaction

	result := initializers.DB.Where("id = ? AND user_id = ?", id, currentUser.ID).First(&transaction)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "transaction not found",
		})
		return
	}

	result = initializers.DB.Delete(&transaction)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": result.Error.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "transaction deleted successfully",
	})
}
