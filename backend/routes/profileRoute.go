package routes

import (
	"khal-fintrack/controllers"
	"khal-fintrack/middleware"

	"github.com/gin-gonic/gin"
)

func ProfileRoute(router *gin.Engine) {
	router.GET("/profile", middleware.RequireAuth, controllers.GetProfile)
	router.PATCH("/profile", middleware.RequireAuth, controllers.UpdateProfile)
	router.PATCH("/profile/password", middleware.RequireAuth, controllers.ChangePassword)
	router.PATCH("/profile/avatar", middleware.RequireAuth, controllers.UpdateAvatar)
	router.DELETE("/profile/avatar", middleware.RequireAuth, controllers.DeleteAvatar)
	router.DELETE("/profile/account", middleware.RequireAuth, controllers.DeleteAccount)
}
