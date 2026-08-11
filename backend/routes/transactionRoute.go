package routes

import (
	"khal-fintrack/controllers"
	"khal-fintrack/middleware"

	"github.com/gin-gonic/gin"
)

func TransactionRoute(router *gin.Engine) {
	router.POST("/transactions", middleware.RequireAuth, controllers.CreateTransaction)
	router.GET("/transactions", middleware.RequireAuth, controllers.GetTransactions)
	router.PATCH("/transactions/:id", middleware.RequireAuth, controllers.UpdateTransaction)
	router.DELETE("/transactions/:id", middleware.RequireAuth, controllers.DeleteTransaction)
}
