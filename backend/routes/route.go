package routes

import (
	"github.com/gin-gonic/gin"
	"khal-fintrack/controllers"
	"khal-fintrack/middleware"
)

func RegisterRoutes(router *gin.Engine) {
	router.POST("/signup", controllers.Signup)
	router.POST("/login", controllers.Login)
	router.GET("/validate", middleware.RequireAuth, controllers.Validate)
}
