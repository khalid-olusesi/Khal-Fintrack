package routes

import (
	"khal-fintrack/controllers"
	"khal-fintrack/middleware"

	"github.com/gin-gonic/gin"
)

func CategoryRoute(router *gin.Engine) {
	router.POST("/categories", middleware.RequireAuth, controllers.CreateCategory)
	router.GET("/categories", middleware.RequireAuth, controllers.GetCategories)
	router.GET("/categories/:id", middleware.RequireAuth, controllers.GetCategory)
	router.PATCH("/categories/:id", middleware.RequireAuth, controllers.UpdateCategory)
	router.DELETE("/categories/:id", middleware.RequireAuth, controllers.DeleteCategory)
}
