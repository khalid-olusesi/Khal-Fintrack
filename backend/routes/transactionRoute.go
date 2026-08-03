package routes

import (
	"khal-fintrack/controllers"

	"github.com/gin-gonic/gin"
)

func TransactionRoute(router *gin.Engine) {
	router.POST("/transactions", controllers.CreateTransaction)
	router.GET("/transactions", controllers.GetTransactions)
	router.PATCH("/transactions/:id", controllers.UpdateTransaction)
	router.DELETE("/transactions/:id", controllers.DeleteTransaction)
}
