package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"khal-fintrack/initializers"
	"khal-fintrack/routes"
	"time"
)

func init() {
	initializers.LoadEnvVariables() //displaying the loaded env file in the main project
	initializers.ConnectToDB()
	initializers.SyncDatabase()

}

func main() {
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:3000",
		},
		AllowMethods: []string{
			"GET",
			"POST",
			"PUT",
			"PATCH",
			"DELETE",
		},
		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Accept",
			"Authorization",
		},
		AllowCredentials: true,
		MaxAge: 12 * time.Hour,
	}))
	routes.RegisterRoutes(router)
	router.Run() //to run the site

}

//This means

// "Run the CORS middleware before every request."

// Remember this.

// Middleware always runs before your controllers.
