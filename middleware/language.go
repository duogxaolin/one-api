package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/songquanpeng/one-api/common/i18n"
)

func Language() gin.HandlerFunc {
	return func(c *gin.Context) {
		lang := c.GetHeader("Accept-Language")
		if lang == "" {
			lang = "en"
		}
		langLower := strings.ToLower(lang)
		if strings.HasPrefix(langLower, "zh") {
			lang = "zh-CN"
		} else if strings.HasPrefix(langLower, "vi") {
			lang = "vi"
		} else {
			lang = "en"
		}
		c.Set(i18n.ContextKey, lang)
		c.Next()
	}
}
