df <- data.frame(Student_Portal = c(6, 7, 6, 7, 6, 7, 6, 7, 2, 7, 7, 7, 5, 3, 6, 2, 6, 6, 7, 6, 6, 6, 7, 5, 6, 7), 
                 myUniSocial = c(7, 7, 5, 6, 6, 7, 2, 7, 7, 7, 5, 5, 7, 6, 7, 4, 4, 6, 5, 6, 5, 6, 6, 4, 7, 7))

boxplot(df,
        main="Prototype Platform (myUniSocial)",
        xlab="Questions",
        ylab="score",
        col="gray",
        border="black"
        )

