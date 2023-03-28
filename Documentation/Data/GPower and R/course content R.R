df <- data.frame(QUESTION1 = c(6, 6, 3, 5, 3, 4, 6, 3, 4, 6, 7, 7, 5, 3, 6, 2, 4, 5, 4, 5, 5, 3, 6, 6, 5, 5), 
                 QUESTION2 = c(3, 6, 5, 7, 1, 4, 1, 3, 1, 2, 1, 3, 3, 2, 1, 1, 3, 6, 1, 3, 2, 2, 2, 2, 2, 1)
                 
                 )

# Grouped Bar Plot
counts <- df(df.QUESTON1$vs, QUESTION2)
barplot(counts, main="Car Distribution by Gears and VS",
        xlab="Number of Gears", col=c("darkblue","red"),
        legend = rownames(counts), beside=TRUE)
