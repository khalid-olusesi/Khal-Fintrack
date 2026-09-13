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
		CategoryID  uint      `json:"categoryId"`
		Amount      float64   `json:"amount"`
		Description string    `json:"description"`
		Date        time.Time `json:"date"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		fmt.Println("BIND ERROR:", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to request the body: " + err.Error(),
		})
		return
	}

	fmt.Println("PARSED BODY - Type:", body.Type, "CategoryID:", body.CategoryID, "Amount:", body.Amount, "Description:", body.Description, "Date:", body.Date)

	user, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "user not found",
		})
		return
	}

	currentUser := user.(*models.User)

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

	if body.CategoryID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "categories cant be found",
		})
		return
	}

	transaction := models.Transaction{
		UserID:      currentUser.ID,
		Type:        body.Type,
		CategoryID:  body.CategoryID,
		Amount:      body.Amount,
		Description: body.Description,
		Date:        body.Date,
	} //next is to save the contents sent by the user in transaction

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

	page := 1
	limit := 10

	if pageStr := c.Query("page"); pageStr != "" {
		if _, err := fmt.Sscanf(pageStr, "%d", &page); err != nil || page < 1 {
			page = 1
		}
	}

	if limitStr := c.Query("limit"); limitStr != "" {
		if _, err := fmt.Sscanf(limitStr, "%d", &limit); err != nil || limit < 1 {
			limit = 10
		}
	}

	offset := (page - 1) * limit

	// Build a shared base query so COUNT and FIND always use the same filters
	categoryID := c.Query("categoryId")
	baseQuery := initializers.DB.Model(&models.Transaction{}).Where("user_id = ?", currentUser.ID)
	if categoryID != "" {
		baseQuery = baseQuery.Where("category_id = ?", categoryID)
	}

	var total int64
	if err := baseQuery.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to count transactions",
		})
		return
	}

	var transactions []models.Transaction

	fetchQuery := initializers.DB.
		Preload("Category").
		Where("user_id = ?", currentUser.ID).
		Order("date DESC").
		Limit(limit).
		Offset(offset)

	if categoryID != "" {
		fetchQuery = fetchQuery.Where("category_id = ?", categoryID)
	}

	if err := fetchQuery.Find(&transactions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to get transactions",
		})
		return
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))

	c.JSON(http.StatusOK, gin.H{
		"transactions": transactions,
		"pagination": gin.H{
			"page":       page,
			"limit":      limit,
			"total":      total,
			"totalPages": totalPages,
		},
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
		Preload("Category").
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
		CategoryID  uint      `json:"categoryId"`
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

	if body.CategoryID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "categories cant be found",
		})
		return
	}

	transaction.Type = body.Type
	transaction.CategoryID = body.CategoryID
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
