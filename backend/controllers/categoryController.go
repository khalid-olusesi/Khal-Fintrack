package controllers

import (
	"khal-fintrack/initializers"
	"khal-fintrack/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateCategory(c *gin.Context) {
	var body struct {
		Name  string `json:"name"`
		Type  string `json:"type"`
		Icon  string `json:"icon"`
		Color string `json:"color"`
	}

	err := c.ShouldBindJSON(&body)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to request the body",
		})
		return
	}

	user, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "user not found",
		})
		return
	}

	currentUser := user.(*models.User)

	if body.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "input category name",
		})
		return
	}

	if body.Type != "income" && body.Type != "expense" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "type error",
		})
		return
	}

	category := models.Category{
		UserID: currentUser.ID,
		Name:   body.Name,
		Type:   body.Type,
		Icon:   body.Icon,
		Color:  body.Color,
	} //Build category from the authenticated user's input

	result := initializers.DB.Create(&category)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create category",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "category created sucessfully",
		"category": category,
	})
}

func GetCategories(c *gin.Context) {
	user, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "user unauthorized",
		})
		return
	}

	currentUser := user.(*models.User)

	var categories []models.Category

	result := initializers.DB.Where("user_id = ?", currentUser.ID).Find(&categories)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to find the category",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "categories found successfully",
		"categories": categories,
	})
}

func GetCategory(c *gin.Context) {
	id := c.Param("id")

	user, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "user not found",
		})
		return
	}

	currentUser := user.(*models.User)

	var category models.Category

	results := initializers.DB.Where("id = ? AND user_id = ?", id, currentUser.ID).First(&category)

	if results.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get the category",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "category fetched successfully",
		"category": category,
	})
}

func UpdateCategory(c *gin.Context) {
	var body struct {
		Name  string `json:"name"`
		Type  string `json:"type"`
		Icon  string `json:"icon"`
		Color string `json:"color"`
	}

	id := c.Param("id")

	user, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "user not found",
		})
		return
	}

	currentUser := user.(*models.User)

	var category models.Category

	results := initializers.DB.Where("id = ? AND user_id = ?", id, currentUser.ID).First(&category)

	if results.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to update category",
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

	if body.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "input category name",
		})
		return
	}

	if body.Type != "income" && body.Type != "expense" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "type error",
		})
		return
	}

	category.Name = body.Name
	category.Type = body.Type
	category.Icon = body.Icon
	category.Color = body.Color

	results = initializers.DB.Save(&category)

	if results.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to update category",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message":  "category updated successfully",
		"category": category,
	})
}

func DeleteCategory(c *gin.Context) {
	id := c.Param("id")

	user, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "uer is unauthorized",
		})
		return
	}

	currentUser := user.(*models.User)
	var category models.Category

	result := initializers.DB.Where("id = ? AND user_id = ?", id, currentUser.ID).First(&category)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "category not found",
		})
		return
	}

	result = initializers.DB.Delete(&category)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to delete category",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "category deleted successfully",
	})

}
