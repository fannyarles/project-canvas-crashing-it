# Crashing It!

[Click here to see deployed game](https://fannyarles.github.io/project-canvas-traffic-jam/)

## Description

Crashing It puts the player in charge of traffic control at a crossroad. They have to prevent collisions between cars, for that, they can stop each car by clicking on it. The game stops when a collision happens. The score is based on the numbers of cars that successfully crossed the map.

## MVP

- the game includes a splash screen
- the game includes a game over screen
- the game shows best scores
- the game can be re-started
- the game has four intersecting lanes
- cars are genereted on each lane randomly
- cars can be stopped by clicking on them
- the game is over when a collision happens

## Backlog

- add sound effects
- add random elements that cars can collide with
- add race cars that accelerate when the lane is empty
- give the possibility to switch payer

## Data structure

_List of classes and methods_

### game.js

- class Game
- class GameComponents
- displayGame()
- displaySplashScreen()
- displayGameOverScreen()
- updateGame()
- drawBackground()
- clearGame()
- handleSounds()
- checkLane()

### cars.js

- class Car extends GameComponents
- updateCars()
- clickCar()
- stopCarHonks()
- checkCarCrashes()

### dinos.js

- class Dino extends GameComponents
- generateDino()
- countDinos()
- stopAllDinos()
- checkDinoCrashes()

## States and States Transitions

- displayGame
- displaySplashScreen
- displayGameOverScreen

## Links

- [Github repository Link](https://github.com/fannyarles/project-canvas-traffic-jam)
- [Deployment Link](https://fannyarles.github.io/project-canvas-traffic-jam/)
- [Slides](https://docs.google.com/presentation/d/1Lg7rUDJ1BFEPtbAJYlU0vz3V8GCWV0fd-91CX-pJyvo/)
