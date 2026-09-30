package controllers

import (
	"khal-fintrack/initializers"
	"khal-fintrack/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type dashboardTotals struct {
	AllIncome       float64 `gorm:"column:all_income"`
	AllExpenses     float64 `gorm:"column:all_expenses"`
	PeriodIncome    float64 `gorm:"column:period_income"`
	PeriodExpenses  float64 `gorm:"column:period_expenses"`
}

type dashboardCategoryTotal struct {
	ID         *uint   `json:"id"`
	Name       string  `json:"name"`
	Icon       string  `json:"icon"`
	Color      string  `json:"color"`
	Amount     float64 `json:"amount"`
	Percentage float64 `json:"percentage"`
}

func GetDashboard(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user unauthorized"})
		return
	}

	currentUser := user.(*models.User)
	period := c.DefaultQuery("date", "This Month")
	startDate, endDate, err := getDateRange(period)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var totals dashboardTotals
	err = initializers.DB.Model(&models.Transaction{}).
		Select(`
			COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS all_income,
			COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS all_expenses,
			COALESCE(SUM(CASE WHEN type = 'income' AND date >= ? AND date < ? THEN amount ELSE 0 END), 0) AS period_income,
			COALESCE(SUM(CASE WHEN type = 'expense' AND date >= ? AND date < ? THEN amount ELSE 0 END), 0) AS period_expenses`,
			startDate, endDate, startDate, endDate,
		).
		Where("user_id = ?", currentUser.ID).
		Scan(&totals).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to calculate dashboard totals"})
		return
	}

	var categoryTotals []dashboardCategoryTotal
	err = initializers.DB.Table("transactions AS t").
		Select(`
			t.category_id AS id,
			COALESCE(categories.name, 'Uncategorized') AS name,
			COALESCE(categories.icon, '') AS icon,
			COALESCE(categories.color, '#9CA3AF') AS color,
			SUM(t.amount) AS amount`,
		).
		Joins("LEFT JOIN categories ON categories.id = t.category_id AND categories.user_id = t.user_id").
		Where("t.user_id = ? AND t.type = ? AND t.date >= ? AND t.date < ?", currentUser.ID, "expense", startDate, endDate).
		Group("t.category_id, categories.name, categories.icon, categories.color").
		Order("amount DESC").
		Scan(&categoryTotals).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to calculate category spending"})
		return
	}
	if categoryTotals == nil {
		categoryTotals = []dashboardCategoryTotal{}
	}
	for index := range categoryTotals {
		if totals.PeriodExpenses > 0 {
			categoryTotals[index].Percentage = categoryTotals[index].Amount / totals.PeriodExpenses * 100
		}
	}

	var recentTransactions []models.Transaction
	err = initializers.DB.Preload("Category").
		Where("user_id = ?", currentUser.ID).
		Order("date DESC, id DESC").
		Limit(5).
		Find(&recentTransactions).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch recent transactions"})
		return
	}
	if recentTransactions == nil {
		recentTransactions = []models.Transaction{}
	}

	c.JSON(http.StatusOK, gin.H{
		"period":               period,
		"total_balance":        totals.AllIncome - totals.AllExpenses,
		"total_income":         totals.PeriodIncome,
		"total_expenses":       totals.PeriodExpenses,
		"spending_by_category": categoryTotals,
		"recent_transactions":  recentTransactions,
	})
}