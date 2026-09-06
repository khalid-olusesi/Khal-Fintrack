package routes

import "github.com/gin-gonic/gin"

func AppRoute(router *gin.Engine) {
	RegisterRoutes(router)
	TransactionRoute(router)
	CategoryRoute(router)
}
