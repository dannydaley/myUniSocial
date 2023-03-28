# Import lattice
library(lattice)

# Create data
gfg <- data.frame(Score = c(4.77, 5.54, 2.62, 5.23, 4.81, 6.11, 5.38, 6, 2.88, 5.03, 2.69, 5, 5.88, 5.80), 
                  grp = rep(c("Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7"),
                            each = 2),
                  
                  subgroup = LETTERS[1:2])

# Create grouped barplot using lattice

barchart(origin=0,
         main="Platform score comparison",
         auto.key=list(
           space="top",
           columns=2,
           points=FALSE,
           rectangles=TRUE,
           title="Legend",
           cex.title=1),
         Score ~ grp, data = gfg, groups = subgroup)

