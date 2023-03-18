df <- data.frame(Q_1 = c(1, 2, 1, 1, 2, 1, 1, 2, 1, 2), 
                 Q_2 = c(3, 2, 3, 1, 1, 2, 3, 4, 2, 1),
                 Q_3 = c(1, 3, 4, 2, 4, 1, 2, 3, 4, 2),
                 Q_4 = c(1, 5, 4, 3, 2, 1, 1, 2, 3, 4),
                 Q_5 = c(2, 2, 3, 2, 2, 3, 4, 4, 4, 5))

boxplot(df,
        main="platform satisfaction",
        xlab="Question 2",
        ylab="score",
        col="orange",
        border="brown"
        )
