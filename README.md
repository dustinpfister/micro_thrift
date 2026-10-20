# micro_thrift

Micro thrift aims to be a simulation of a thrift store including customers, workers, and items on a sales floor. As the player you have control over making decisions that effect the layout of the store in the floor state of the game.

## Revisions

For the first few revisions \(R0 to R4\) I wanted the focus to be on getting the project to actually start to feel like a game rather than just another unfinished prototype right away rather than putting that off. In the past I found myself getting into a habit where working on a game was playing the game. That might be good for continuing to work on the project, but it is not so great for speeding along into having a finished product right away.

## R3 - GameTime, Population, Staff state, Budget state

A GameTime system was added to have a way to simulate the flow of one day to another. The rate of time flow can potentially be adjusted to very slow speeds that are actually in line with real time or even slower, or much faster than that when it comes to what is typical of actual game play. For now I have a conf.MINUITES\_PER\_DAY constant to set what the fixed rate of flow should be. Game time effects things like the speed at which people will move around the map.

## R2 - Utils methods, UI api, map mutation

New utils object than contains methods that will be used throughout the over all code base. New User Interface features such as a grid of buttons class where also added at this time. The most important feature is that the player can now mutate the state of the map in the floor state, another feature that I want to add now rather than later.

## R1 - Button Class, main menu, save manager, and options states

Added some UI feature improvements, and additional states. In the past I would often put off working on a save manager but for this project I wanted to focus more on getting things like this out of the way sooner rather than later. Having a save state manager is a very important step to starting to get something together that feels like a finished product.

## R0 - Very basic core idea of the game started

Features that I added to the game at the start here include SImg class which allows for me to add sprites and other art assets by just directly typing in image data rather than having to load external image assets, as will as ObjPool to serve as an Object Pool class. Other assets include a map system, path finding, a state machine, and a pretty basic start for an AI.


