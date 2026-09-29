package routes

import (
	"khal-fintrack/controllers"
	"khal-fintrack/middleware"

	"github.com/gin-gonic/gin"
)

func reportRoute(router *gin.Engine) {
	router.GET("/reports", middleware.RequireAuth, controllers.GetReports)
}
