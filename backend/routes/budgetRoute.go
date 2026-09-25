package routes

import (
	"khal-fintrack/controllers"
	"khal-fintrack/middleware"

	"github.com/gin-gonic/gin"
)

func BudgetRoute(router *gin.Engine) {
	router.POST("/budgets", middleware.RequireAuth, controllers.CreateBudget)
	router.GET("/budgets", middleware.RequireAuth, controllers.GetBudgets)
	router.GET("/budgets/:id", middleware.RequireAuth, controllers.GetBudget)
	router.PATCH("/budgets/:id", middleware.RequireAuth, controllers.UpdateBudget)
	router.DELETE("/budgets/:id", middleware.RequireAuth, controllers.DeleteBudget)
}
