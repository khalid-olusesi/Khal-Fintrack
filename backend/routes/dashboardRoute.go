package routes

import (
	"khal-fintrack/controllers"
	"khal-fintrack/middleware"

	"github.com/gin-gonic/gin"
)

func DashboardRoute(router *gin.Engine) {
	router.GET("/dashboard", middleware.RequireAuth, controllers.GetDashboard)
}