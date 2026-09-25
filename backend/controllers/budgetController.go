package controllers

import (
	"khal-fintrack/initializers"
	"khal-fintrack/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateBudget(c *gin.Context) {
	var body struct {
		CategoryID uint    `json:"category_id"`
		Budgeted   float64 `json:"budgeted"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request body",
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

	if body.Budgeted <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Budgeted amount must be greater than 0",
		})
		return
	}

	if body.CategoryID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Category is required",
		})
		return
	}

	var category models.Category

	results := initializers.DB.Where("id = ? AND user_id = ?", body.CategoryID, currentUser.ID).First(&category)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "category not found",
		})
		return
	}

	budget := models.Budget{
		UserID:     currentUser.ID,
		Budgeted:   body.Budgeted,
		CategoryID: body.CategoryID,
		Spent:      0,
	}

	results = initializers.DB.Create(&budget)

	if results.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to save in the database",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "budget created successfully",
		"budget":  budget,
	})
}

func GetBudgets(c *gin.Context) {
	user, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "user is unauthorized",
		})
		return
	}

	currentUser := user.(*models.User)

	var budgets []models.Budget

	results := initializers.DB.Preload("Category").Where("user_id = ?", currentUser.ID).Find(&budgets)

	if results.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to find the budget",
		})
		return
	}

	for i := range budgets {
		var spent float64

		results = initializers.DB.Model(&models.Transaction{}).Where("user_id = ?", currentUser.ID).Where("category_id = ?", budgets[i].CategoryID).Where("type = ?", "expense").Select("COALESCE(SUM(amount), 0)").Scan(&spent)

		if results.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to calculate budgets",
			})
			return
		}

		budgets[i].Spent = spent
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "budgets found successfully",
		"budgets": budgets,
	})
}

func GetBudget(c *gin.Context) {

	id := c.Param("id")

	user, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "user unauthorized",
		})
		return
	}

	currentUser := user.(*models.User)

	var budget models.Budget

	results := initializers.DB.Where("id = ? AND user_id = ? ", id, currentUser.ID).First(&budget)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "individual budget not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "inidividual budget found sucessfully",
		"budget":  budget,
	})
}

func UpdateBudget(c *gin.Context) {
	var body struct {
		CategoryID uint    `json:"category_id"`
		Budgeted   float64 `json:"budgeted"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request body",
		})
		return
	}

	if body.Budgeted <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Budgeted amount must be greater than 0",
		})
		return
	}

	if body.CategoryID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Category is required",
		})
		return
	}

	id := c.Param("id")

	user, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "user unauthorized",
		})
		return
	}

	currentUser := user.(*models.User)

	var updateBudget models.Budget

	result := initializers.DB.
		Where("id = ? AND user_id = ?", id, currentUser.ID).
		First(&updateBudget)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "budget not found",
		})
		return
	}

	var category models.Category

	results := initializers.DB.Where("id = ? AND user_id = ?", body.CategoryID, currentUser.ID).First(&category)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "category not found",
		})
		return
	}

	updateBudget.Budgeted = body.Budgeted
	updateBudget.CategoryID = body.CategoryID

	result = initializers.DB.Save(&updateBudget)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to update the budget",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "budget updated successfully",
		"budget":  updateBudget,
	})
}

func DeleteBudget(c *gin.Context) {
	id := c.Param("id")

	user, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "user unauthorized",
		})
		return
	}

	currentUser := user.(*models.User)

	var deletebudget models.Budget

	results := initializers.DB.Where("id = ? AND user_id = ?", id, currentUser.ID).First(&deletebudget)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "budget not found",
		})
		return
	}

	results = initializers.DB.Delete(&deletebudget)

	if results.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to delete budget",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "budget deleted successfully",
	})
}
