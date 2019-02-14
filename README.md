# fantasy-goat

## Description

Yahoo Fantasy Basketball allows players to build their "fantasy" NBA team and then each week a player will compete against another player in 9 different statistical categories. After the week is over, all players face against a different opponent for the following week. If player A is beating player B in a category then player A is awarded one point. If there are ties then no players get awarded a point. Therefore the most points a player can get in any given week is 9 points. 

While Yahoo Fantasy does provide a functionality to see how a player is doing against his/her opponent throughout the week, there isn't a functionality that provides a "what-if" scenario. To explain, if player A beats player B for week 1 how would player A know he/she would have fared against player C for that week? This is an helpful question especially if player A is facing player C the following week or the week after. 

What this application does is allow a player in my Yahoo Fantasy Basketball league to see how their team would have scored against any other player for any week. 

Web app uses React on the frontend and Django on the backend.


## Structure

The web app is mainly driven by making requests to the Yahoo Fantasy Sports API. The front end makes a request for stats from the Django server by supplying the desired week number. By default the stats retrieved upon entering the website will be stats for the current week. Once the Django server receives the desired week, it will make a request to the Yahoo Fantasy Sports server via their API and return the stats back to the front end.


## Demo

First demo below demonstrates the score two teams would receive if they were to face each other on the currently selected week. Note that for the TO category it is the team who has the lower amount that is awarded a point for that category. As you can see the score will change based on which teams are selected

![Scores](https://github.com/RodellRodriguez/fantasy-goat/blob/master/examples/scores.gif)


The second demo below demonstrates changing the selected week. By default the selected week is the current week in the Yahoo Fantasy Basketball league. At the time of writing this, it is currently the 18'th week in the league. Each time a week is selected, the front end calls the Django Rest API who then calls the appropriate stats for the requested week via the Yahoo Fantasy Sports API.

![Change Week](https://github.com/RodellRodriguez/fantasy-goat/blob/master/examples/change_weeks.gif)

