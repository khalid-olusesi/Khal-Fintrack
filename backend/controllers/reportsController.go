package controllers

import (
	"fmt"
	"khal-fintrack/initializers"
	"khal-fintrack/models"
	"net/http"
	"sort"
	"time"

	"github.com/gin-gonic/gin"
)

func GetReports(c *gin.Context) {
	user, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "user not authorized",
		})
		return
	}

	currentUser := user.(*models.User)
	date := c.Query("date")

	if date == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "date filter is required",
		})
		return
	}

	startDate, endDate, err := getDateRange(date)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	var transactions []models.Transaction

	results := initializers.DB.
		Preload("Category").
		Where("user_id = ?", currentUser.ID).
		Where("type = ?", "expense").
		Where("date >= ? AND date < ?", startDate, endDate).
		Find(&transactions)

	if results.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch transactions",
		})
		return
	}

	categoryTotals := make(map[uint]float64)
	categoryInfo := make(map[uint]*models.Category)
	chartTotals := make(map[string]float64)

	var totalExpenses float64
	var uncategorizedExpenses float64

	for _, transaction := range transactions {
		totalExpenses += transaction.Amount

		var label string

		switch date {
		case "Today":
			label = "Today"

		case "This Week":
			label = transaction.Date.Weekday().String()[:3]

		case "This Month", "Last Month":
			day := transaction.Date.Day()
			week := ((day - 1) / 7) + 1
			label = fmt.Sprintf("Week %d", week)

		case "Last 3 Months":
			label = transaction.Date.Format("Jan")

		case "This Year":
			label = transaction.Date.Format("Jan")
		}

		chartTotals[label] += transaction.Amount

		if transaction.CategoryID == nil || transaction.Category == nil {
			uncategorizedExpenses += transaction.Amount
			continue
		}

		categoryID := *transaction.CategoryID

		categoryTotals[categoryID] += transaction.Amount
		categoryInfo[categoryID] = transaction.Category
	}

	topCategories := []gin.H{}

	if totalExpenses > 0 {
		for categoryID, spent := range categoryTotals {
			category := categoryInfo[categoryID]

			percentage := (spent / totalExpenses) * 100

			topCategories = append(topCategories, gin.H{
				"id":         category.ID,
				"name":       category.Name,
				"icon":       category.Icon,
				"color":      category.Color,
				"spent":      spent,
				"percentage": percentage,
			})
		}
	}

	sort.Slice(topCategories, func(i, j int) bool {
		return topCategories[i]["spent"].(float64) > topCategories[j]["spent"].(float64)
	})

	// Keep only top 5, group the rest into "Others"
	// Also include uncategorized expenses in "Others"
	if len(topCategories) > 5 {
		var othersSpent float64
		var othersPercentage float64
		for _, cat := range topCategories[5:] {
			othersSpent += cat["spent"].(float64)
			othersPercentage += cat["percentage"].(float64)
		}
		othersSpent += uncategorizedExpenses
		if totalExpenses > 0 {
			othersPercentage += (uncategorizedExpenses / totalExpenses) * 100
		}
		topCategories = topCategories[:5]
		topCategories = append(topCategories, gin.H{
			"id":         0,
			"name":       "Others",
			"icon":       "📦",
			"color":      "#9CA3AF",
			"spent":      othersSpent,
			"percentage": othersPercentage,
		})
	} else if uncategorizedExpenses > 0 && totalExpenses > 0 {
		// Even with <= 5 categories, add Others if there are uncategorized expenses
		topCategories = append(topCategories, gin.H{
			"id":         0,
			"name":       "Others",
			"icon":       "📦",
			"color":      "#9CA3AF",
			"spent":      uncategorizedExpenses,
			"percentage": (uncategorizedExpenses / totalExpenses) * 100,
		})
	}

	expenseOverview := []gin.H{}

	var labels []string

	switch date {
	case "Today":
		labels = []string{"Today"}

	case "This Week":
		labels = []string{
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun",
		}

	case "This Month", "Last Month":
		labels = []string{
			"Week 1",
			"Week 2",
			"Week 3",
			"Week 4",
			"Week 5",
		}

	case "Last 3 Months":
		for i := 0; i < 3; i++ {
			month := startDate.AddDate(0, i, 0)
			labels = append(labels, month.Format("Jan"))
		}

	case "This Year":
		for month := time.January; month <= time.December; month++ {
			labels = append(labels, month.String()[:3])
		}
	}

	for _, label := range labels {
		expenseOverview = append(expenseOverview, gin.H{
			"week":  label,
			"total": chartTotals[label],
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"top_categories":   topCategories,
		"expense_overview": expenseOverview,
		"total_expenses":   totalExpenses,
	})
}

func getDateRange(filter string) (time.Time, time.Time, error) {
	loc, err := time.LoadLocation("Africa/Lagos")

	if err != nil {
		return time.Time{}, time.Time{}, fmt.Errorf("failed to load timezone: %w", err)
	}

	now := time.Now().In(loc)

	var startDate time.Time
	var endDate time.Time

	switch filter {
	case "Today":
		startDate = time.Date(
			now.Year(),
			now.Month(),
			now.Day(),
			0, 0, 0, 0,
			loc,
		)
		endDate = startDate.AddDate(0, 0, 1)

	case "This Week":
		startDate = time.Date(
			now.Year(),
			now.Month(),
			now.Day(),
			0, 0, 0, 0,
			loc,
		)

		daysFromMonday := (int(now.Weekday()) + 6) % 7

		startDate = startDate.AddDate(0, 0, -daysFromMonday)
		endDate = startDate.AddDate(0, 0, 7)

	case "This Month":
		startDate = time.Date(
			now.Year(),
			now.Month(),
			1,
			0, 0, 0, 0,
			loc,
		)
		endDate = startDate.AddDate(0, 1, 0)

	case "Last Month":
		startDate = time.Date(
			now.Year(),
			now.Month(),
			1,
			0, 0, 0, 0,
			loc,
		).AddDate(0, -1, 0)

		endDate = startDate.AddDate(0, 1, 0)

	case "Last 3 Months":
		startDate = time.Date(
			now.Year(),
			now.Month(),
			1,
			0, 0, 0, 0,
			loc,
		).AddDate(0, -2, 0)

		endDate = time.Date(
			now.Year(),
			now.Month(),
			1,
			0, 0, 0, 0,
			loc,
		).AddDate(0, 1, 0)

	case "This Year":
		startDate = time.Date(
			now.Year(),
			time.January,
			1,
			0, 0, 0, 0,
			loc,
		)

		endDate = startDate.AddDate(1, 0, 0)

	default:
		return time.Time{}, time.Time{}, fmt.Errorf("invalid date filter")
	}

	return startDate, endDate, nil
}
